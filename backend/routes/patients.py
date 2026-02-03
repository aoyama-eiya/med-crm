from flask import Blueprint, request, jsonify
from app import db
from models.patient import Patient

patients_bp = Blueprint("patients", __name__)


@patients_bp.route("/", methods=["GET"])
def get_patients():
    """患者一覧取得"""
    tenant_id = request.headers.get("X-Tenant-ID")
    if not tenant_id:
        return jsonify({"error": "Tenant ID required"}), 400
    
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 20, type=int)
    status = request.args.get("status", "active")
    search = request.args.get("search", "")
    
    query = Patient.query.filter_by(tenant_id=tenant_id)
    
    if status:
        query = query.filter_by(status=status)
    
    if search:
        query = query.filter(Patient.display_name.ilike(f"%{search}%"))
    
    query = query.order_by(Patient.created_at.desc())
    pagination = query.paginate(page=page, per_page=per_page)
    
    return jsonify({
        "patients": [p.to_dict() for p in pagination.items],
        "total": pagination.total,
        "pages": pagination.pages,
        "current_page": page
    })


@patients_bp.route("/<patient_id>", methods=["GET"])
def get_patient(patient_id):
    """患者詳細取得"""
    patient = Patient.query.get_or_404(patient_id)
    
    # 来院履歴も含める
    visits = [v.to_dict() for v in patient.visits.order_by(
        Patient.visits.property.mapper.class_.visit_date.desc()
    ).limit(10)]
    
    result = patient.to_dict()
    result["recent_visits"] = visits
    
    return jsonify(result)


@patients_bp.route("/<patient_id>", methods=["PATCH"])
def update_patient(patient_id):
    """患者情報更新"""
    patient = Patient.query.get_or_404(patient_id)
    data = request.json
    
    if "display_name" in data:
        patient.display_name = data["display_name"]
    if "status" in data:
        patient.status = data["status"]
    
    db.session.commit()
    return jsonify(patient.to_dict())
