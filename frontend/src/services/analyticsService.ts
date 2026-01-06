import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import type { AnalyticsStats, PopularPage, DailyStats, RecentActivity } from '../types/analytics';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// LocalStorage and SessionStorage keys
const VISITOR_ID_KEY = 'procrypto_visitor_id';
const SESSION_ID_KEY = 'procrypto_session_id';
const ADMIN_KEY_SESSION = 'procrypto_admin_key';

/**
 * Get or create visitor ID (persistent across sessions)
 * Stored in localStorage
 */
export const getVisitorId = (): string => {
  let visitorId = localStorage.getItem(VISITOR_ID_KEY);
  if (!visitorId) {
    visitorId = uuidv4();
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }
  return visitorId;
};

/**
 * Get or create session ID (per browser session)
 * Stored in sessionStorage
 */
export const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = uuidv4();
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  return sessionId;
};

/**
 * Track a page view
 * Silent fail - doesn't break the app if tracking fails
 */
export const trackPageView = async (
  pagePath: string,
  pageTitle: string
): Promise<void> => {
  try {
    const visitorId = getVisitorId();
    const sessionId = getSessionId();

    await axios.post(`${API_URL}/analytics/track`, {
      visitor_id: visitorId,
      page_path: pagePath,
      page_title: pageTitle,
      referrer: document.referrer || '',
      session_id: sessionId,
      user_agent: navigator.userAgent,
    });
  } catch (error) {
    // Silent fail - log but don't break the app
    console.warn('Analytics tracking failed:', error);
  }
};

/**
 * Get admin headers with X-Admin-Key
 */
const getAdminHeaders = (): Record<string, string> => {
  const adminKey = sessionStorage.getItem(ADMIN_KEY_SESSION) || import.meta.env.VITE_ADMIN_KEY;
  return adminKey ? { 'X-Admin-Key': adminKey } : {};
};

/**
 * Set admin key in session storage
 */
export const setAdminKey = (key: string): void => {
  sessionStorage.setItem(ADMIN_KEY_SESSION, key);
};

/**
 * Clear admin key from session storage
 */
export const clearAdminKey = (): void => {
  sessionStorage.removeItem(ADMIN_KEY_SESSION);
};

/**
 * Check if admin key is set
 */
export const hasAdminKey = (): boolean => {
  return !!sessionStorage.getItem(ADMIN_KEY_SESSION);
};

/**
 * Get analytics statistics (admin only)
 */
export const getAnalyticsStats = async (days = 30): Promise<AnalyticsStats> => {
  const response = await axios.get(`${API_URL}/analytics/stats`, {
    params: { days },
    headers: getAdminHeaders(),
  });
  return response.data.stats;
};

/**
 * Get popular pages (admin only)
 */
export const getPopularPages = async (
  days = 30,
  limit = 10
): Promise<PopularPage[]> => {
  const response = await axios.get(`${API_URL}/analytics/popular-pages`, {
    params: { days, limit },
    headers: getAdminHeaders(),
  });
  return response.data.popular_pages;
};

/**
 * Get daily statistics (admin only)
 */
export const getDailyStats = async (days = 30): Promise<DailyStats[]> => {
  const response = await axios.get(`${API_URL}/analytics/daily-stats`, {
    params: { days },
    headers: getAdminHeaders(),
  });
  return response.data.daily_stats;
};

/**
 * Get recent activity (admin only)
 */
export const getRecentActivity = async (limit = 50): Promise<RecentActivity[]> => {
  const response = await axios.get(`${API_URL}/analytics/recent-activity`, {
    params: { limit },
    headers: getAdminHeaders(),
  });
  return response.data.recent_activity;
};
