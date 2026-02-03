from flask import Blueprint, request, jsonify
from app import db
from models.rich_menu import RichMenu
from models.tenant import Tenant
from services.line_service import create_rich_menu, delete_rich_menu, set_default_rich_menu

rich_menus_bp = Blueprint("rich_menus", __name__)


# リッチメニューテンプレート定義
RICH_MENU_TEMPLATES = {
    "simple": {
        "name": "シンプル",
        "description": "予約・電話・アクセスの3ボタン",
        "size": {"width": 2500, "height": 843},
        "areas": [
            {"bounds": {"x": 0, "y": 0, "width": 833, "height": 843}, "action_key": "reserve"},
            {"bounds": {"x": 833, "y": 0, "width": 834, "height": 843}, "action_key": "call"},
            {"bounds": {"x": 1667, "y": 0, "width": 833, "height": 843}, "action_key": "access"}
        ]
    },
    "elderly": {
        "name": "高齢者向け",
        "description": "大きなボタン（電話・予約）",
        "size": {"width": 2500, "height": 1686},
        "areas": [
            {"bounds": {"x": 0, "y": 0, "width": 1250, "height": 1686}, "action_key": "call"},
            {"bounds": {"x": 1250, "y": 0, "width": 1250, "height": 1686}, "action_key": "reserve"}
        ]
    },
    "pediatric": {
        "name": "小児科向け",
        "description": "予防接種・予約・電話・Q&A",
        "size": {"width": 2500, "height": 1686},
        "areas": [
            {"bounds": {"x": 0, "y": 0, "width": 1250, "height": 843}, "action_key": "vaccine"},
            {"bounds": {"x": 1250, "y": 0, "width": 1250, "height": 843}, "action_key": "reserve"},
            {"bounds": {"x": 0, "y": 843, "width": 1250, "height": 843}, "action_key": "call"},
            {"bounds": {"x": 1250, "y": 843, "width": 1250, "height": 843}, "action_key": "faq"}
        ]
    }
}


@rich_menus_bp.route("/templates", methods=["GET"])
def get_templates():
    """利用可能なテンプレート一覧"""
    return jsonify(RICH_MENU_TEMPLATES)


@rich_menus_bp.route("/", methods=["GET"])
def get_rich_menus():
    """クリニックのリッチメニュー一覧"""
    tenant_id = request.headers.get("X-Tenant-ID")
    if not tenant_id:
        return jsonify({"error": "Tenant ID required"}), 400
    
    menus = RichMenu.query.filter_by(tenant_id=tenant_id).all()
    return jsonify([m.to_dict() for m in menus])


@rich_menus_bp.route("/", methods=["POST"])
def create_menu():
    """リッチメニュー作成"""
    tenant_id = request.headers.get("X-Tenant-ID")
    if not tenant_id:
        return jsonify({"error": "Tenant ID required"}), 400
    
    tenant = Tenant.query.get_or_404(tenant_id)
    data = request.json
    
    template_type = data.get("template_type", "simple")
    button_config = data.get("button_config", {})
    
    if template_type not in RICH_MENU_TEMPLATES:
        return jsonify({"error": "Invalid template type"}), 400
    
    # LINE APIでリッチメニュー作成
    template = RICH_MENU_TEMPLATES[template_type]
    line_menu_id = create_rich_menu(
        access_token=tenant.line_channel_access_token,
        template=template,
        button_config=button_config
    )
    
    if not line_menu_id:
        return jsonify({"error": "Failed to create rich menu on LINE"}), 500
    
    # DB保存
    menu = RichMenu(
        tenant_id=tenant_id,
        line_rich_menu_id=line_menu_id,
        template_type=template_type,
        button_config=button_config,
        is_active=False
    )
    db.session.add(menu)
    db.session.commit()
    
    return jsonify(menu.to_dict()), 201


@rich_menus_bp.route("/<menu_id>/activate", methods=["POST"])
def activate_menu(menu_id):
    """リッチメニューをデフォルトに設定"""
    menu = RichMenu.query.get_or_404(menu_id)
    tenant = Tenant.query.get(menu.tenant_id)
    
    # LINE APIでデフォルト設定
    success = set_default_rich_menu(
        access_token=tenant.line_channel_access_token,
        rich_menu_id=menu.line_rich_menu_id
    )
    
    if not success:
        return jsonify({"error": "Failed to activate rich menu"}), 500
    
    # 他のメニューを非アクティブに
    RichMenu.query.filter_by(tenant_id=menu.tenant_id).update({"is_active": False})
    menu.is_active = True
    db.session.commit()
    
    return jsonify(menu.to_dict())


@rich_menus_bp.route("/<menu_id>", methods=["DELETE"])
def delete_menu(menu_id):
    """リッチメニュー削除"""
    menu = RichMenu.query.get_or_404(menu_id)
    tenant = Tenant.query.get(menu.tenant_id)
    
    # LINE APIで削除
    delete_rich_menu(
        access_token=tenant.line_channel_access_token,
        rich_menu_id=menu.line_rich_menu_id
    )
    
    db.session.delete(menu)
    db.session.commit()
    
    return jsonify({"status": "deleted"})
