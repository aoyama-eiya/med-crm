from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify
from sqlalchemy import func
from app import db
from models.patient import Patient
from models.visit import Visit
from models.message_log import MessageLog

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/stats", methods=["GET"])
def get_stats():
    """ダッシュボード統計"""
    tenant_id = request.headers.get("X-Tenant-ID")
    if not tenant_id:
        return jsonify({"error": "Tenant ID required"}), 400
    
    today = datetime.utcnow().date()
    
    # 友だち数（総数・アクティブ）
    total_patients = Patient.query.filter_by(tenant_id=tenant_id).count()
    active_patients = Patient.query.filter_by(tenant_id=tenant_id, status="active").count()
    
    # 本日の来院数
    today_visits = Visit.query.join(Patient).filter(
        Patient.tenant_id == tenant_id,
        func.date(Visit.visit_date) == today
    ).count()
    
    # 本日の配信数
    today_messages = MessageLog.query.join(Patient).filter(
        Patient.tenant_id == tenant_id,
        func.date(MessageLog.sent_at) == today
    ).count()
    
    # 今月の配信数
    first_of_month = today.replace(day=1)
    month_messages = MessageLog.query.join(Patient).filter(
        Patient.tenant_id == tenant_id,
        func.date(MessageLog.sent_at) >= first_of_month
    ).count()
    
    return jsonify({
        "total_patients": total_patients,
        "active_patients": active_patients,
        "today_visits": today_visits,
        "today_messages": today_messages,
        "month_messages": month_messages
    })


@dashboard_bp.route("/trends", methods=["GET"])
def get_trends():
    """トレンドデータ（グラフ用）"""
    tenant_id = request.headers.get("X-Tenant-ID")
    if not tenant_id:
        return jsonify({"error": "Tenant ID required"}), 400
    
    days = request.args.get("days", 30, type=int)
    end_date = datetime.utcnow().date()
    start_date = end_date - timedelta(days=days)
    
    # 日別友だち追加数
    new_patients = db.session.query(
        func.date(Patient.created_at).label("date"),
        func.count(Patient.id).label("count")
    ).filter(
        Patient.tenant_id == tenant_id,
        func.date(Patient.created_at) >= start_date
    ).group_by(func.date(Patient.created_at)).all()
    
    # 日別来院数
    daily_visits = db.session.query(
        func.date(Visit.visit_date).label("date"),
        func.count(Visit.id).label("count")
    ).join(Patient).filter(
        Patient.tenant_id == tenant_id,
        func.date(Visit.visit_date) >= start_date
    ).group_by(func.date(Visit.visit_date)).all()
    
    # 日別配信数
    daily_messages = db.session.query(
        func.date(MessageLog.sent_at).label("date"),
        func.count(MessageLog.id).label("count")
    ).join(Patient).filter(
        Patient.tenant_id == tenant_id,
        func.date(MessageLog.sent_at) >= start_date
    ).group_by(func.date(MessageLog.sent_at)).all()
    
    return jsonify({
        "new_patients": [{"date": str(r.date), "count": r.count} for r in new_patients],
        "daily_visits": [{"date": str(r.date), "count": r.count} for r in daily_visits],
        "daily_messages": [{"date": str(r.date), "count": r.count} for r in daily_messages]
    })
