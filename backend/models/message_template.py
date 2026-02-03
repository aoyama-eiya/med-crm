import uuid
from datetime import datetime
from app import db
from sqlalchemy.dialects.postgresql import UUID


class MessageTemplate(db.Model):
    """メッセージテンプレートモデル"""

    __tablename__ = "message_templates"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = db.Column(
        UUID(as_uuid=True), db.ForeignKey("tenants.id"), nullable=False
    )
    type = db.Column(
        db.String(50), nullable=False
    )  # aftercare, recall, seasonal, welcome
    name = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    trigger_keywords = db.Column(db.Text)  # カンマ区切りのキーワード（返信検知用）
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    def to_dict(self):
        return {
            "id": str(self.id),
            "type": self.type,
            "name": self.name,
            "content": self.content,
            "trigger_keywords": self.trigger_keywords,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat(),
        }
