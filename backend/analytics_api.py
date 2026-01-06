"""
Analytics API
Handles analytics tracking and statistics endpoints
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from analytics_manager import AnalyticsManager
import os

analytics_bp = Blueprint('analytics', __name__)
analytics_manager = AnalyticsManager()


def verify_admin_key():
    """Verify admin key from request headers"""
    admin_key = request.headers.get('X-Admin-Key')
    expected_key = os.getenv('ANALYTICS_ADMIN_KEY', 'admin123')

    if admin_key != expected_key:
        return jsonify({
            'success': False,
            'error': 'Unauthorized - Invalid admin key'
        }), 401

    return None


@analytics_bp.route('/api/analytics/track', methods=['POST'])
@jwt_required(optional=True)
def track_page_view():
    """
    Track a page view (public endpoint)
    Automatically associates user_id if JWT token is present
    """
    try:
        data = request.get_json()

        # Validate required fields
        if not data or 'visitor_id' not in data or 'page_path' not in data:
            return jsonify({
                'success': False,
                'error': 'visitor_id and page_path are required'
            }), 400

        visitor_id = data.get('visitor_id')
        page_path = data.get('page_path')
        page_title = data.get('page_title')
        referrer = data.get('referrer')
        session_id = data.get('session_id')
        user_agent = data.get('user_agent')

        # Get user_id from JWT if authenticated
        user_id = None
        try:
            identity = get_jwt_identity()
            if identity:
                user_id = int(identity)
        except:
            pass  # User not authenticated, that's fine

        # Record visitor (creates or updates)
        analytics_manager.record_visitor(visitor_id, user_id, user_agent)

        # Record page view
        analytics_manager.record_page_view(
            visitor_id,
            page_path,
            page_title,
            referrer,
            session_id
        )

        return jsonify({
            'success': True,
            'message': 'Page view tracked successfully'
        }), 200

    except Exception as e:
        print(f"Error tracking page view: {e}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500


@analytics_bp.route('/api/analytics/stats', methods=['GET'])
def get_stats():
    """Get analytics statistics (admin only)"""
    # Verify admin key
    auth_error = verify_admin_key()
    if auth_error:
        return auth_error

    try:
        days = request.args.get('days', 30, type=int)

        total_visitors = analytics_manager.get_total_visitors(days)
        total_page_views = analytics_manager.get_total_page_views(days)

        # Calculate average views per visitor
        avg_views_per_visitor = round(total_page_views / total_visitors, 2) if total_visitors > 0 else 0

        # Get authenticated vs anonymous
        auth_stats = analytics_manager.get_authenticated_vs_anonymous(days)

        return jsonify({
            'success': True,
            'stats': {
                'total_visitors': total_visitors,
                'total_page_views': total_page_views,
                'avg_views_per_visitor': avg_views_per_visitor,
                'authenticated_visitors': auth_stats['authenticated'],
                'anonymous_visitors': auth_stats['anonymous'],
                'period_days': days
            }
        }), 200

    except Exception as e:
        print(f"Error getting stats: {e}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500


@analytics_bp.route('/api/analytics/popular-pages', methods=['GET'])
def get_popular_pages():
    """Get most popular pages (admin only)"""
    # Verify admin key
    auth_error = verify_admin_key()
    if auth_error:
        return auth_error

    try:
        days = request.args.get('days', 30, type=int)
        limit = request.args.get('limit', 10, type=int)

        popular_pages = analytics_manager.get_popular_pages(limit, days)

        return jsonify({
            'success': True,
            'popular_pages': popular_pages,
            'period_days': days
        }), 200

    except Exception as e:
        print(f"Error getting popular pages: {e}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500


@analytics_bp.route('/api/analytics/daily-stats', methods=['GET'])
def get_daily_stats():
    """Get daily statistics (admin only)"""
    # Verify admin key
    auth_error = verify_admin_key()
    if auth_error:
        return auth_error

    try:
        days = request.args.get('days', 30, type=int)

        daily_stats = analytics_manager.get_daily_stats(days)

        return jsonify({
            'success': True,
            'daily_stats': daily_stats,
            'period_days': days
        }), 200

    except Exception as e:
        print(f"Error getting daily stats: {e}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500


@analytics_bp.route('/api/analytics/recent-activity', methods=['GET'])
def get_recent_activity():
    """Get recent page views (admin only)"""
    # Verify admin key
    auth_error = verify_admin_key()
    if auth_error:
        return auth_error

    try:
        limit = request.args.get('limit', 50, type=int)

        recent_activity = analytics_manager.get_recent_activity(limit)

        return jsonify({
            'success': True,
            'recent_activity': recent_activity,
            'count': len(recent_activity)
        }), 200

    except Exception as e:
        print(f"Error getting recent activity: {e}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500
