import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  getAnalyticsStats,
  getPopularPages,
  getDailyStats,
  getRecentActivity,
  setAdminKey,
  clearAdminKey,
  hasAdminKey,
} from '../services/analyticsService';
import type {
  AnalyticsStats,
  PopularPage,
  DailyStats,
  RecentActivity,
} from '../types/analytics';

const AnalyticsDashboardPage = () => {
  // Auth state
  const [adminKeyInput, setAdminKeyInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(hasAdminKey());
  const [authError, setAuthError] = useState('');

  // Data state
  const [period, setPeriod] = useState(30);
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [popularPages, setPopularPages] = useState<PopularPage[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  // Loading state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle admin authentication
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!adminKeyInput.trim()) {
      setAuthError('Veuillez entrer la clé admin');
      return;
    }

    // Store admin key and try to fetch data
    setAdminKey(adminKeyInput);
    setIsAuthenticated(true);

    // Try to fetch data to validate the key
    try {
      await getAnalyticsStats(7);
      setAdminKeyInput(''); // Clear input on success
    } catch (err: any) {
      setAuthError('Clé admin invalide');
      clearAdminKey();
      setIsAuthenticated(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    clearAdminKey();
    setIsAuthenticated(false);
    setStats(null);
    setPopularPages([]);
    setDailyStats([]);
    setRecentActivity([]);
  };

  // Fetch all analytics data
  const fetchData = async () => {
    setLoading(true);
    setError('');

    try {
      const [statsData, pagesData, dailyData, activityData] = await Promise.all([
        getAnalyticsStats(period),
        getPopularPages(period, 10),
        getDailyStats(period),
        getRecentActivity(50),
      ]);

      setStats(statsData);
      setPopularPages(pagesData);
      setDailyStats(dailyData);
      setRecentActivity(activityData);
    } catch (err: any) {
      setError('Erreur lors du chargement des données');
      console.error('Error fetching analytics:', err);

      // If unauthorized, clear auth
      if (err.response?.status === 401) {
        handleLogout();
        setAuthError('Session expirée, veuillez vous reconnecter');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when authenticated or period changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, period]);

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  };

  // Format datetime for recent activity
  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            Analytics Admin
          </h1>
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label htmlFor="adminKey" className="block text-white mb-2">
                Clé Administrateur
              </label>
              <input
                type="password"
                id="adminKey"
                value={adminKeyInput}
                onChange={(e) => setAdminKeyInput(e.target.value)}
                className="w-full px-4 py-2 bg-white/20 text-white placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Entrez la clé admin..."
              />
            </div>
            {authError && (
              <p className="text-red-400 text-sm">{authError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Main dashboard view
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Analytics Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
          >
            Déconnexion
          </button>
        </div>

        {/* Period Selector */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <span className="text-white font-semibold mr-4">Période:</span>
            {[7, 30, 90].map((days) => (
              <button
                key={days}
                onClick={() => setPeriod(days)}
                className={`px-4 py-2 rounded-lg transition ${
                  period === days
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {days} jours
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center text-white text-xl">Chargement...</div>
        ) : (
          <>
            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
                  <h3 className="text-gray-300 text-sm uppercase mb-2">
                    Visiteurs Uniques
                  </h3>
                  <p className="text-4xl font-bold text-white">
                    {stats.total_visitors}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    {stats.authenticated_visitors} connectés /{' '}
                    {stats.anonymous_visitors} anonymes
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
                  <h3 className="text-gray-300 text-sm uppercase mb-2">
                    Pages Vues
                  </h3>
                  <p className="text-4xl font-bold text-white">
                    {stats.total_page_views}
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
                  <h3 className="text-gray-300 text-sm uppercase mb-2">
                    Vues / Visiteur
                  </h3>
                  <p className="text-4xl font-bold text-white">
                    {stats.avg_views_per_visitor}
                  </p>
                </div>
              </div>
            )}

            {/* Daily Stats Chart */}
            {dailyStats.length > 0 && (
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Visiteurs par Jour
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis
                      dataKey="date"
                      stroke="#ffffff80"
                      tickFormatter={formatDate}
                    />
                    <YAxis stroke="#ffffff80" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="visitors"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Visiteurs"
                    />
                    <Line
                      type="monotone"
                      dataKey="page_views"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      name="Pages vues"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Popular Pages Chart */}
            {popularPages.length > 0 && (
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Pages Populaires
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={popularPages}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="page_path" stroke="#ffffff80" />
                    <YAxis stroke="#ffffff80" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                      }}
                    />
                    <Bar dataKey="view_count" fill="#3b82f6" name="Vues" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Recent Activity Table */}
            {recentActivity.length > 0 && (
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Activité Récente
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-white">
                    <thead className="border-b border-white/20">
                      <tr>
                        <th className="pb-2">Date</th>
                        <th className="pb-2">Page</th>
                        <th className="pb-2">Titre</th>
                        <th className="pb-2">Utilisateur</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivity.slice(0, 20).map((activity, index) => (
                        <tr
                          key={index}
                          className="border-b border-white/10 hover:bg-white/5"
                        >
                          <td className="py-2 text-sm">
                            {formatDateTime(activity.viewed_at)}
                          </td>
                          <td className="py-2 text-sm font-mono">
                            {activity.page_path}
                          </td>
                          <td className="py-2 text-sm">
                            {activity.page_title || '-'}
                          </td>
                          <td className="py-2 text-sm">
                            {activity.user_id ? (
                              <span className="bg-green-600 px-2 py-1 rounded text-xs">
                                User #{activity.user_id}
                              </span>
                            ) : (
                              <span className="bg-gray-600 px-2 py-1 rounded text-xs">
                                Anonyme
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboardPage;
