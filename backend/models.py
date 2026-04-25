from datetime import datetime
import uuid
from werkzeug.security import generate_password_hash, check_password_hash
try:
    from extensions import db
except ImportError:
    from .extensions import db

class Company(db.Model):
    __tablename__ = 'companies'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    domain = db.Column(db.String(100), unique=True, nullable=False)
    subscription_plan = db.Column(db.String(20), default='starter')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    users = db.relationship('User', backref='company', lazy=True, cascade='all, delete-orphan')
    brands = db.relationship('Brand', backref='company', lazy=True, cascade='all, delete-orphan')

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    role = db.Column(db.String(20), default='member')
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
    status = db.Column(db.String(20), default='planning')
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
    type = db.Column(db.String(50), nullable=False)
    content = db.Column(db.Text)
    file_url = db.Column(db.String(255))
    tags = db.Column(db.JSON)
    brand_id = db.Column(db.String(36), db.ForeignKey('brands.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)