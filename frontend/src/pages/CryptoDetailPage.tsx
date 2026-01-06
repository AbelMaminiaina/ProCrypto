import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getCryptoDetails, getCryptoHistory } from '../services/cryptoService';

type Period = '1d' | '7d' | '30d' | '90d' | '1y';

function CryptoDetailPage() {
  const { cryptoId } = useParams<{ cryptoId: string }>();
  const navigate = useNavigate();
  const [details, setDetails] = useState<any>(null);
  const [history, setHistory] = useState<any>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('7d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!cryptoId) return;

      setLoading(true);
      setError('');

      try {
        // Load details first
        const detailsData = await getCryptoDetails(cryptoId);
        setDetails(detailsData);

        // Delay to avoid rate limiting (2 seconds for safety)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Then load history
        const historyData = await getCryptoHistory(cryptoId, selectedPeriod);
        setHistory(historyData);
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || err.message || 'Erreur lors du chargement des données';

        // Check if we got cached data despite error
        const hasDetails = details !== null;
        const hasHistory = history !== null;

        // If we have cached data (even partial), don't show error
        if (hasDetails || hasHistory) {
          console.log('Using cached data, ignoring error:', errorMsg);
          // Optionally show a subtle warning but don't block the UI
          return;
        }

        // Only show error if we have NO data at all
        // Check if it's a rate limit error
        if (errorMsg.includes('429') || errorMsg.includes('Rate limit') || errorMsg.includes('Too Many Requests')) {
          setError('⏱️ Limite d\'API atteinte. Veuillez patienter quelques secondes et réessayer.');
        } else {
          setError(errorMsg);
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cryptoId, selectedPeriod]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          <p className="text-white mt-4 text-xl">Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded max-w-lg w-full">
          <p className="font-semibold text-red-900 mb-2">Erreur</p>
          <p className="text-red-700 mb-4">{error || 'Crypto non trouvée'}</p>
          {error?.includes('Limite') && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
              <p className="text-sm text-yellow-800">
                💡 <strong>Astuce:</strong> L'API CoinGecko gratuite a une limite d'appels.
                Attendez 10-20 secondes puis réessayez.
              </p>
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors"
            >
              🔄 Réessayer
            </button>
            <button
              onClick={() => navigate('/crypto')}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              ← Retour
            </button>
          </div>
        </div>
      </div>
    );
  }

  const priceChange = details.market_data.price_change_24h;
  const isPositive = priceChange >= 0;

  // Format chart data
  const chartData = history?.prices?.map((item: any) => ({
    date: new Date(item.timestamp).toLocaleDateString('fr-FR', {
      month: 'short',
      day: 'numeric',
    }),
    price: item.price,
  })) || [];

  const periods: { value: Period; label: string }[] = [
    { value: '1d', label: '24h' },
    { value: '7d', label: '7 jours' },
    { value: '30d', label: '30 jours' },
    { value: '90d', label: '90 jours' },
    { value: '1y', label: '1 an' },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <button
          onClick={() => navigate('/crypto')}
          className="mb-6 text-white hover:text-gray-200 flex items-center gap-2 text-lg"
        >
          ← Retour aux cryptos
        </button>

        {/* Main Info Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              {details.image && (
                <img
                  src={details.image}
                  alt={details.name}
                  className="w-16 h-16 rounded-full"
                />
              )}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                  {details.name}
                </h1>
                <p className="text-xl text-gray-600">{details.symbol}</p>
                {details.market_data.market_cap_rank && (
                  <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                    Rang #{details.market_data.market_cap_rank}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <p className="text-4xl md:text-5xl font-bold text-gray-900">
                ${details.market_data.current_price_usd.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className={`text-lg font-semibold mt-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? '↗' : '↘'} {Math.abs(priceChange).toFixed(2)}% (24h)
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Market Cap</p>
            <p className="text-xl font-bold text-gray-900">
              ${(details.market_data.market_cap_usd / 1e9).toFixed(2)}B
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Volume 24h</p>
            <p className="text-xl font-bold text-gray-900">
              ${(details.market_data.total_volume_usd / 1e9).toFixed(2)}B
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Plus Haut 24h</p>
            <p className="text-xl font-bold text-green-600">
              ${details.market_data.high_24h_usd.toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Plus Bas 24h</p>
            <p className="text-xl font-bold text-red-600">
              ${details.market_data.low_24h_usd.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Price Chart */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Graphique de Prix</h2>

          {/* Period Selector */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {periods.map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedPeriod === period.value
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>

          {/* Chart */}
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  stroke="#666"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="#666"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                  }}
                  formatter={(value: any) => [
                    `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                    'Prix',
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-12">Aucune donnée disponible</p>
          )}
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* ATH/ATL Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Records Historiques</h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Plus Haut Historique (ATH)</p>
                <p className="text-2xl font-bold text-green-600">
                  ${details.market_data.ath_usd.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(details.market_data.ath_date).toLocaleDateString('fr-FR')}
                </p>
                <p className="text-sm text-red-600 mt-1">
                  {details.market_data.ath_change_percentage.toFixed(2)}% du ATH
                </p>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-1">Plus Bas Historique (ATL)</p>
                <p className="text-2xl font-bold text-red-600">
                  ${details.market_data.atl_usd.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(details.market_data.atl_date).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>

          {/* Supply Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Offre Monétaire</h3>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Circulation</p>
                <p className="text-xl font-bold text-gray-900">
                  {(details.market_data.circulating_supply / 1e6).toFixed(2)}M {details.symbol}
                </p>
              </div>

              {details.market_data.total_supply > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Offre Totale</p>
                  <p className="text-xl font-bold text-gray-700">
                    {(details.market_data.total_supply / 1e6).toFixed(2)}M {details.symbol}
                  </p>
                </div>
              )}

              {details.market_data.max_supply > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Offre Maximale</p>
                  <p className="text-xl font-bold text-blue-600">
                    {(details.market_data.max_supply / 1e6).toFixed(2)}M {details.symbol}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Performance Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Performance</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">24 heures</p>
              <p className={`text-2xl font-bold ${details.market_data.price_change_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {details.market_data.price_change_24h.toFixed(2)}%
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">7 jours</p>
              <p className={`text-2xl font-bold ${details.market_data.price_change_7d >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {details.market_data.price_change_7d.toFixed(2)}%
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">30 jours</p>
              <p className={`text-2xl font-bold ${details.market_data.price_change_30d >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {details.market_data.price_change_30d.toFixed(2)}%
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">1 an</p>
              <p className={`text-2xl font-bold ${details.market_data.price_change_1y >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {details.market_data.price_change_1y.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        {details.description && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">À propos de {details.name}</h3>
            <div
              className="text-gray-700 prose max-w-none"
              dangerouslySetInnerHTML={{ __html: details.description.substring(0, 1000) + '...' }}
            />
            {details.homepage && (
              <a
                href={details.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-primary hover:text-primary-dark font-semibold"
              >
                Site officiel →
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CryptoDetailPage;
