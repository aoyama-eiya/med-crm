import uuid
from datetime import datetime
from app import db
from sqlalchemy.dialects.postgresql import UUID


class MessageLog(db.Model):
    """メッセージ送信ログモデル"""

    __tablename__ = "message_logs"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = db.Column(
        UUID(as_uuid=True), db.ForeignKey("patients.id"), nullable=False
    )
    message_type = db.Column(
        db.String(50), nullable=False
    )  # aftercare, recall, seasonal, reply
    content = db.Column(db.Text)
    status = db.Column(db.String(50), default="sent")  # sent, delivered, failed
    line_message_id = db.Column(db.String(255))
    sent_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": str(self.id),
            "patient_id": str(self.patient_id),
            "message_type": self.message_type,
            "content": self.content,
            "status": self.status,
            "sent_at": self.sent_at.isoformat(),
        }
