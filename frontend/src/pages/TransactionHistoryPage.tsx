import { useState } from 'react';
import { useCryptoPrices } from '../hooks/useCryptoPrices';
import { usePortfolio } from '../hooks/usePortfolio';
import { useTransactions } from '../hooks/useTransactions';
import TransactionTable from '../components/transactions/TransactionTable';
import AddTransactionModal from '../components/transactions/AddTransactionModal';
import PerformanceMetrics from '../components/transactions/PerformanceMetrics';
import { TransactionType } from '../types/transaction';
import { useNavigate } from 'react-router-dom';

function TransactionHistoryPage() {
  const navigate = useNavigate();
  const { prices, pricesList, loading, error } = useCryptoPrices();
  const portfolio = usePortfolio(prices);
  const transactionsHook = useTransactions(portfolio.holdingsWithValues, prices);
  const [showModal, setShowModal] = useState(false);

  const handleAddTransaction = (
    cryptoId: string,
    symbol: string,
    name: string,
    type: TransactionType,
    quantity: number,
    pricePerUnit: number,
    date: string,
    notes?: string
  ) => {
    transactionsHook.addTransaction(cryptoId, symbol, name, type, quantity, pricePerUnit, date, notes);
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
              📜 Historique des Transactions
            </h1>
          </div>
          <p className="text-xl opacity-90">
            Suivez toutes vos opérations d'achat et de vente
          </p>
        </header>

        {/* Action Buttons */}
        <div className="mb-6 flex justify-center gap-3 flex-wrap">
          <button
            onClick={() => setShowModal(true)}
            disabled={loading || pricesList.length === 0}
            className="bg-gradient-to-r from-primary to-primary-dark text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            ➕ Nouvelle Transaction
          </button>

          {transactionsHook.transactions.length > 0 && (
            <>
              <button
                onClick={transactionsHook.exportToJSON}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
              >
                📥 Exporter JSON
              </button>
              <button
                onClick={transactionsHook.clearAllTransactions}
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

        {/* Content */}
        {!loading && pricesList.length > 0 && (
          <main className="space-y-6">
            {/* Performance Metrics */}
            <PerformanceMetrics
              stats={transactionsHook.performanceStats}
              summary={transactionsHook.summary}
            />

            {/* Transaction Table */}
            <TransactionTable
              transactions={transactionsHook.transactions}
              onRemove={transactionsHook.removeTransaction}
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
              💡 Astuce: Enregistrez toutes vos transactions pour suivre précisément vos performances
            </p>
            <p className="text-sm">
              Les métriques sont calculées automatiquement à partir de vos transactions et holdings
            </p>
          </footer>
        )}
      </div>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAddTransaction}
        availableCryptos={pricesList}
      />
    </div>
  );
}

export default TransactionHistoryPage;
