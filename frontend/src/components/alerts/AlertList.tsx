import { useState } from 'react';
import { PriceAlert } from '../../types/alert';
import { format } from 'date-fns';
import { CryptoPrice } from '../../types/crypto';

interface AlertListProps {
  alerts: PriceAlert[];
  prices: Map<string, CryptoPrice>;
  onRemove: (alertId: string) => void;
  onToggleStatus: (alertId: string) => void;
}

type FilterType = 'all' | 'active' | 'triggered' | 'disabled';

function AlertList({ alerts, prices, onRemove, onToggleStatus }: AlertListProps) {
  const [filterType, setFilterType] = useState<FilterType>('all');

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch {
      return dateString;
    }
  };

  const getCurrentPrice = (cryptoId: string): number | null => {
    const crypto = prices.get(cryptoId);
    return crypto ? crypto.current_price_usd : null;
  };

  const getProgressPercentage = (alert: PriceAlert): number => {
    const currentPrice = getCurrentPrice(alert.cryptoId);
    if (!currentPrice) return 0;

    if (alert.condition === 'above') {
      return Math.min((currentPrice / alert.targetPrice) * 100, 100);
    } else {
      return Math.min((alert.targetPrice / currentPrice) * 100, 100);
    }
  };

  const handleRemove = (alert: PriceAlert) => {
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer cette alerte pour ${alert.name} ?`
      )
    ) {
      onRemove(alert.id);
    }
  };

  // Filter alerts
  const filteredAlerts = alerts.filter((a) => {
    if (filterType === 'all') return true;
    return a.status === filterType;
  });

  // Sort: active first, then triggered, then disabled. Within each group, sort by creation date (newest first)
  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    const statusOrder = { active: 1, triggered: 2, disabled: 3 };
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (alerts.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔔</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Aucune alerte</h2>
          <p className="text-gray-600">
            Créez des alertes pour être notifié quand les prix atteignent vos objectifs
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
      {/* Header with filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <span className="mr-2">🔔</span>
          Mes Alertes
        </h2>

        {/* Filter buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
              filterType === 'all'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Toutes ({alerts.length})
          </button>
          <button
            onClick={() => setFilterType('active')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
              filterType === 'active'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Actives ({alerts.filter((a) => a.status === 'active').length})
          </button>
          <button
            onClick={() => setFilterType('triggered')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
              filterType === 'triggered'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Déclenchées ({alerts.filter((a) => a.status === 'triggered').length})
          </button>
          <button
            onClick={() => setFilterType('disabled')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
              filterType === 'disabled'
                ? 'bg-gray-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Désactivées ({alerts.filter((a) => a.status === 'disabled').length})
          </button>
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedAlerts.map((alert) => {
          const currentPrice = getCurrentPrice(alert.cryptoId);
          const progress = getProgressPercentage(alert);

          return (
            <div
              key={alert.id}
              className={`border-2 rounded-lg p-4 ${
                alert.status === 'active'
                  ? 'border-blue-200 bg-blue-50'
                  : alert.status === 'triggered'
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-800">
                      {alert.name}
                    </h3>
                    <span className="text-sm text-gray-500">
                      ({alert.symbol.toUpperCase()})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        alert.status === 'active'
                          ? 'bg-blue-100 text-blue-700'
                          : alert.status === 'triggered'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {alert.status === 'active'
                        ? '🔵 Active'
                        : alert.status === 'triggered'
                        ? '✅ Déclenchée'
                        : '⚫ Désactivée'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Alert Details */}
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Condition:</span>
                  <span className={`font-semibold ${
                    alert.condition === 'above' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {alert.condition === 'above' ? '🚀 Au-dessus de' : '📉 En dessous de'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Prix cible:</span>
                  <span className="font-bold text-primary">
                    ${alert.targetPrice.toLocaleString()}
                  </span>
                </div>
                {currentPrice !== null && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Prix actuel:</span>
                    <span className="font-semibold text-gray-800">
                      ${currentPrice.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Créée le:</span>
                  <span className="text-gray-500 text-xs">
                    {formatDate(alert.createdAt)}
                  </span>
                </div>
                {alert.triggeredAt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Déclenchée le:</span>
                    <span className="text-green-600 text-xs font-semibold">
                      {formatDate(alert.triggeredAt)}
                    </span>
                  </div>
                )}
              </div>

              {/* Progress Bar (only for active alerts) */}
              {alert.status === 'active' && currentPrice !== null && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progression</span>
                    <span>{progress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        alert.condition === 'above' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                {alert.status !== 'triggered' && (
                  <button
                    onClick={() => onToggleStatus(alert.id)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      alert.status === 'active'
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-blue-200 text-blue-700 hover:bg-blue-300'
                    }`}
                  >
                    {alert.status === 'active' ? 'Désactiver' : 'Réactiver'}
                  </button>
                )}
                <button
                  onClick={() => handleRemove(alert)}
                  className="flex-1 px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-semibold"
                >
                  Supprimer
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Aucune alerte de type "{filterType}" trouvée
        </div>
      )}
    </div>
  );
}

export default AlertList;
