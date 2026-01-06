"""
Authentication Manager
Handles user authentication, registration, and JWT tokens
"""

import sqlite3
import bcrypt
from datetime import datetime, timedelta
from typing import Optional, Dict, Any


class AuthManager:
    def __init__(self, db_path='procrypto.db'):
        self.db_path = db_path
        self.init_db()

    def get_connection(self):
        """Get database connection"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def init_db(self):
        """Initialize authentication tables"""
        conn = self.get_connection()
        cursor = conn.cursor()

        # Users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # Portfolio table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS portfolio (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                crypto_id TEXT NOT NULL,
                symbol TEXT NOT NULL,
                name TEXT NOT NULL,
                quantity REAL NOT NULL,
                purchase_price REAL NOT NULL,
                total_invested REAL NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE(user_id, crypto_id)
            )
        ''')

        # Transactions table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                crypto_id TEXT NOT NULL,
                symbol TEXT NOT NULL,
                name TEXT NOT NULL,
                type TEXT NOT NULL CHECK(type IN ('buy', 'sell')),
                quantity REAL NOT NULL,
                price_per_unit REAL NOT NULL,
                total_amount REAL NOT NULL,
                date TIMESTAMP NOT NULL,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        ''')

        # Alerts table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS alerts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                crypto_id TEXT NOT NULL,
                symbol TEXT NOT NULL,
                name TEXT NOT NULL,
                target_price REAL NOT NULL,
                condition TEXT NOT NULL CHECK(condition IN ('above', 'below')),
                status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'triggered', 'disabled')),
                notified BOOLEAN NOT NULL DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                triggered_at TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        ''')

        # Create indexes for better performance
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_portfolio_user ON portfolio(user_id)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_alerts_user ON alerts(user_id)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status)')

        conn.commit()
        conn.close()

    def hash_password(self, password: str) -> str:
        """Hash a password using bcrypt"""
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

    def verify_password(self, password: str, password_hash: str) -> bool:
        """Verify a password against its hash"""
        return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))

    def create_user(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        """Create a new user"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()

            # Hash the password
            password_hash = self.hash_password(password)

            # Insert user
            cursor.execute(
                'INSERT INTO users (email, password_hash) VALUES (?, ?)',
                (email, password_hash)
            )

            user_id = cursor.lastrowid
            conn.commit()
            conn.close()

            return {
                'id': user_id,
                'email': email,
                'created_at': datetime.now().isoformat()
            }

        except sqlite3.IntegrityError:
            # Email already exists
            return None
        except Exception as e:
            print(f"Error creating user: {e}")
            return None

    def authenticate_user(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        """Authenticate a user and return user info if valid"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()

            # Get user by email
            cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
            user = cursor.fetchone()
            conn.close()

            if not user:
                return None

            # Verify password
            if not self.verify_password(password, user['password_hash']):
                return None

            # Return user info (without password hash)
            return {
                'id': user['id'],
                'email': user['email'],
                'created_at': user['created_at']
            }

        except Exception as e:
            print(f"Error authenticating user: {e}")
            return None

    def get_user_by_id(self, user_id: int) -> Optional[Dict[str, Any]]:
        """Get user by ID"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()

            cursor.execute('SELECT id, email, created_at FROM users WHERE id = ?', (user_id,))
            user = cursor.fetchone()
            conn.close()

            if not user:
                return None

            return {
                'id': user['id'],
                'email': user['email'],
                'created_at': user['created_at']
            }

        except Exception as e:
            print(f"Error getting user: {e}")
            return None

    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Get user by email"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()

            cursor.execute('SELECT id, email, created_at FROM users WHERE email = ?', (email,))
            user = cursor.fetchone()
            conn.close()

            if not user:
                return None

            return {
                'id': user['id'],
                'email': user['email'],
                'created_at': user['created_at']
            }

        except Exception as e:
            print(f"Error getting user by email: {e}")
            return None

    def update_password(self, user_id: int, new_password: str) -> bool:
        """Update user password"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()

            password_hash = self.hash_password(new_password)

            cursor.execute(
                'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                (password_hash, user_id)
            )

            conn.commit()
            success = cursor.rowcount > 0
            conn.close()

            return success

        except Exception as e:
            print(f"Error updating password: {e}")
            return False

    def delete_user(self, user_id: int) -> bool:
        """Delete a user and all associated data"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()

            cursor.execute('DELETE FROM users WHERE id = ?', (user_id,))

            conn.commit()
            success = cursor.rowcount > 0
            conn.close()

            return success

        except Exception as e:
            print(f"Error deleting user: {e}")
            return False
