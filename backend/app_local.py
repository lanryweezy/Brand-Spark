from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity, create_refresh_token
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import uuid

load_dotenv()

app = Flask(__name__)

# Configuration for local testing with SQLite
app.config['SECRET_KEY'] = 'dev-secret-key-for-testing'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///brandspark_local.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'jwt-secret-for-testing'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app, origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:8080"])

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

# Authentication Routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['email', 'password', 'first_name', 'last_name', 'company_name']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        # Create company
        company_domain = data['email'].split('@')[1]
        company = Company(
            name=data['company_name'],
            domain=company_domain
        )
        db.session.add(company)
        db.session.flush()  # Get company ID
        
        # Create user
        user = User(
            email=data['email'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            company_id=company.id,
            role='admin'  # First user is admin
        )
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

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
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

@app.route('/api/auth/me', methods=['GET'])
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
@app.route('/api/brands', methods=['GET'])
@jwt_required()
def get_brands():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
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

@app.route('/api/brands', methods=['POST'])
@jwt_required()
def create_brand():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        data = request.get_json()
        
        if not data.get('name'):
            return jsonify({'error': 'Brand name is required'}), 400
        
        brand = Brand(
            name=data['name'],
            description=data.get('description', ''),
            logo_url=data.get('logo_url'),
            primary_color=data.get('primary_color', '#3B82F6'),
            secondary_color=data.get('secondary_color', '#64748B'),
            company_id=user.company_id
        )
        
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
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Health check
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()})

# Test route
@app.route('/api/test', methods=['GET'])
def test_route():
    return jsonify({
        'message': 'Backend API is working!',
        'timestamp': datetime.utcnow().isoformat(),
        'database': 'SQLite (local testing)'
    })

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
        print("Database tables created successfully!")
        print("Starting Flask development server...")
    app.run(debug=True, port=5000)