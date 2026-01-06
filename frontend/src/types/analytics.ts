export interface AnalyticsStats {
  total_visitors: number;
  total_page_views: number;
  avg_views_per_visitor: number;
  authenticated_visitors: number;
  anonymous_visitors: number;
  period_days: number;
}

export interface PopularPage {
  page_path: string;
  page_title: string | null;
  view_count: number;
}

export interface DailyStats {
  date: string;
  visitors: number;
  page_views: number;
}

export interface RecentActivity {
  page_path: string;
  page_title: string | null;
  viewed_at: string;
  session_id: string | null;
  user_id: number | null;
  user_agent: string | null;
}
