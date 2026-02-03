import os
import stripe
from flask import Blueprint, request, jsonify
from app import db
from models.tenant import Tenant

billing_bp = Blueprint("billing", __name__)

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

# 料金プラン（Stripeで作成済みのPrice ID）
PRICE_ID = os.getenv("STRIPE_PRICE_ID", "price_xxxxx")


@billing_bp.route("/create-checkout", methods=["POST"])
def create_checkout_session():
    """Stripe Checkout セッション作成"""
    tenant_id = request.headers.get("X-Tenant-ID")
    if not tenant_id:
        return jsonify({"error": "Tenant ID required"}), 400
    
    tenant = Tenant.query.get_or_404(tenant_id)
    
    try:
        # Customerがない場合は作成
        if not tenant.stripe_customer_id:
            customer = stripe.Customer.create(
                metadata={"tenant_id": str(tenant.id)}
            )
            tenant.stripe_customer_id = customer.id
            db.session.commit()
        
        # Checkout Session作成
        session = stripe.checkout.Session.create(
            customer=tenant.stripe_customer_id,
            payment_method_types=["card"],
            line_items=[{
                "price": PRICE_ID,
                "quantity": 1
            }],
            mode="subscription",
            success_url=request.json.get("success_url", "http://localhost:3000/settings?success=true"),
            cancel_url=request.json.get("cancel_url", "http://localhost:3000/settings?canceled=true")
        )
        
        return jsonify({"checkout_url": session.url})
    
    except stripe.error.StripeError as e:
        return jsonify({"error": str(e)}), 400


@billing_bp.route("/portal", methods=["POST"])
def create_portal_session():
    """Stripe Customer Portal セッション作成"""
    tenant_id = request.headers.get("X-Tenant-ID")
    if not tenant_id:
        return jsonify({"error": "Tenant ID required"}), 400
    
    tenant = Tenant.query.get_or_404(tenant_id)
    
    if not tenant.stripe_customer_id:
        return jsonify({"error": "No billing setup"}), 400
    
    try:
        session = stripe.billing_portal.Session.create(
            customer=tenant.stripe_customer_id,
            return_url=request.json.get("return_url", "http://localhost:3000/settings")
        )
        return jsonify({"portal_url": session.url})
    
    except stripe.error.StripeError as e:
        return jsonify({"error": str(e)}), 400


@billing_bp.route("/webhook", methods=["POST"])
def stripe_webhook():
    """Stripe Webhook"""
    payload = request.data
    sig_header = request.headers.get("Stripe-Signature")
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
    
    try:
        event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
    except ValueError:
        return jsonify({"error": "Invalid payload"}), 400
    except stripe.error.SignatureVerificationError:
        return jsonify({"error": "Invalid signature"}), 400
    
    # イベント処理
    if event["type"] == "customer.subscription.created":
        handle_subscription_created(event["data"]["object"])
    elif event["type"] == "customer.subscription.updated":
        handle_subscription_updated(event["data"]["object"])
    elif event["type"] == "customer.subscription.deleted":
        handle_subscription_deleted(event["data"]["object"])
    
    return jsonify({"status": "ok"})


def handle_subscription_created(subscription):
    """サブスクリプション作成時"""
    customer_id = subscription["customer"]
    tenant = Tenant.query.filter_by(stripe_customer_id=customer_id).first()
    if tenant:
        tenant.subscription_status = "active"
        db.session.commit()


def handle_subscription_updated(subscription):
    """サブスクリプション更新時"""
    customer_id = subscription["customer"]
    status = subscription["status"]
    tenant = Tenant.query.filter_by(stripe_customer_id=customer_id).first()
    if tenant:
        tenant.subscription_status = status
        db.session.commit()


def handle_subscription_deleted(subscription):
    """サブスクリプション削除時"""
    customer_id = subscription["customer"]
    tenant = Tenant.query.filter_by(stripe_customer_id=customer_id).first()
    if tenant:
        tenant.subscription_status = "canceled"
        db.session.commit()
