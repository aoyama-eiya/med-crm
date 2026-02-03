import requests
from typing import Optional


LINE_API_BASE = "https://api.line.me/v2/bot"


def send_line_message(access_token: str, user_id: str, message: str) -> bool:
    """プッシュメッセージ送信"""
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "to": user_id,
        "messages": [
            {"type": "text", "text": message}
        ]
    }
    
    response = requests.post(
        f"{LINE_API_BASE}/message/push",
        headers=headers,
        json=payload
    )
    
    return response.status_code == 200


def reply_line_message(access_token: str, reply_token: str, message: str) -> bool:
    """リプライメッセージ送信"""
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "replyToken": reply_token,
        "messages": [
            {"type": "text", "text": message}
        ]
    }
    
    response = requests.post(
        f"{LINE_API_BASE}/message/reply",
        headers=headers,
        json=payload
    )
    
    return response.status_code == 200


def multicast_line_message(access_token: str, user_ids: list, message: str) -> bool:
    """マルチキャストメッセージ送信（複数ユーザー同時）"""
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "to": user_ids,
        "messages": [
            {"type": "text", "text": message}
        ]
    }
    
    response = requests.post(
        f"{LINE_API_BASE}/message/multicast",
        headers=headers,
        json=payload
    )
    
    return response.status_code == 200


def get_user_profile(access_token: str, user_id: str) -> Optional[dict]:
    """ユーザープロフィール取得"""
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    
    response = requests.get(
        f"{LINE_API_BASE}/profile/{user_id}",
        headers=headers
    )
    
    if response.status_code == 200:
        return response.json()
    return None


def create_rich_menu(access_token: str, template: dict, button_config: dict) -> Optional[str]:
    """リッチメニュー作成"""
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    # アクションマッピング
    action_map = {
        "reserve": {"type": "uri", "uri": button_config.get("reserve_url", "https://example.com/reserve")},
        "call": {"type": "uri", "uri": f"tel:{button_config.get('phone', '0312345678')}"},
        "access": {"type": "uri", "uri": button_config.get("access_url", "https://maps.google.com")},
        "vaccine": {"type": "uri", "uri": button_config.get("vaccine_url", "https://example.com/vaccine")},
        "faq": {"type": "message", "text": "よくある質問"}
    }
    
    # エリア設定
    areas = []
    for area in template.get("areas", []):
        action_key = area.get("action_key")
        action = action_map.get(action_key, {"type": "message", "text": action_key})
        areas.append({
            "bounds": area["bounds"],
            "action": action
        })
    
    payload = {
        "size": template["size"],
        "selected": True,
        "name": template.get("name", "Menu"),
        "chatBarText": "メニュー",
        "areas": areas
    }
    
    response = requests.post(
        f"{LINE_API_BASE}/richmenu",
        headers=headers,
        json=payload
    )
    
    if response.status_code == 200:
        return response.json().get("richMenuId")
    return None


def set_default_rich_menu(access_token: str, rich_menu_id: str) -> bool:
    """リッチメニューをデフォルトに設定"""
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    
    response = requests.post(
        f"{LINE_API_BASE}/user/all/richmenu/{rich_menu_id}",
        headers=headers
    )
    
    return response.status_code == 200


def delete_rich_menu(access_token: str, rich_menu_id: str) -> bool:
    """リッチメニュー削除"""
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    
    response = requests.delete(
        f"{LINE_API_BASE}/richmenu/{rich_menu_id}",
        headers=headers
    )
    
    return response.status_code == 200
