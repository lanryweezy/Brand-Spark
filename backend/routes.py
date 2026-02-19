from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity, create_refresh_token
from datetime import datetime

from .extensions import db
from .models import User, Company, Brand, Campaign

main_bp = Blueprint('main_bp', __name__, url_prefix='/api')

@main_bp.route('/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        required_fields = ['email', 'password', 'first_name', 'last_name', 'company_name']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        company_domain = data['email'].split('@')[1]
        company = Company(name=data['company_name'], domain=company_domain)
        db.session.add(company)
        db.session.flush()
        
        user = User(
            email=data['email'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            company_id=company.id,
            role='admin'
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
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

@main_bp.route('/auth/login', methods=['POST'])
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
        
        user.last_login = datetime.utcnow()
        db.session.commit()
        
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

@main_bp.route('/auth/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user_id = get_jwt_identity()
    new_token = create_access_token(identity=current_user_id)
    return jsonify({'access_token': new_token})

@main_bp.route('/auth/me', methods=['GET'])
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

@main_bp.route('/brands', methods=['GET'])
@jwt_required()
def get_brands():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    brands = Brand.query.filter_by(company_id=user.company_id).all()
    
    return jsonify([brand.to_dict() for brand in brands])

@main_bp.route('/brands', methods=['POST'])
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
        
        return jsonify(brand.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@main_bp.route('/campaigns', methods=['GET'])
@jwt_required()
def get_campaigns():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
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

@main_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()})