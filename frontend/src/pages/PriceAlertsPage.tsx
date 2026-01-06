import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCryptoPrices } from '../hooks/useCryptoPrices';
import { usePriceAlerts } from '../hooks/usePriceAlerts';
import CreateAlertModal from '../components/alerts/CreateAlertModal';
import AlertList from '../components/alerts/AlertList';
import {
  requestNotificationPermission,
  getNotificationPermission,
  sendTestNotification,
} from '../services/notificationService';

function PriceAlertsPage() {
  const navigate = useNavigate();
  const { prices, pricesList, loading, error } = useCryptoPrices();
  const alertsHook = usePriceAlerts(prices);
  const [showModal, setShowModal] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<string>('default');

  // Check notification permission on mount
  useEffect(() => {
    setNotificationPermission(getNotificationPermission());
  }, []);

  const handleRequestNotifications = async () => {
    const permission = await requestNotificationPermission();
    setNotificationPermission(permission);

    if (permission === 'granted') {
      sendTestNotification();
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center text-white mb-8">
          <div className="flex items-center justify-center mb-2">
            <button
              onClick={() => navigate('/crypto')}
              className="absolute left-4 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all"
            >
              ← Retour
            </button>
            <h1 className="text-4xl md:text-5xl font-bold">
              🔔 Alertes de Prix
            </h1>
          </div>
          <p className="text-xl opacity-90">
            Soyez notifié quand vos cryptos atteignent vos prix cibles
          </p>
        </header>

        {/* Notification Permission Banner */}
        {notificationPermission !== 'granted' && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-yellow-800">
                  🔔 Notifications désactivées
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Activez les notifications pour recevoir des alertes en temps réel
                </p>
              </div>
              {notificationPermission !== 'denied' && (
                <button
                  onClick={handleRequestNotifications}
                  className="ml-4 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Activer
                </button>
              )}
              {notificationPermission === 'denied' && (
                <p className="ml-4 text-sm text-yellow-700">
                  Autorisez les notifications dans les paramètres du navigateur
                </p>
              )}
            </div>
          </div>
        )}

        {/* Notification Status */}
        {notificationPermission === 'granted' && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-3">✅</span>
                <div>
                  <p className="font-semibold text-green-800">
                    Notifications activées
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    Vous recevrez des alertes quand vos prix cibles seront atteints
                  </p>
                </div>
              </div>
              <button
                onClick={sendTestNotification}
                className="ml-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors text-sm"
              >
                Tester
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mb-6 flex justify-center gap-3 flex-wrap">
          <button
            onClick={() => setShowModal(true)}
            disabled={loading || pricesList.length === 0}
            className="bg-gradient-to-r from-primary to-primary-dark text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            ➕ Nouvelle Alerte
          </button>

          {alertsHook.alerts.length > 0 && (
            <>
              <button
                onClick={alertsHook.exportToJSON}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
              >
                📥 Exporter JSON
              </button>
              <button
                onClick={alertsHook.clearAllAlerts}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
              >
                🗑️ Tout supprimer
              </button>
            </>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded max-w-4xl mx-auto">
            <p className="font-semibold">Erreur</p>
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && pricesList.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <p className="text-white mt-4">Chargement des données...</p>
          </div>
        )}

        {/* Alert Statistics */}
        {!loading && pricesList.length > 0 && alertsHook.alerts.length > 0 && (
          <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-4 text-center shadow-md">
              <p className="text-sm text-gray-600 mb-1">Total</p>
              <p className="text-2xl font-bold text-gray-800">
                {alertsHook.summary.totalAlerts}
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center shadow-md">
              <p className="text-sm text-blue-600 mb-1">Actives</p>
              <p className="text-2xl font-bold text-blue-700">
                {alertsHook.summary.activeAlerts}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center shadow-md">
              <p className="text-sm text-green-600 mb-1">Déclenchées</p>
              <p className="text-2xl font-bold text-green-700">
                {alertsHook.summary.triggeredAlerts}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center shadow-md">
              <p className="text-sm text-gray-600 mb-1">Désactivées</p>
              <p className="text-2xl font-bold text-gray-700">
                {alertsHook.summary.disabledAlerts}
              </p>
            </div>
          </div>
        )}

        {/* Content */}
        {!loading && pricesList.length > 0 && (
          <main className="space-y-6">
            <AlertList
              alerts={alertsHook.alerts}
              prices={prices}
              onRemove={alertsHook.removeAlert}
              onToggleStatus={alertsHook.toggleAlertStatus}
            />
          </main>
        )}

        {/* No Data State */}
        {!loading && pricesList.length === 0 && !error && (
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-4xl mx-auto">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Impossible de charger les données
              </h2>
              <p className="text-gray-600">
                Veuillez vérifier votre connexion et réessayer.
              </p>
            </div>
          </div>
        )}

        {/* Footer Info */}
        {pricesList.length > 0 && (
          <footer className="text-center text-white mt-8 py-6 opacity-90">
            <p className="mb-2">
              💡 Astuce: Les alertes sont vérifiées automatiquement toutes les 60 secondes
            </p>
            <p className="text-sm">
              Les notifications fonctionnent même si vous naviguez sur d'autres onglets
            </p>
          </footer>
        )}
      </div>

      {/* Create Alert Modal */}
      <CreateAlertModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAdd={alertsHook.addAlert}
        availableCryptos={pricesList}
      />
    </div>
  );
}

export default PriceAlertsPage;
