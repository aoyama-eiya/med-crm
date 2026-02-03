import uuid
from datetime import datetime
from app import db
from sqlalchemy.dialects.postgresql import UUID


class Patient(db.Model):
    """患者モデル（LINE友だち）"""

    __tablename__ = "patients"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = db.Column(
        UUID(as_uuid=True), db.ForeignKey("tenants.id"), nullable=False
    )
    line_user_id = db.Column(db.String(255), nullable=False)
    display_name = db.Column(db.String(255))
    picture_url = db.Column(db.Text)
    last_visit_at = db.Column(db.DateTime)
    status = db.Column(db.String(50), default="active")  # active, inactive, blocked
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Unique constraint: one LINE user per tenant
    __table_args__ = (
        db.UniqueConstraint("tenant_id", "line_user_id", name="uq_tenant_line_user"),
    )

    # Relationships
    visits = db.relationship("Visit", backref="patient", lazy="dynamic")
    message_logs = db.relationship("MessageLog", backref="patient", lazy="dynamic")

    def to_dict(self):
        return {
            "id": str(self.id),
            "line_user_id": self.line_user_id,
            "display_name": self.display_name,
            "picture_url": self.picture_url,
            "last_visit_at": self.last_visit_at.isoformat()
            if self.last_visit_at
            else None,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
        }
