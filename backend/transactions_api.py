"""
Transactions API
Protected endpoints for managing user transactions
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import sqlite3
from datetime import datetime

transactions_bp = Blueprint('transactions', __name__)

def get_connection():
    """Get database connection"""
    conn = sqlite3.connect('procrypto.db')
    conn.row_factory = sqlite3.Row
    return conn


@transactions_bp.route('/api/transactions', methods=['GET'])
@jwt_required()
def get_transactions():
    """Get user's transactions"""
    try:
        user_id = int(get_jwt_identity())  # Convert string to int
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute('''
            SELECT id, crypto_id, symbol, name, type, quantity, price_per_unit, total_amount, date, notes, created_at
            FROM transactions
            WHERE user_id = ?
            ORDER BY date DESC
        ''', (user_id,))

        transactions = []
        for row in cursor.fetchall():
            transactions.append({
                'id': str(row['id']),
                'cryptoId': row['crypto_id'],
                'symbol': row['symbol'],
                'name': row['name'],
                'type': row['type'],
                'quantity': row['quantity'],
                'pricePerUnit': row['price_per_unit'],
                'totalAmount': row['total_amount'],
                'date': row['date'],
                'notes': row['notes'],
                'createdAt': row['created_at']
            })

        conn.close()

        return jsonify({
            'success': True,
            'transactions': transactions
        }), 200

    except Exception as e:
        print(f"Error getting transactions: {e}")
        return jsonify({
            'success': False,
            'error': 'Erreur serveur'
        }), 500


@transactions_bp.route('/api/transactions', methods=['POST'])
@jwt_required()
def add_transaction():
    """Add a transaction"""
    try:
        user_id = int(get_jwt_identity())  # Convert string to int
        data = request.get_json()

        # Validate required fields
        required_fields = ['cryptoId', 'symbol', 'name', 'type', 'quantity', 'pricePerUnit', 'date']
        if not all(field in data for field in required_fields):
            return jsonify({
                'success': False,
                'error': 'Champs requis manquants'
            }), 400

        crypto_id = data['cryptoId']
        symbol = data['symbol']
        name = data['name']
        transaction_type = data['type']
        quantity = float(data['quantity'])
        price_per_unit = float(data['pricePerUnit'])
        total_amount = quantity * price_per_unit
        date = data['date']
        notes = data.get('notes', None)

        # Validate transaction type
        if transaction_type not in ['buy', 'sell']:
            return jsonify({
                'success': False,
                'error': 'Type de transaction invalide'
            }), 400

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO transactions (user_id, crypto_id, symbol, name, type, quantity, price_per_unit, total_amount, date, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (user_id, crypto_id, symbol, name, transaction_type, quantity, price_per_unit, total_amount, date, notes))

        transaction_id = cursor.lastrowid

        conn.commit()
        conn.close()

        return jsonify({
            'success': True,
            'message': 'Transaction ajoutée',
            'transaction_id': transaction_id
        }), 201

    except Exception as e:
        print(f"Error adding transaction: {e}")
        return jsonify({
            'success': False,
            'error': 'Erreur serveur'
        }), 500


@transactions_bp.route('/api/transactions/<int:transaction_id>', methods=['DELETE'])
@jwt_required()
def delete_transaction(transaction_id):
    """Delete a transaction"""
    try:
        user_id = int(get_jwt_identity())  # Convert string to int

        conn = get_connection()
        cursor = conn.cursor()

        # Verify ownership and delete
        cursor.execute('DELETE FROM transactions WHERE id = ? AND user_id = ?', (transaction_id, user_id))

        if cursor.rowcount == 0:
            conn.close()
            return jsonify({
                'success': False,
                'error': 'Transaction introuvable'
            }), 404

        conn.commit()
        conn.close()

        return jsonify({
            'success': True,
            'message': 'Transaction supprimée'
        }), 200

    except Exception as e:
        print(f"Error deleting transaction: {e}")
        return jsonify({
            'success': False,
            'error': 'Erreur serveur'
        }), 500


@transactions_bp.route('/api/transactions/clear', methods=['DELETE'])
@jwt_required()
def clear_transactions():
    """Clear all transactions"""
    try:
        user_id = int(get_jwt_identity())  # Convert string to int

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute('DELETE FROM transactions WHERE user_id = ?', (user_id,))

        conn.commit()
        count = cursor.rowcount
        conn.close()

        return jsonify({
            'success': True,
            'message': f'{count} transactions supprimées'
        }), 200

    except Exception as e:
        print(f"Error clearing transactions: {e}")
        return jsonify({
            'success': False,
            'error': 'Erreur serveur'
        }), 500


@transactions_bp.route('/api/transactions/crypto/<crypto_id>', methods=['GET'])
@jwt_required()
def get_transactions_by_crypto(crypto_id):
    """Get transactions for a specific crypto"""
    try:
        user_id = int(get_jwt_identity())  # Convert string to int
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute('''
            SELECT id, crypto_id, symbol, name, type, quantity, price_per_unit, total_amount, date, notes, created_at
            FROM transactions
            WHERE user_id = ? AND crypto_id = ?
            ORDER BY date DESC
        ''', (user_id, crypto_id))

        transactions = []
        for row in cursor.fetchall():
            transactions.append({
                'id': str(row['id']),
                'cryptoId': row['crypto_id'],
                'symbol': row['symbol'],
                'name': row['name'],
                'type': row['type'],
                'quantity': row['quantity'],
                'pricePerUnit': row['price_per_unit'],
                'totalAmount': row['total_amount'],
                'date': row['date'],
                'notes': row['notes'],
                'createdAt': row['created_at']
            })

        conn.close()

        return jsonify({
            'success': True,
            'transactions': transactions
        }), 200

    except Exception as e:
        print(f"Error getting transactions by crypto: {e}")
        return jsonify({
            'success': False,
            'error': 'Erreur serveur'
        }), 500
