import { useState } from 'react';
import { useCryptoPrices } from '../hooks/useCryptoPrices';
import { usePortfolio } from '../hooks/usePortfolio';
import CryptoCard from '../components/crypto/CryptoCard';
import PortfolioSummary from '../components/crypto/PortfolioSummary';
import PortfolioList from '../components/crypto/PortfolioList';
import AddCryptoModal from '../components/crypto/AddCryptoModal';

function CryptoPortfolioPage() {
  const { prices, pricesList, loading, error, lastUpdate, refresh } = useCryptoPrices();
  const portfolio = usePortfolio(prices);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState<'portfolio' | 'market'>('portfolio');

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
          </main>
        )}

        {/* Market View */}
        {viewMode === 'market' && !loading && pricesList.length > 0 && (
          <main className="space-y-6">
            {/* Stats Summary */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Total Cryptos</p>
                  <p className="text-3xl font-bold text-primary">{pricesList.length}</p>
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
              {pricesList.map((crypto) => (
                <CryptoCard key={crypto.id} crypto={crypto} />
              ))}
            </div>
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
