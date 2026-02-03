from flask import Blueprint, request, jsonify
from app import db
from models.message_template import MessageTemplate

templates_bp = Blueprint("templates", __name__)


@templates_bp.route("/", methods=["GET"])
def get_templates():
    """テンプレート一覧取得"""
    tenant_id = request.headers.get("X-Tenant-ID")
    if not tenant_id:
        return jsonify({"error": "Tenant ID required"}), 400
    
    template_type = request.args.get("type")
    
    query = MessageTemplate.query.filter_by(tenant_id=tenant_id)
    
    if template_type:
        query = query.filter_by(type=template_type)
    
    templates = query.order_by(MessageTemplate.created_at.desc()).all()
    
    return jsonify([t.to_dict() for t in templates])


@templates_bp.route("/", methods=["POST"])
def create_template():
    """テンプレート作成"""
    tenant_id = request.headers.get("X-Tenant-ID")
    if not tenant_id:
        return jsonify({"error": "Tenant ID required"}), 400
    
    data = request.json
    
    template = MessageTemplate(
        tenant_id=tenant_id,
        type=data.get("type", "aftercare"),
        name=data.get("name"),
        content=data.get("content"),
        trigger_keywords=data.get("trigger_keywords"),
        is_active=data.get("is_active", True)
    )
    
    db.session.add(template)
    db.session.commit()
    
    return jsonify(template.to_dict()), 201


@templates_bp.route("/<template_id>", methods=["PUT"])
def update_template(template_id):
    """テンプレート更新"""
    template = MessageTemplate.query.get_or_404(template_id)
    data = request.json
    
    if "name" in data:
        template.name = data["name"]
    if "content" in data:
        template.content = data["content"]
    if "trigger_keywords" in data:
        template.trigger_keywords = data["trigger_keywords"]
    if "is_active" in data:
        template.is_active = data["is_active"]
    
    db.session.commit()
    
    return jsonify(template.to_dict())


@templates_bp.route("/<template_id>", methods=["DELETE"])
def delete_template(template_id):
    """テンプレート削除"""
    template = MessageTemplate.query.get_or_404(template_id)
    db.session.delete(template)
    db.session.commit()
    
    return jsonify({"status": "deleted"})


@templates_bp.route("/defaults", methods=["POST"])
def create_default_templates():
    """デフォルトテンプレートを一括作成"""
    tenant_id = request.headers.get("X-Tenant-ID")
    if not tenant_id:
        return jsonify({"error": "Tenant ID required"}), 400
    
    defaults = [
        {
            "type": "welcome",
            "name": "ウェルカムメッセージ",
            "content": "友だち追加ありがとうございます！\n当院からのお知らせや健康情報をお届けします。"
        },
        {
            "type": "aftercare",
            "name": "来院後フォロー",
            "content": "本日はご来院ありがとうございました。\nお薬の効き目はいかがですか？\n体調に変化があれば無理せずご連絡ください。"
        },
        {
            "type": "default_reply",
            "name": "通常応答",
            "content": "ご連絡ありがとうございます。\nお大事になさってください。"
        },
        {
            "type": "alert_reply",
            "name": "緊急応答",
            "content": "ご連絡ありがとうございます。\nお辛い状況お察しします。\n診察時間内にお電話いただくか、ご来院ください。"
        },
        {
            "type": "recall",
            "name": "休眠患者呼び戻し",
            "content": "お元気でいらっしゃいますか？\n最近体調はいかがですか？\n気になることがあればお気軽にご相談ください。"
        }
    ]
    
    created = []
    for tmpl_data in defaults:
        # 既存チェック
        existing = MessageTemplate.query.filter_by(
            tenant_id=tenant_id,
            type=tmpl_data["type"]
        ).first()
        
        if existing:
            continue
        
        template = MessageTemplate(
            tenant_id=tenant_id,
            **tmpl_data
        )
        db.session.add(template)
        created.append(template)
    
    db.session.commit()
    
    return jsonify({
        "created": len(created),
        "templates": [t.to_dict() for t in created]
    }), 201
