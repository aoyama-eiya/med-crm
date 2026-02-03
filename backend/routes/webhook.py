import os
import hashlib
import hmac
import base64
from flask import Blueprint, request, jsonify
from app import db
from models.patient import Patient
from models.tenant import Tenant
from models.message_template import MessageTemplate
from services.line_service import send_line_message

webhook_bp = Blueprint("webhook", __name__)


def verify_signature(body: bytes, signature: str, channel_secret: str) -> bool:
    """LINE署名検証"""
    hash = hmac.new(
        channel_secret.encode("utf-8"),
        body,
        hashlib.sha256
    ).digest()
    return hmac.compare_digest(signature, base64.b64encode(hash).decode("utf-8"))


@webhook_bp.route("/line/<tenant_id>", methods=["POST"])
def line_webhook(tenant_id):
    """LINE Webhookエンドポイント（テナント別）"""
    
    # テナント取得
    tenant = Tenant.query.get(tenant_id)
    if not tenant:
        return jsonify({"error": "Tenant not found"}), 404
    
    # 署名検証
    signature = request.headers.get("X-Line-Signature", "")
    if tenant.line_channel_secret:
        if not verify_signature(request.data, signature, tenant.line_channel_secret):
            return jsonify({"error": "Invalid signature"}), 400
    
    # イベント処理
    body = request.json
    events = body.get("events", [])
    
    for event in events:
        event_type = event.get("type")
        user_id = event.get("source", {}).get("userId")
        
        if event_type == "follow":
            # 友だち追加
            handle_follow_event(tenant, user_id, event)
        
        elif event_type == "unfollow":
            # ブロック
            handle_unfollow_event(tenant, user_id)
        
        elif event_type == "message":
            # メッセージ受信
            handle_message_event(tenant, user_id, event)
    
    return jsonify({"status": "ok"})


def handle_follow_event(tenant: Tenant, user_id: str, event: dict):
    """友だち追加イベント処理"""
    # 既存患者チェック
    patient = Patient.query.filter_by(
        tenant_id=tenant.id,
        line_user_id=user_id
    ).first()
    
    if patient:
        # 再フォロー
        patient.status = "active"
    else:
        # 新規患者
        patient = Patient(
            tenant_id=tenant.id,
            line_user_id=user_id,
            display_name=event.get("source", {}).get("displayName", ""),
            status="active"
        )
        db.session.add(patient)
    
    db.session.commit()
    
    # ウェルカムメッセージ送信
    welcome_template = MessageTemplate.query.filter_by(
        tenant_id=tenant.id,
        type="welcome",
        is_active=True
    ).first()
    
    if welcome_template:
        send_line_message(
            tenant.line_channel_access_token,
            user_id,
            welcome_template.content
        )


def handle_unfollow_event(tenant: Tenant, user_id: str):
    """ブロック（フォロー解除）イベント処理"""
    patient = Patient.query.filter_by(
        tenant_id=tenant.id,
        line_user_id=user_id
    ).first()
    
    if patient:
        patient.status = "blocked"
        db.session.commit()


def handle_message_event(tenant: Tenant, user_id: str, event: dict):
    """メッセージ受信イベント処理"""
    message = event.get("message", {})
    text = message.get("text", "")
    reply_token = event.get("replyToken")
    
    if not text:
        return
    
    # キーワードマッチング（痛い、合わない等）
    alert_keywords = ["痛い", "つらい", "合わない", "悪化", "副作用"]
    
    if any(keyword in text for keyword in alert_keywords):
        # 緊急応答テンプレート
        alert_template = MessageTemplate.query.filter_by(
            tenant_id=tenant.id,
            type="alert_reply",
            is_active=True
        ).first()
        
        if alert_template:
            reply_content = alert_template.content
        else:
            reply_content = "ご連絡ありがとうございます。診察時間内にお電話ください。"
    else:
        # 通常応答テンプレート
        default_template = MessageTemplate.query.filter_by(
            tenant_id=tenant.id,
            type="default_reply",
            is_active=True
        ).first()
        
        if default_template:
            reply_content = default_template.content
        else:
            reply_content = "お大事になさってください。"
    
    # リプライ送信
    from services.line_service import reply_line_message
    reply_line_message(tenant.line_channel_access_token, reply_token, reply_content)
