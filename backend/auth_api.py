"""
Authentication API
Handles login, registration, and JWT token management
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    get_jwt
)
from auth_manager import AuthManager
import re
from datetime import timedelta

auth_bp = Blueprint('auth', __name__)
auth_manager = AuthManager()

# JWT token expiration
ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
REFRESH_TOKEN_EXPIRES = timedelta(days=30)


def validate_email(email: str) -> bool:
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def validate_password(password: str) -> tuple[bool, str]:
    """
    Validate password strength
    Returns (is_valid, error_message)
    """
    if len(password) < 8:
        return False, "Le mot de passe doit contenir au moins 8 caractères"

    if not re.search(r'[A-Z]', password):
        return False, "Le mot de passe doit contenir au moins une majuscule"

    if not re.search(r'[a-z]', password):
        return False, "Le mot de passe doit contenir au moins une minuscule"

    if not re.search(r'[0-9]', password):
        return False, "Le mot de passe doit contenir au moins un chiffre"

    return True, ""


@auth_bp.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()

        # Validate required fields
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({
                'success': False,
                'error': 'Email et mot de passe requis'
            }), 400

        email = data['email'].lower().strip()
        password = data['password']

        # Validate email
        if not validate_email(email):
            return jsonify({
                'success': False,
                'error': 'Format d\'email invalide'
            }), 400

        # Validate password
        is_valid, error_msg = validate_password(password)
        if not is_valid:
            return jsonify({
                'success': False,
                'error': error_msg
            }), 400

        # Check if user already exists
        existing_user = auth_manager.get_user_by_email(email)
        if existing_user:
            return jsonify({
                'success': False,
                'error': 'Un compte existe déjà avec cet email'
            }), 409

        # Create user
        user = auth_manager.create_user(email, password)
        if not user:
            return jsonify({
                'success': False,
                'error': 'Erreur lors de la création du compte'
            }), 500

        # Create JWT tokens (identity must be string)
        access_token = create_access_token(
            identity=str(user['id']),
            expires_delta=ACCESS_TOKEN_EXPIRES
        )
        refresh_token = create_refresh_token(
            identity=str(user['id']),
            expires_delta=REFRESH_TOKEN_EXPIRES
        )

        return jsonify({
            'success': True,
            'message': 'Compte créé avec succès',
            'user': {
                'id': user['id'],
                'email': user['email']
            },
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 201

    except Exception as e:
        print(f"Error in register: {e}")
        return jsonify({
            'success': False,
            'error': 'Erreur serveur'
        }), 500


@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
    """Login user and return JWT tokens"""
    try:
        data = request.get_json()

        # Validate required fields
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({
                'success': False,
                'error': 'Email et mot de passe requis'
            }), 400

        email = data['email'].lower().strip()
        password = data['password']

        # Authenticate user
        user = auth_manager.authenticate_user(email, password)
        if not user:
            return jsonify({
                'success': False,
                'error': 'Email ou mot de passe incorrect'
            }), 401

        # Create JWT tokens (identity must be string)
        access_token = create_access_token(
            identity=str(user['id']),
            expires_delta=ACCESS_TOKEN_EXPIRES
        )
        refresh_token = create_refresh_token(
            identity=str(user['id']),
            expires_delta=REFRESH_TOKEN_EXPIRES
        )

        return jsonify({
            'success': True,
            'message': 'Connexion réussie',
            'user': {
                'id': user['id'],
                'email': user['email']
            },
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 200

    except Exception as e:
        print(f"Error in login: {e}")
        return jsonify({
            'success': False,
            'error': 'Erreur serveur'
        }), 500


@auth_bp.route('/api/auth/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token using refresh token"""
    try:
        user_id = get_jwt_identity()  # Already a string from JWT

        # Create new access token
        access_token = create_access_token(
            identity=user_id,  # Keep as string
            expires_delta=ACCESS_TOKEN_EXPIRES
        )

        return jsonify({
            'success': True,
            'access_token': access_token
        }), 200

    except Exception as e:
        print(f"Error in refresh: {e}")
        return jsonify({
            'success': False,
            'error': 'Erreur serveur'
        }), 500


@auth_bp.route('/api/auth/verify', methods=['GET'])
@jwt_required()
def verify():
    """Verify JWT token and return user info"""
    try:
        user_id = int(get_jwt_identity())  # Convert string to int

        # Get user info
        user = auth_manager.get_user_by_id(user_id)
        if not user:
            return jsonify({
                'success': False,
                'error': 'Utilisateur introuvable'
            }), 404

        return jsonify({
            'success': True,
            'user': {
                'id': user['id'],
                'email': user['email']
            }
        }), 200

    except Exception as e:
        print(f"Error in verify: {e}")
        return jsonify({
            'success': False,
            'error': 'Erreur serveur'
        }), 500


@auth_bp.route('/api/auth/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout user (client-side token removal)"""
    # In a production app, you might want to blacklist the token
    # For now, we'll just return success and let the client remove the token
    return jsonify({
        'success': True,
        'message': 'Déconnexion réussie'
    }), 200


@auth_bp.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current user information"""
    try:
        user_id = int(get_jwt_identity())  # Convert string to int

        user = auth_manager.get_user_by_id(user_id)
        if not user:
            return jsonify({
                'success': False,
                'error': 'Utilisateur introuvable'
            }), 404

        return jsonify({
            'success': True,
            'user': {
                'id': user['id'],
                'email': user['email'],
                'created_at': user['created_at']
            }
        }), 200

    except Exception as e:
        print(f"Error in get_current_user: {e}")
        return jsonify({
            'success': False,
            'error': 'Erreur serveur'
        }), 500


@auth_bp.route('/api/auth/change-password', methods=['PUT'])
@jwt_required()
def change_password():
    """Change user password"""
    try:
        user_id = int(get_jwt_identity())  # Convert string to int
        data = request.get_json()

        if not data or 'current_password' not in data or 'new_password' not in data:
            return jsonify({
                'success': False,
                'error': 'Mot de passe actuel et nouveau mot de passe requis'
            }), 400

        # Get user
        user = auth_manager.get_user_by_id(user_id)
        if not user:
            return jsonify({
                'success': False,
                'error': 'Utilisateur introuvable'
            }), 404

        # Verify current password
        authenticated = auth_manager.authenticate_user(user['email'], data['current_password'])
        if not authenticated:
            return jsonify({
                'success': False,
                'error': 'Mot de passe actuel incorrect'
            }), 401

        # Validate new password
        is_valid, error_msg = validate_password(data['new_password'])
        if not is_valid:
            return jsonify({
                'success': False,
                'error': error_msg
            }), 400

        # Update password
        success = auth_manager.update_password(user_id, data['new_password'])
        if not success:
            return jsonify({
                'success': False,
                'error': 'Erreur lors de la mise à jour du mot de passe'
            }), 500

        return jsonify({
            'success': True,
            'message': 'Mot de passe mis à jour avec succès'
        }), 200

    except Exception as e:
        print(f"Error in change_password: {e}")
        return jsonify({
            'success': False,
            'error': 'Erreur serveur'
        }), 500
