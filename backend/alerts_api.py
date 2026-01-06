"""
Alerts API
Protected endpoints for managing price alerts
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import sqlite3
from datetime import datetime

alerts_bp = Blueprint('alerts', __name__)

def get_connection():
    """Get database connection"""
    conn = sqlite3.connect('procrypto.db')
    conn.row_factory = sqlite3.Row
    return conn


@alerts_bp.route('/api/alerts', methods=['GET'])
@jwt_required()
def get_alerts():
    """Get user's alerts"""
    try:
        user_id = int(get_jwt_identity())  # Convert string to int
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute('''
            SELECT id, crypto_id, symbol, name, target_price, condition, status, notified, created_at, triggered_at
            FROM alerts
            WHERE user_id = ?
            ORDER BY created_at DESC
        ''', (user_id,))

        alerts = []
        for row in cursor.fetchall():
            alerts.append({
                'id': str(row['id']),
                'cryptoId': row['crypto_id'],
                'symbol': row['symbol'],
                'name': row['name'],
                'targetPrice': row['target_price'],
                'condition': row['condition'],
                'status': row['status'],
                'notified': bool(row['notified']),
                'createdAt': row['created_at'],
                'triggeredAt': row['triggered_at']
            })

        conn.close()

        return jsonify({
            'success': True,
            'alerts': alerts
        }), 200

    except Exception as e:
        print(f"Error getting alerts: {e}")
        return jsonify({
            'success': False,
            'error': 'Erreur serveur'
        }), 500


@alerts_bp.route('/api/alerts', methods=['POST'])
@jwt_required()
def create_alert():
    """Create a new alert"""
    try:
        user_id = int(get_jwt_identity())  # Convert string to int
        data = request.get_json()

        # Validate required fields
        required_fields = ['cryptoId', 'symbol', 'name', 'targetPrice', 'condition']
        if not all(field in data for field in required_fields):
            return jsonify({
                'success': False,
                'error': 'Champs requis manquants'
            }), 400

        crypto_id = data['cryptoId']
        symbol = data['symbol']
        name = data['name']
        target_price = float(data['targetPrice'])
        condition = data['condition']

        # Validate condition
        if condition not in ['above', 'below']:
            return jsonify({
                'success': False,
                'error': 'Condition invalide'
            }), 400

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO alerts (user_id, crypto_id, symbol, name, target_price, condition)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (user_id, crypto_id, symbol, name, target_price, condition))

        alert_id = cursor.lastrowid

        conn.commit()
        conn.close()

        return jsonify({
            'success': True,
            'message': 'Alerte créée',
            'alert_id': alert_id
        }), 201

    except Exception as e:
        print(f"Error creating alert: {e}")
        return jsonify({
            'success': False,
            'error': 'Erreur serveur'
        }), 500


@alerts_bp.route('/api/alerts/<int:alert_id>', methods=['PUT'])
@jwt_required()
def update_alert(alert_id):
    """Update an alert"""
    try:
        user_id = int(get_jwt_identity())  # Convert string to int
        data = request.get_json()

        conn = get_connection()
        cursor = conn.cursor()

        # Verify ownership
        cursor.execute('SELECT id FROM alerts WHERE id = ? AND user_id = ?', (alert_id, user_id))
        if not cursor.fetchone():
            conn.close()
            return jsonify({
                'success': False,
                'error': 'Alerte introuvable'
            }), 404

        # Build update query
        update_fields = []
        params = []

        if 'targetPrice' in data:
            update_fields.append('target_price = ?')
            params.append(float(data['targetPrice']))

        if 'condition' in data:
            if data['condition'] not in ['above', 'below']:
                conn.close()
                return jsonify({
                    'success': False,
                    'error': 'Condition invalide'
                }), 400
            update_fields.append('condition = ?')
            params.append(data['condition'])

        if 'status' in data:
            if data['status'] not in ['active', 'triggered', 'disabled']:
                conn.close()
                return jsonify({
                    'success': False,
                    'error': 'Statut invalide'
                }), 400
            update_fields.append('status = ?')
            params.append(data['status'])

        if 'notified' in data:
            update_fields.append('notified = ?')
            params.append(1 if data['notified'] else 0)

        if 'triggeredAt' in data:
            update_fields.append('triggered_at = ?')
            params.append(data['triggeredAt'])

        if not update_fields:
            conn.close()
            return jsonify({
                'success': False,
                'error': 'Aucune mise à jour fournie'
            }), 400

        params.append(alert_id)

        query = f"UPDATE alerts SET {', '.join(update_fields)} WHERE id = ?"
        cursor.execute(query, params)

        conn.commit()
        conn.close()

        return jsonify({
            'success': True,
            'message': 'Alerte mise à jour'
        }), 200

    except Exception as e:
        print(f"Error updating alert: {e}")
        return jsonify({
            'success': False,
            'error': 'Erreur serveur'
        }), 500


@alerts_bp.route('/api/alerts/<int:alert_id>/trigger', methods=['POST'])
@jwt_required()
def trigger_alert(alert_id):
    """Mark an alert as triggered"""
    try:
        user_id = int(get_jwt_identity())  # Convert string to int

        conn = get_connection()
        cursor = conn.cursor()

        # Verify ownership and update
        cursor.execute('''
            UPDATE alerts
            SET status = 'triggered', notified = 1, triggered_at = CURRENT_TIMESTAMP
            WHERE id = ? AND user_id = ?
        ''', (alert_id, user_id))

        if cursor.rowcount == 0:
            conn.close()
            return jsonify({
                'success': False,
                'error': 'Alerte introuvable'
            }), 404

        conn.commit()
        conn.close()

        return jsonify({
            'success': True,
            'message': 'Alerte déclenchée'
        }), 200

    except Exception as e:
        print(f"Error triggering alert: {e}")
        return jsonify({
            'success': False,
            'error': 'Erreur serveur'
        }), 500


@alerts_bp.route('/api/alerts/<int:alert_id>/toggle', methods=['POST'])
@jwt_required()
def toggle_alert(alert_id):
    """Toggle alert status (active/disabled)"""
    try:
        user_id = int(get_jwt_identity())  # Convert string to int

        conn = get_connection()
        cursor = conn.cursor()

        # Get current status
        cursor.execute('SELECT status FROM alerts WHERE id = ? AND user_id = ?', (alert_id, user_id))
        row = cursor.fetchone()

        if not row:
            conn.close()
            return jsonify({
                'success': False,
                'error': 'Alerte introuvable'
            }), 404

        # Toggle status
        new_status = 'disabled' if row['status'] == 'active' else 'active'

        cursor.execute('UPDATE alerts SET status = ? WHERE id = ?', (new_status, alert_id))

        conn.commit()
        conn.close()

        return jsonify({
            'success': True,
            'message': f'Alerte {new_status}',
            'status': new_status
        }), 200

    except Exception as e:
        print(f"Error toggling alert: {e}")
        return jsonify({
            'success': False,
            'error': 'Erreur serveur'
        }), 500


@alerts_bp.route('/api/alerts/<int:alert_id>', methods=['DELETE'])
@jwt_required()
def delete_alert(alert_id):
    """Delete an alert"""
    try:
        user_id = int(get_jwt_identity())  # Convert string to int

        conn = get_connection()
        cursor = conn.cursor()

        # Verify ownership and delete
        cursor.execute('DELETE FROM alerts WHERE id = ? AND user_id = ?', (alert_id, user_id))

        if cursor.rowcount == 0:
            conn.close()
            return jsonify({
                'success': False,
                'error': 'Alerte introuvable'
            }), 404

        conn.commit()
        conn.close()

        return jsonify({
            'success': True,
            'message': 'Alerte supprimée'
        }), 200

    except Exception as e:
        print(f"Error deleting alert: {e}")
        return jsonify({
            'success': False,
            'error': 'Erreur serveur'
        }), 500


@alerts_bp.route('/api/alerts/clear', methods=['DELETE'])
@jwt_required()
def clear_alerts():
    """Clear all alerts"""
    try:
        user_id = int(get_jwt_identity())  # Convert string to int

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute('DELETE FROM alerts WHERE user_id = ?', (user_id,))

        conn.commit()
        count = cursor.rowcount
        conn.close()

        return jsonify({
            'success': True,
            'message': f'{count} alertes supprimées'
        }), 200

    except Exception as e:
        print(f"Error clearing alerts: {e}")
        return jsonify({
            'success': False,
            'error': 'Erreur serveur'
        }), 500


@alerts_bp.route('/api/alerts/active', methods=['GET'])
@jwt_required()
def get_active_alerts():
    """Get only active alerts"""
    try:
        user_id = int(get_jwt_identity())  # Convert string to int
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute('''
            SELECT id, crypto_id, symbol, name, target_price, condition, status, notified, created_at, triggered_at
            FROM alerts
            WHERE user_id = ? AND status = 'active'
            ORDER BY created_at DESC
        ''', (user_id,))

        alerts = []
        for row in cursor.fetchall():
            alerts.append({
                'id': str(row['id']),
                'cryptoId': row['crypto_id'],
                'symbol': row['symbol'],
                'name': row['name'],
                'targetPrice': row['target_price'],
                'condition': row['condition'],
                'status': row['status'],
                'notified': bool(row['notified']),
                'createdAt': row['created_at'],
                'triggeredAt': row['triggered_at']
            })

        conn.close()

        return jsonify({
            'success': True,
            'alerts': alerts
        }), 200

    except Exception as e:
        print(f"Error getting active alerts: {e}")
        return jsonify({
            'success': False,
            'error': 'Erreur serveur'
        }), 500
