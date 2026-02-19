import os
from flask import Flask, jsonify
from dotenv import load_dotenv
from datetime import timedelta

def create_app():
    load_dotenv()
    app = Flask(__name__, instance_relative_config=True)

    app.config.from_mapping(
        SECRET_KEY=os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production'),
        SQLALCHEMY_DATABASE_URI=os.getenv('DATABASE_URL', f'sqlite:///{os.path.join(app.instance_path, "brandspark_local.db")}'),
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        JWT_SECRET_KEY=os.getenv('JWT_SECRET_KEY', 'jwt-secret-change-in-production'),
        JWT_ACCESS_TOKEN_EXPIRES=timedelta(hours=1),
        JWT_REFRESH_TOKEN_EXPIRES=timedelta(days=30),
    )

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    from .extensions import db, jwt, migrate, cors
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, origins=["http://localhost:5173", "https://app.brandspark.com"])

    from .blueprints.generate import generate_bp
    from .routes import main_bp
    app.register_blueprint(generate_bp)
    app.register_blueprint(main_bp)

    from . import models

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found'}), 404

    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

    return app