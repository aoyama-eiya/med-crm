import uuid
from datetime import datetime
from app import db
from sqlalchemy.dialects.postgresql import UUID


class Tenant(db.Model):
    """クリニック（テナント）モデル"""

    __tablename__ = "tenants"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    clinic_name = db.Column(db.String(255), nullable=False)
    line_channel_id = db.Column(db.String(255))
    line_channel_secret = db.Column(db.String(255))
    line_channel_access_token = db.Column(db.Text)
    stripe_customer_id = db.Column(db.String(255))
    subscription_status = db.Column(
        db.String(50), default="trial"
    )  # trial, active, canceled
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    patients = db.relationship("Patient", backref="tenant", lazy="dynamic")
    message_templates = db.relationship(
        "MessageTemplate", backref="tenant", lazy="dynamic"
    )
    rich_menus = db.relationship("RichMenu", backref="tenant", lazy="dynamic")

    def to_dict(self):
        return {
            "id": str(self.id),
            "clinic_name": self.clinic_name,
            "subscription_status": self.subscription_status,
            "created_at": self.created_at.isoformat(),
        }
