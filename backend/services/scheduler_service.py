from datetime import datetime, timedelta
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger

scheduler = BackgroundScheduler()


def init_scheduler(app):
    """スケジューラー初期化"""
    
    with app.app_context():
        # アフターフォロー（毎時実行）
        scheduler.add_job(
            func=lambda: run_with_app_context(app, process_aftercare),
            trigger=CronTrigger(minute=0),  # 毎時0分
            id="aftercare_job",
            replace_existing=True
        )
        
        # リコール（毎日9時）
        scheduler.add_job(
            func=lambda: run_with_app_context(app, process_recall),
            trigger=CronTrigger(hour=9, minute=0),  # 毎日9:00
            id="recall_job",
            replace_existing=True
        )
        
        scheduler.start()
        print("Scheduler started with jobs: aftercare_job, recall_job")


def run_with_app_context(app, func):
    """Flaskアプリコンテキスト内で実行"""
    with app.app_context():
        func()


def process_aftercare():
    """アフターフォロー処理（来院24時間後にメッセージ送信）"""
    from app import db
    from models.visit import Visit
    from models.patient import Patient
    from models.tenant import Tenant
    from models.message_template import MessageTemplate
    from models.message_log import MessageLog
    from services.line_service import send_line_message
    
    now = datetime.utcnow()
    # 23〜25時間前に来院した患者を対象（1時間の幅をもたせる）
    target_start = now - timedelta(hours=25)
    target_end = now - timedelta(hours=23)
    
    visits = Visit.query.filter(
        Visit.visit_date >= target_start,
        Visit.visit_date < target_end,
        Visit.aftercare_sent == False
    ).all()
    
    for visit in visits:
        patient = Patient.query.get(visit.patient_id)
        if not patient or patient.status != "active":
            continue
        
        tenant = Tenant.query.get(patient.tenant_id)
        if not tenant or not tenant.line_channel_access_token:
            continue
        
        # テンプレート取得
        template = MessageTemplate.query.filter_by(
            tenant_id=tenant.id,
            type="aftercare",
            is_active=True
        ).first()
        
        if not template:
            continue
        
        # メッセージ送信
        message = template.content.replace("{name}", patient.display_name or "患者様")
        success = send_line_message(
            tenant.line_channel_access_token,
            patient.line_user_id,
            message
        )
        
        if success:
            visit.aftercare_sent = True
            visit.aftercare_sent_at = datetime.utcnow()
            
            # ログ記録
            log = MessageLog(
                patient_id=patient.id,
                message_type="aftercare",
                content=message,
                status="sent"
            )
            db.session.add(log)
    
    db.session.commit()
    print(f"Aftercare processed: {len(visits)} visits")


def process_recall():
    """リコール処理（休眠患者への呼び戻し）"""
    from app import db
    from models.patient import Patient
    from models.tenant import Tenant
    from models.message_template import MessageTemplate
    from models.message_log import MessageLog
    from services.line_service import multicast_line_message
    
    now = datetime.utcnow()
    # 90日以上来院していない患者
    dormant_threshold = now - timedelta(days=90)
    
    # テナントごとに処理
    tenants = Tenant.query.filter(
        Tenant.subscription_status == "active"
    ).all()
    
    for tenant in tenants:
        if not tenant.line_channel_access_token:
            continue
        
        # リコールテンプレート取得
        template = MessageTemplate.query.filter_by(
            tenant_id=tenant.id,
            type="recall",
            is_active=True
        ).first()
        
        if not template:
            continue
        
        # 休眠患者取得
        dormant_patients = Patient.query.filter(
            Patient.tenant_id == tenant.id,
            Patient.status == "active",
            Patient.last_visit_at < dormant_threshold
        ).limit(500).all()  # LINE APIの制限
        
        if not dormant_patients:
            continue
        
        # マルチキャスト送信
        user_ids = [p.line_user_id for p in dormant_patients]
        success = multicast_line_message(
            tenant.line_channel_access_token,
            user_ids,
            template.content
        )
        
        if success:
            # ログ記録
            for patient in dormant_patients:
                log = MessageLog(
                    patient_id=patient.id,
                    message_type="recall",
                    content=template.content,
                    status="sent"
                )
                db.session.add(log)
    
    db.session.commit()
    print(f"Recall processed for {len(tenants)} tenants")
