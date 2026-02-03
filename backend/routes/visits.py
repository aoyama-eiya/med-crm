from datetime import datetime
from flask import Blueprint, request, jsonify
from app import db
from models.patient import Patient
from models.visit import Visit

visits_bp = Blueprint("visits", __name__)


@visits_bp.route("/", methods=["POST"])
def register_visit():
    """来院登録（単一）"""
    data = request.json
    patient_id = data.get("patient_id")
    visit_date = data.get("visit_date")
    
    if not patient_id:
        return jsonify({"error": "Patient ID required"}), 400
    
    patient = Patient.query.get_or_404(patient_id)
    
    # 来院記録作成
    visit = Visit(
        patient_id=patient_id,
        visit_date=datetime.fromisoformat(visit_date) if visit_date else datetime.utcnow(),
        notes=data.get("notes")
    )
    db.session.add(visit)
    
    # 患者の最終来院日更新
    patient.last_visit_at = visit.visit_date
    
    db.session.commit()
    
    return jsonify(visit.to_dict()), 201


@visits_bp.route("/bulk", methods=["POST"])
def register_visits_bulk():
    """来院登録（一括）- その日来た患者をまとめてチェック"""
    data = request.json
    patient_ids = data.get("patient_ids", [])
    visit_date = data.get("visit_date")
    
    if not patient_ids:
        return jsonify({"error": "Patient IDs required"}), 400
    
    visit_datetime = datetime.fromisoformat(visit_date) if visit_date else datetime.utcnow()
    created_visits = []
    
    for patient_id in patient_ids:
        patient = Patient.query.get(patient_id)
        if not patient:
            continue
        
        # 同日の重複チェック
        existing = Visit.query.filter(
            Visit.patient_id == patient_id,
            db.func.date(Visit.visit_date) == visit_datetime.date()
        ).first()
        
        if existing:
            continue
        
        visit = Visit(
            patient_id=patient_id,
            visit_date=visit_datetime
        )
        db.session.add(visit)
        patient.last_visit_at = visit_datetime
        created_visits.append(visit)
    
    db.session.commit()
    
    return jsonify({
        "created": len(created_visits),
        "visits": [v.to_dict() for v in created_visits]
    }), 201


@visits_bp.route("/today", methods=["GET"])
def get_today_visits():
    """本日の来院一覧"""
    tenant_id = request.headers.get("X-Tenant-ID")
    if not tenant_id:
        return jsonify({"error": "Tenant ID required"}), 400
    
    today = datetime.utcnow().date()
    
    visits = Visit.query.join(Patient).filter(
        Patient.tenant_id == tenant_id,
        db.func.date(Visit.visit_date) == today
    ).all()
    
    return jsonify({
        "date": today.isoformat(),
        "count": len(visits),
        "visits": [v.to_dict() for v in visits]
    })
