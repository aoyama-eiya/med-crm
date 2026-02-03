import uuid
from datetime import datetime
from app import db
from sqlalchemy.dialects.postgresql import UUID


class Visit(db.Model):
    """来院記録モデル"""

    __tablename__ = "visits"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = db.Column(
        UUID(as_uuid=True), db.ForeignKey("patients.id"), nullable=False
    )
    visit_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    aftercare_sent = db.Column(db.Boolean, default=False)
    aftercare_sent_at = db.Column(db.DateTime)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": str(self.id),
            "patient_id": str(self.patient_id),
            "visit_date": self.visit_date.isoformat(),
            "aftercare_sent": self.aftercare_sent,
            "aftercare_sent_at": self.aftercare_sent_at.isoformat()
            if self.aftercare_sent_at
            else None,
            "notes": self.notes,
        }
