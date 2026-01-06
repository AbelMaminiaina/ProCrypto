import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCryptoPrices } from '../hooks/useCryptoPrices';
import { usePortfolio } from '../hooks/usePortfolio';
import { useAuth } from '../contexts/AuthContext';
import CryptoCard from '../components/crypto/CryptoCard';
import PortfolioSummary from '../components/crypto/PortfolioSummary';
import PortfolioList from '../components/crypto/PortfolioList';
import AddCryptoModal from '../components/crypto/AddCryptoModal';

function CryptoPortfolioPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { prices, pricesList, loading, error, lastUpdate, refresh } = useCryptoPrices();
  const portfolio = usePortfolio(prices);
  const [showModal, setShowModal] = useState(false);
  // Start with market view for non-authenticated users
  const [viewMode, setViewMode] = useState<'portfolio' | 'market'>(
    isAuthenticated ? 'portfolio' : 'market'
  );

  // Filter cryptos based on authentication (freemium model)
  // Public users: see only 10 basic cryptos (positions 40-50)
  // Authenticated users: see all 50 cryptos
  const displayedCryptos = useMemo(() => {
    if (isAuthenticated) {
      return pricesList; // All 50 cryptos
    } else {
      // Show only 10 less popular cryptos for public users (positions 40-50)
      return pricesList.slice(40, 50);
    }
  }, [pricesList, isAuthenticated]);

  const handleAddCrypto = (
    cryptoId: string,
    symbol: string,
    name: string,
    quantity: number,
    purchasePrice: number
  ) => {
    portfolio.addHolding(cryptoId, symbol, name, quantity, purchasePrice);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center text-white mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            ₿ Crypto Portfolio Tracker
          </h1>
          <p className="text-xl opacity-90 mb-4">
            Suivez vos investissements en cryptomonnaies en temps réel
          </p>

          {/* Auto-refresh indicator */}
          {lastUpdate && (
            <div className="flex items-center justify-center gap-2 text-sm opacity-80">
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span>
                Dernière mise à jour: {lastUpdate.toLocaleTimeString('fr-FR')}
              </span>
              <span className="text-xs opacity-60">(auto-refresh 60s)</span>
            </div>
          )}
        </header>

        {/* View Mode Toggle */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex bg-white rounded-lg shadow-md p-1">
            <button
              onClick={() => setViewMode('portfolio')}
              className={`px-6 py-2 rounded-md font-semibold transition-all ${
                viewMode === 'portfolio'
                  ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              💼 Mon Portfolio
            </button>
            <button
              onClick={() => setViewMode('market')}
              className={`px-6 py-2 rounded-md font-semibold transition-all ${
                viewMode === 'market'
                  ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              📈 Prix du marché
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-6 flex justify-center gap-3 flex-wrap">
          {viewMode === 'portfolio' && (
            <button
              onClick={() => setShowModal(true)}
              disabled={loading || pricesList.length === 0}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              ➕ Ajouter une Crypto
            </button>
          )}
          <button
            onClick={refresh}
            disabled={loading}
            className="bg-white text-primary font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? '⏳ Chargement...' : '🔄 Actualiser les prix'}
          </button>
          {viewMode === 'portfolio' && portfolio.holdings.length > 0 && (
            <>
              <button
                onClick={portfolio.exportToJSON}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
              >
                📥 Exporter JSON
              </button>
              <button
                onClick={portfolio.clearAllHoldings}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
              >
                🗑️ Tout supprimer
              </button>
            </>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mb-6 flex justify-center gap-3 flex-wrap">
          <button
            onClick={() => navigate('/crypto/transactions')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
          >
            📜 Historique des Transactions
          </button>
          <button
            onClick={() => navigate('/crypto/alerts')}
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
          >
            🔔 Alertes de Prix
          </button>
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
            <p className="text-white mt-4">Chargement des prix crypto...</p>
          </div>
        )}

        {/* Portfolio View */}
        {viewMode === 'portfolio' && !loading && pricesList.length > 0 && (
          <main className="space-y-6">
            {/* Login Required Message for Portfolio */}
            {!isAuthenticated ? (
              <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-3xl mx-auto text-center">
                <div className="text-6xl mb-4">🔒</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Portfolio Réservé aux Membres
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Le portfolio, les transactions et les alertes de prix nécessitent un compte gratuit.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 text-left">
                  <p className="font-semibold text-blue-900 mb-2">Avec un compte, vous pouvez:</p>
                  <ul className="list-disc list-inside text-blue-800 space-y-1">
                    <li>Suivre votre portfolio crypto en temps réel</li>
                    <li>Gérer vos transactions d'achat/vente</li>
                    <li>Créer des alertes de prix personnalisées</li>
                    <li>Accéder aux 50 cryptos principales</li>
                    <li>Exporter vos données en JSON</li>
                  </ul>
                </div>
                <div className="flex gap-4 justify-center flex-wrap">
                  <button
                    onClick={() => navigate('/register')}
                    className="bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                  >
                    📝 Créer un compte gratuit
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-white text-primary border-2 border-primary font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                  >
                    🔐 Se connecter
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-6">
                  Vous pouvez consulter les prix du marché sans compte
                </p>
                <button
                  onClick={() => setViewMode('market')}
                  className="mt-3 text-primary hover:text-primary-dark font-semibold underline"
                >
                  → Voir les prix du marché
                </button>
              </div>
            ) : (
              <>
                {/* Portfolio Summary */}
                <PortfolioSummary
                  metrics={portfolio.metrics}
                  holdingsCount={portfolio.holdings.length}
                />

                {/* Portfolio List */}
                {portfolio.holdingsWithValues.length > 0 && (
                  <PortfolioList
                    holdings={portfolio.holdingsWithValues}
                    onRemove={portfolio.removeHolding}
                  />
                )}
              </>
            )}
          </main>
        )}

        {/* Market View */}
        {viewMode === 'market' && !loading && pricesList.length > 0 && (
          <main className="space-y-6">
            {/* Login Prompt for Public Users */}
            {!isAuthenticated && (
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-6 md:p-8 text-white">
                <div className="text-center">
                  <div className="text-4xl mb-3">🔓</div>
                  <h3 className="text-2xl font-bold mb-2">
                    Accès Limité - Mode Gratuit
                  </h3>
                  <p className="text-lg mb-4 opacity-90">
                    Vous voyez seulement {displayedCryptos.length} cryptos basiques
                  </p>
                  <p className="mb-6 opacity-90">
                    Connectez-vous pour accéder aux <strong>50 cryptos</strong> principales + portfolio complet + alertes de prix
                  </p>
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-white text-purple-600 font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                  >
                    🔐 Se connecter / S'inscrire
                  </button>
                </div>
              </div>
            )}

            {/* Stats Summary */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Cryptos Affichées</p>
                  <p className="text-3xl font-bold text-primary">
                    {displayedCryptos.length}
                    {!isAuthenticated && <span className="text-lg text-gray-500"> / 50</span>}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Auto-Refresh</p>
                  <p className="text-3xl font-bold text-green-600">ON</p>
                  <p className="text-xs text-gray-500 mt-1">Toutes les 60 secondes</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Devises</p>
                  <p className="text-xl font-semibold text-gray-700">USD • EUR • MGA</p>
                </div>
              </div>
            </div>

            {/* Crypto Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedCryptos.map((crypto) => (
                <CryptoCard key={crypto.id} crypto={crypto} />
              ))}
            </div>

            {/* Bottom CTA for Public Users */}
            {!isAuthenticated && (
              <div className="bg-white rounded-2xl shadow-xl p-6 text-center border-2 border-purple-200">
                <p className="text-gray-700 mb-4">
                  💎 Vous manquez <strong>{pricesList.length - displayedCryptos.length} cryptos populaires</strong> (Bitcoin, Ethereum, etc.)
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                >
                  🚀 Débloquer toutes les cryptos
                </button>
              </div>
            )}
          </main>
        )}

        {/* No Data State */}
        {!loading && pricesList.length === 0 && !error && (
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-4xl mx-auto">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Aucune donnée disponible
              </h2>
              <p className="text-gray-600">
                Impossible de charger les prix des cryptomonnaies. Veuillez réessayer.
              </p>
            </div>
          </div>
        )}

        {/* Footer Info */}
        {pricesList.length > 0 && (
          <footer className="text-center text-white mt-8 py-6 opacity-90">
            <p className="mb-2">
              Données fournies par CoinGecko API 🦎
            </p>
            <p className="text-sm">
              Les prix sont mis à jour automatiquement toutes les 60 secondes
            </p>
          </footer>
        )}
      </div>

      {/* Add Crypto Modal */}
      <AddCryptoModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAddCrypto}
        availableCryptos={pricesList}
        isInPortfolio={portfolio.isInPortfolio}
      />
    </div>
  );
}

export default CryptoPortfolioPage;
