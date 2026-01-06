"""
Portfolio API
Protected endpoints for managing user portfolio
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import sqlite3
from datetime import datetime

portfolio_bp = Blueprint('portfolio', __name__)

def get_connection():
    """Get database connection"""
    conn = sqlite3.connect('procrypto.db')
    conn.row_factory = sqlite3.Row
    return conn


@portfolio_bp.route('/api/portfolio', methods=['GET'])
@jwt_required()
def get_portfolio():
    """Get user's portfolio"""
    try:
        user_id = int(get_jwt_identity())  # Convert string to int
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute('''
            SELECT id, crypto_id, symbol, name, quantity, purchase_price, total_invested, created_at
            FROM portfolio
            WHERE user_id = ?
            ORDER BY created_at DESC
        ''', (user_id,))

        holdings = []
        for row in cursor.fetchall():
            holdings.append({
                'id': str(row['id']),
                'cryptoId': row['crypto_id'],
                'symbol': row['symbol'],
                'name': row['name'],
                'quantity': row['quantity'],
                'averagePurchasePrice': row['purchase_price'],
                'totalInvested': row['total_invested'],
                'addedAt': row['created_at']
            })

        conn.close()

        return jsonify({
            'success': True,
            'portfolio': holdings
        }), 200

    except Exception as e:
        print(f"Error getting portfolio: {e}")
        return jsonify({
            'success': False,
            'error': 'Erreur serveur'
        }), 500


@portfolio_bp.route('/api/portfolio', methods=['POST'])
@jwt_required()
def add_to_portfolio():
    """Add crypto to portfolio"""
    try:
        user_id = int(get_jwt_identity())  # Convert string to int
        data = request.get_json()

        # Validate required fields
        required_fields = ['cryptoId', 'symbol', 'name', 'quantity', 'purchasePrice']
        if not all(field in data for field in required_fields):
            return jsonify({
                'success': False,
                'error': 'Champs requis manquants'
            }), 400

        crypto_id = data['cryptoId']
        symbol = data['symbol']
        name = data['name']
        quantity = float(data['quantity'])
        purchase_price = float(data['purchasePrice'])
        total_invested = quantity * purchase_price

        conn = get_connection()
        cursor = conn.cursor()

        # Check if crypto already in portfolio
        cursor.execute('''
            SELECT id, quantity, total_invested
            FROM portfolio
            WHERE user_id = ? AND crypto_id = ?
        ''', (user_id, crypto_id))

        existing = cursor.fetchone()

        if existing:
            # Update existing holding (average price)
            new_quantity = existing['quantity'] + quantity
            new_total_invested = existing['total_invested'] + total_invested
            new_avg_price = new_total_invested / new_quantity

            cursor.execute('''
                UPDATE portfolio
                SET quantity = ?, purchase_price = ?, total_invested = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            ''', (new_quantity, new_avg_price, new_total_invested, existing['id']))

            holding_id = existing['id']
        else:
            # Insert new holding
            cursor.execute('''
                INSERT INTO portfolio (user_id, crypto_id, symbol, name, quantity, purchase_price, total_invested)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (user_id, crypto_id, symbol, name, quantity, purchase_price, total_invested))

            holding_id = cursor.lastrowid

        conn.commit()
        conn.close()

        return jsonify({
            'success': True,
            'message': 'Crypto ajoutée au portfolio',
            'holding_id': holding_id
        }), 201

    except Exception as e:
        print(f"Error adding to portfolio: {e}")
        return jsonify({
            'success': False,
            'error': 'Erreur serveur'
        }), 500


@portfolio_bp.route('/api/portfolio/<int:holding_id>', methods=['PUT'])
@jwt_required()
def update_portfolio_holding(holding_id):
    """Update a portfolio holding"""
    try:
        user_id = int(get_jwt_identity())  # Convert string to int
        data = request.get_json()

        conn = get_connection()
        cursor = conn.cursor()

        # Verify ownership
        cursor.execute('SELECT id FROM portfolio WHERE id = ? AND user_id = ?', (holding_id, user_id))
        if not cursor.fetchone():
            conn.close()
            return jsonify({
                'success': False,
                'error': 'Holding introuvable'
            }), 404

        # Update fields
        update_fields = []
        params = []

        if 'quantity' in data:
            update_fields.append('quantity = ?')
            params.append(float(data['quantity']))

        if 'purchasePrice' in data:
            update_fields.append('purchase_price = ?')
            params.append(float(data['purchasePrice']))

        if 'quantity' in data or 'purchasePrice' in data:
            # Recalculate total_invested
            cursor.execute('SELECT quantity, purchase_price FROM portfolio WHERE id = ?', (holding_id,))
            current = cursor.fetchone()

            new_quantity = float(data.get('quantity', current['quantity']))
            new_price = float(data.get('purchasePrice', current['purchase_price']))

            update_fields.append('total_invested = ?')
            params.append(new_quantity * new_price)

        if not update_fields:
            conn.close()
            return jsonify({
                'success': False,
                'error': 'Aucune mise à jour fournie'
            }), 400

        update_fields.append('updated_at = CURRENT_TIMESTAMP')
        params.append(holding_id)

        query = f"UPDATE portfolio SET {', '.join(update_fields)} WHERE id = ?"
        cursor.execute(query, params)

        conn.commit()
        conn.close()

        return jsonify({
            'success': True,
            'message': 'Holding mis à jour'
        }), 200

    except Exception as e:
        print(f"Error updating portfolio holding: {e}")
        return jsonify({
            'success': False,
            'error': 'Erreur serveur'
        }), 500


@portfolio_bp.route('/api/portfolio/<int:holding_id>', methods=['DELETE'])
@jwt_required()
def delete_portfolio_holding(holding_id):
    """Delete a portfolio holding"""
    try:
        user_id = int(get_jwt_identity())  # Convert string to int

        conn = get_connection()
        cursor = conn.cursor()

        # Verify ownership and delete
        cursor.execute('DELETE FROM portfolio WHERE id = ? AND user_id = ?', (holding_id, user_id))

        if cursor.rowcount == 0:
            conn.close()
            return jsonify({
                'success': False,
                'error': 'Holding introuvable'
            }), 404

        conn.commit()
        conn.close()

        return jsonify({
            'success': True,
            'message': 'Holding supprimé'
        }), 200

    except Exception as e:
        print(f"Error deleting portfolio holding: {e}")
        return jsonify({
            'success': False,
            'error': 'Erreur serveur'
        }), 500


@portfolio_bp.route('/api/portfolio/clear', methods=['DELETE'])
@jwt_required()
def clear_portfolio():
    """Clear entire portfolio"""
    try:
        user_id = int(get_jwt_identity())  # Convert string to int

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute('DELETE FROM portfolio WHERE user_id = ?', (user_id,))

        conn.commit()
        count = cursor.rowcount
        conn.close()

        return jsonify({
            'success': True,
            'message': f'{count} holdings supprimés'
        }), 200

    except Exception as e:
        print(f"Error clearing portfolio: {e}")
        return jsonify({
            'success': False,
            'error': 'Erreur serveur'
        }), 500
