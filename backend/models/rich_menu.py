import uuid
from datetime import datetime
from app import db
from sqlalchemy.dialects.postgresql import UUID, JSONB


class RichMenu(db.Model):
    """リッチメニュー設定モデル"""

    __tablename__ = "rich_menus"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = db.Column(
        UUID(as_uuid=True), db.ForeignKey("tenants.id"), nullable=False
    )
    line_rich_menu_id = db.Column(db.String(255))  # LINE側で生成されるID
    template_type = db.Column(
        db.String(50), nullable=False
    )  # simple, elderly, pediatric
    button_config = db.Column(JSONB)  # ボタン設定（URL、電話番号等）
    is_active = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    def to_dict(self):
        return {
            "id": str(self.id),
            "line_rich_menu_id": self.line_rich_menu_id,
            "template_type": self.template_type,
            "button_config": self.button_config,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat(),
        }
