import os
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)

    # Configuration
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "DATABASE_URL", "postgresql://postgres:password@localhost:5432/medcrm"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret-key")

    # Initialize extensions
    CORS(app)
    db.init_app(app)

    # Register blueprints
    from routes.webhook import webhook_bp
    from routes.patients import patients_bp
    from routes.visits import visits_bp
    from routes.templates import templates_bp
    from routes.rich_menus import rich_menus_bp
    from routes.billing import billing_bp
    from routes.dashboard import dashboard_bp

    app.register_blueprint(webhook_bp, url_prefix="/api/webhook")
    app.register_blueprint(patients_bp, url_prefix="/api/patients")
    app.register_blueprint(visits_bp, url_prefix="/api/visits")
    app.register_blueprint(templates_bp, url_prefix="/api/templates")
    app.register_blueprint(rich_menus_bp, url_prefix="/api/rich-menus")
    app.register_blueprint(billing_bp, url_prefix="/api/billing")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")

    # Create tables
    with app.app_context():
        db.create_all()

    return app


if __name__ == "__main__":
    app = create_app()

    # Initialize scheduler
    from services.scheduler_service import init_scheduler
    init_scheduler(app)

    app.run(host="0.0.0.0", port=5000, debug=True)
