from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity, create_refresh_token
from flask_cors import CORS
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import uuid
from sqlalchemy import text

# Sentry
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

# Validation
from marshmallow import Schema, fields, validate, ValidationError

# Support running as a script (python backend/app.py) and as a module (python -m backend.app)
try:
    from blueprints.generate import generate_bp  # type: ignore
except ImportError:
    from .blueprints.generate import generate_bp  # type: ignore

load_dotenv()

app = Flask(__name__)

# Initialize Sentry if DSN provided
SENTRY_DSN = os.getenv("SENTRY_DSN")
if SENTRY_DSN:
    sentry_sdk.init(
        dsn=SENTRY_DSN,
        integrations=[FlaskIntegration()],
        traces_sample_rate=float(os.getenv("SENTRY_TRACES_SAMPLE_RATE", "0.1")),
        profiles_sample_rate=float(os.getenv("SENTRY_PROFILES_SAMPLE_RATE", "0.0")),
        environment=os.getenv("FLASK_ENV", "development"),
        release=os.getenv("APP_VERSION", "0.1.0")
    )

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///brandspark.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)
CORS(app, origins=["http://localhost:5173", "http://localhost:3000", "https://app.brandspark.com"])

# Request ID header
from flask import g
import uuid as _uuid

@app.before_request
def inject_request_id():
    g.request_id = str(_uuid.uuid4())

@app.after_request
def add_request_id(response):
    try:
        response.headers['X-Request-ID'] = getattr(g, 'request_id', '')
    except Exception:
        pass
    return response

# Register Blueprints
app.register_blueprint(generate_bp)

# Models
class Company(db.Model):
    __tablename__ = 'companies'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    domain = db.Column(db.String(100), unique=True, nullable=False)
    subscription_plan = db.Column(db.String(20), default='starter')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    users = db.relationship('User', backref='company', lazy=True, cascade='all, delete-orphan')
    brands = db.relationship('Brand', backref='company', lazy=True, cascade='all, delete-orphan')

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    role = db.Column(db.String(20), default='member')  # admin, manager, member
    company_id = db.Column(db.String(36), db.ForeignKey('companies.id'), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'role': self.role,
            'company_id': self.company_id,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat(),
            'last_login': self.last_login.isoformat() if self.last_login else None
        }

class Brand(db.Model):
    __tablename__ = 'brands'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    logo_url = db.Column(db.String(255))
    primary_color = db.Column(db.String(7), default='#3B82F6')
    secondary_color = db.Column(db.String(7), default='#64748B')
    company_id = db.Column(db.String(36), db.ForeignKey('companies.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    campaigns = db.relationship('Campaign', backref='brand', lazy=True, cascade='all, delete-orphan')
    assets = db.relationship('Asset', backref='brand', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'logo_url': self.logo_url,
            'primary_color': self.primary_color,
            'secondary_color': self.secondary_color,
            'company_id': self.company_id,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Campaign(db.Model):
    __tablename__ = 'campaigns'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default='planning')  # planning, active, completed, archived
    budget = db.Column(db.Float, default=0)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    brand_id = db.Column(db.String(36), db.ForeignKey('brands.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Asset(db.Model):
    __tablename__ = 'assets'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(50), nullable=False)  # image, video, text, template
    content = db.Column(db.Text)
    file_url = db.Column(db.String(255))
    tags = db.Column(db.JSON)
    brand_id = db.Column(db.String(36), db.ForeignKey('brands.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Schemas
class RegisterSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True, validate=validate.Length(min=6))
    first_name = fields.String(required=True, validate=validate.Length(min=1))
    last_name = fields.String(required=True, validate=validate.Length(min=1))
    company_name = fields.String(required=True, validate=validate.Length(min=1))

class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True, validate=validate.Length(min=6))

# Authentication Routes
@app.route('/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json() or {}
        RegisterSchema().load(data)
        
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        # Create company
        company_domain = data['email'].split('@')[1]
        company = Company()
        company.name = data['company_name']
        company.domain = company_domain
        db.session.add(company)
        db.session.flush()  # Get company ID
        
        # Create user
        user = User()
        user.email = data['email']
        user.first_name = data['first_name']
        user.last_name = data['last_name']
        user.company_id = company.id
        user.role = 'admin'  # First user is admin
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        # Create access token
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        
        return jsonify({
            'message': 'Registration successful',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': user.to_dict(),
            'company': {
                'id': company.id,
                'name': company.name,
                'subscription_plan': company.subscription_plan
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json() or {}
        LoginSchema().load(data)
        
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        if not user.is_active:
            return jsonify({'error': 'Account is deactivated'}), 401
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # Create tokens
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': user.to_dict(),
            'company': {
                'id': user.company.id,
                'name': user.company.name,
                'subscription_plan': user.company.subscription_plan
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/auth/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user_id = get_jwt_identity()
    new_token = create_access_token(identity=current_user_id)
    return jsonify({'access_token': new_token})

@app.route('/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'user': user.to_dict(),
        'company': {
            'id': user.company.id,
            'name': user.company.name,
            'subscription_plan': user.company.subscription_plan
        }
    })

# Brand Routes
@app.route('/brands', methods=['GET'])
@jwt_required()
def get_brands():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    brands = Brand.query.filter_by(company_id=user.company_id).all()
    
    return jsonify([{
        'id': brand.id,
        'name': brand.name,
        'description': brand.description,
        'logo_url': brand.logo_url,
        'primary_color': brand.primary_color,
        'secondary_color': brand.secondary_color,
        'created_at': brand.created_at.isoformat()
    } for brand in brands])

@app.route('/brands', methods=['POST'])
@jwt_required()
def create_brand():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if not user:
            return jsonify({'error': 'Unauthorized'}), 401
        data = request.get_json()
        
        if not data.get('name'):
            return jsonify({'error': 'Brand name is required'}), 400
        
        brand = Brand()
        brand.name = data['name']
        brand.description = data.get('description', '')
        brand.logo_url = data.get('logo_url')
        brand.primary_color = data.get('primary_color', '#3B82F6')
        brand.secondary_color = data.get('secondary_color', '#64748B')
        brand.company_id = user.company_id
        
        db.session.add(brand)
        db.session.commit()
        
        return jsonify({
            'id': brand.id,
            'name': brand.name,
            'description': brand.description,
            'logo_url': brand.logo_url,
            'primary_color': brand.primary_color,
            'secondary_color': brand.secondary_color,
            'created_at': brand.created_at.isoformat()
        }), 201
        
    except ValidationError as ve:
        return jsonify({'error': 'Validation failed', 'details': ve.messages}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Campaign Routes
@app.route('/campaigns', methods=['GET'])
@jwt_required()
def get_campaigns():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    campaigns = db.session.query(Campaign).join(Brand).filter(
        Brand.company_id == user.company_id
    ).all()
    
    return jsonify([{
        'id': campaign.id,
        'name': campaign.name,
        'description': campaign.description,
        'status': campaign.status,
        'budget': campaign.budget,
        'start_date': campaign.start_date.isoformat() if campaign.start_date else None,
        'end_date': campaign.end_date.isoformat() if campaign.end_date else None,
        'brand_id': campaign.brand_id,
        'created_at': campaign.created_at.isoformat()
    } for campaign in campaigns])

# Jobs scaffold: Celery tasks endpoints
try:
    from tasks import celery_app
except ImportError:
    from .tasks import celery_app

@app.route('/jobs/submit_full_report', methods=['POST'])
@jwt_required()
def submit_full_report():
    current_user_id = get_jwt_identity()
    data = request.get_json() or {}
    brand_id = data.get('brandId')
    if not brand_id:
        return jsonify({'error': 'brandId is required'}), 400
    job = celery_app.send_task('tasks.generate_full_report', args=[current_user_id, brand_id])
    return jsonify({'job_id': job.id}), 202

@app.route('/jobs/<job_id>', methods=['GET'])
@jwt_required()
def job_status(job_id):
    res = celery_app.AsyncResult(job_id)
    state = res.state
    info = res.info if isinstance(res.info, dict) else {'message': str(res.info)} if res.info else {}
    return jsonify({'job_id': job_id, 'state': state, 'info': info})

# Version endpoint
@app.route('/version', methods=['GET'])
def version():
    return jsonify({'version': os.getenv('APP_VERSION', '0.1.0')})

# Readiness check (includes DB connectivity)
@app.route('/ready', methods=['GET'])
def ready_check():
    try:
        db.session.execute(text('SELECT 1'))
        return jsonify({'status': 'ready', 'timestamp': datetime.utcnow().isoformat()})
    except Exception as e:
        return jsonify({'status': 'degraded', 'error': str(e)}), 500

# Health check
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()})

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)