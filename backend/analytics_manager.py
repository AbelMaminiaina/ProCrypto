"""
Analytics Manager
Handles visitor tracking and page view analytics
"""

import sqlite3
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List


class AnalyticsManager:
    def __init__(self, db_path='procrypto.db'):
        self.db_path = db_path
        self.init_db()

    def get_connection(self):
        """Get database connection"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def init_db(self):
        """Initialize analytics tables"""
        conn = self.get_connection()
        cursor = conn.cursor()

        # Visitors table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS visitors (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                visitor_id TEXT UNIQUE NOT NULL,
                user_id INTEGER,
                first_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                user_agent TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
            )
        ''')

        # Page views table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS page_views (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                visitor_id TEXT NOT NULL,
                page_path TEXT NOT NULL,
                page_title TEXT,
                referrer TEXT,
                viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                session_id TEXT,
                FOREIGN KEY (visitor_id) REFERENCES visitors(visitor_id) ON DELETE CASCADE
            )
        ''')

        # Create indexes for better performance
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_visitors_visitor_id ON visitors(visitor_id)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_visitors_user_id ON visitors(user_id)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_visitors_last_seen ON visitors(last_seen)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_page_views_visitor_id ON page_views(visitor_id)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_page_views_page_path ON page_views(page_path)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_page_views_viewed_at ON page_views(viewed_at)')

        conn.commit()
        conn.close()

    def record_visitor(self, visitor_id: str, user_id: Optional[int] = None, user_agent: Optional[str] = None) -> bool:
        """
        Record or update a visitor
        Creates new visitor or updates last_seen timestamp
        """
        try:
            conn = self.get_connection()
            cursor = conn.cursor()

            # Check if visitor exists
            cursor.execute('SELECT id FROM visitors WHERE visitor_id = ?', (visitor_id,))
            existing_visitor = cursor.fetchone()

            if existing_visitor:
                # Update last_seen and user_id (if provided)
                if user_id:
                    cursor.execute(
                        'UPDATE visitors SET last_seen = CURRENT_TIMESTAMP, user_id = ?, user_agent = ? WHERE visitor_id = ?',
                        (user_id, user_agent, visitor_id)
                    )
                else:
                    cursor.execute(
                        'UPDATE visitors SET last_seen = CURRENT_TIMESTAMP, user_agent = ? WHERE visitor_id = ?',
                        (user_agent, visitor_id)
                    )
            else:
                # Create new visitor
                cursor.execute(
                    'INSERT INTO visitors (visitor_id, user_id, user_agent) VALUES (?, ?, ?)',
                    (visitor_id, user_id, user_agent)
                )

            conn.commit()
            conn.close()
            return True

        except Exception as e:
            print(f"Error recording visitor: {e}")
            return False

    def record_page_view(self, visitor_id: str, page_path: str, page_title: Optional[str] = None,
                         referrer: Optional[str] = None, session_id: Optional[str] = None) -> bool:
        """Record a page view"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()

            cursor.execute(
                '''INSERT INTO page_views (visitor_id, page_path, page_title, referrer, session_id)
                   VALUES (?, ?, ?, ?, ?)''',
                (visitor_id, page_path, page_title, referrer, session_id)
            )

            conn.commit()
            conn.close()
            return True

        except Exception as e:
            print(f"Error recording page view: {e}")
            return False

    def get_total_visitors(self, days: int = 30) -> int:
        """Get total unique visitors in the last N days"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()

            cutoff_date = datetime.now() - timedelta(days=days)

            cursor.execute(
                '''SELECT COUNT(DISTINCT visitor_id) as count
                   FROM page_views
                   WHERE viewed_at >= ?''',
                (cutoff_date,)
            )

            result = cursor.fetchone()
            conn.close()

            return result['count'] if result else 0

        except Exception as e:
            print(f"Error getting total visitors: {e}")
            return 0

    def get_total_page_views(self, days: int = 30) -> int:
        """Get total page views in the last N days"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()

            cutoff_date = datetime.now() - timedelta(days=days)

            cursor.execute(
                '''SELECT COUNT(*) as count
                   FROM page_views
                   WHERE viewed_at >= ?''',
                (cutoff_date,)
            )

            result = cursor.fetchone()
            conn.close()

            return result['count'] if result else 0

        except Exception as e:
            print(f"Error getting total page views: {e}")
            return 0

    def get_popular_pages(self, limit: int = 10, days: int = 30) -> List[Dict[str, Any]]:
        """Get most popular pages by view count"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()

            cutoff_date = datetime.now() - timedelta(days=days)

            cursor.execute(
                '''SELECT page_path, page_title, COUNT(*) as view_count
                   FROM page_views
                   WHERE viewed_at >= ?
                   GROUP BY page_path
                   ORDER BY view_count DESC
                   LIMIT ?''',
                (cutoff_date, limit)
            )

            results = cursor.fetchall()
            conn.close()

            return [dict(row) for row in results]

        except Exception as e:
            print(f"Error getting popular pages: {e}")
            return []

    def get_daily_stats(self, days: int = 30) -> List[Dict[str, Any]]:
        """Get daily statistics (visitors and page views per day)"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()

            cutoff_date = datetime.now() - timedelta(days=days)

            cursor.execute(
                '''SELECT
                       DATE(viewed_at) as date,
                       COUNT(DISTINCT visitor_id) as visitors,
                       COUNT(*) as page_views
                   FROM page_views
                   WHERE viewed_at >= ?
                   GROUP BY DATE(viewed_at)
                   ORDER BY date ASC''',
                (cutoff_date,)
            )

            results = cursor.fetchall()
            conn.close()

            return [dict(row) for row in results]

        except Exception as e:
            print(f"Error getting daily stats: {e}")
            return []

    def get_recent_activity(self, limit: int = 50) -> List[Dict[str, Any]]:
        """Get recent page views with visitor information"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()

            cursor.execute(
                '''SELECT
                       pv.page_path,
                       pv.page_title,
                       pv.viewed_at,
                       pv.session_id,
                       v.user_id,
                       v.user_agent
                   FROM page_views pv
                   LEFT JOIN visitors v ON pv.visitor_id = v.visitor_id
                   ORDER BY pv.viewed_at DESC
                   LIMIT ?''',
                (limit,)
            )

            results = cursor.fetchall()
            conn.close()

            return [dict(row) for row in results]

        except Exception as e:
            print(f"Error getting recent activity: {e}")
            return []

    def get_authenticated_vs_anonymous(self, days: int = 30) -> Dict[str, int]:
        """Get ratio of authenticated vs anonymous visitors"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()

            cutoff_date = datetime.now() - timedelta(days=days)

            # Count authenticated visitors (with user_id)
            cursor.execute(
                '''SELECT COUNT(DISTINCT pv.visitor_id) as count
                   FROM page_views pv
                   JOIN visitors v ON pv.visitor_id = v.visitor_id
                   WHERE pv.viewed_at >= ? AND v.user_id IS NOT NULL''',
                (cutoff_date,)
            )
            authenticated = cursor.fetchone()['count']

            # Count anonymous visitors (without user_id)
            cursor.execute(
                '''SELECT COUNT(DISTINCT pv.visitor_id) as count
                   FROM page_views pv
                   JOIN visitors v ON pv.visitor_id = v.visitor_id
                   WHERE pv.viewed_at >= ? AND v.user_id IS NULL''',
                (cutoff_date,)
            )
            anonymous = cursor.fetchone()['count']

            conn.close()

            return {
                'authenticated': authenticated,
                'anonymous': anonymous,
                'total': authenticated + anonymous
            }

        except Exception as e:
            print(f"Error getting auth vs anonymous stats: {e}")
            return {'authenticated': 0, 'anonymous': 0, 'total': 0}
