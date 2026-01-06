import { PerformanceStats, TransactionSummary } from '../../types/transaction';

interface PerformanceMetricsProps {
  stats: PerformanceStats;
  summary: TransactionSummary;
}

function PerformanceMetrics({ stats, summary }: PerformanceMetricsProps) {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const isProfit = stats.totalProfitLoss >= 0;

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="mr-2">📊</span>
        Métriques de Performance
      </h2>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total Invested */}
        <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <p className="text-sm text-gray-600 mb-1">Total Investi</p>
          <p className="text-2xl font-bold text-blue-700">${formatCurrency(stats.totalInvested)}</p>
          <p className="text-xs text-gray-500 mt-1">{summary.totalBuyQuantity.toFixed(4)} unités achetées</p>
        </div>

        {/* Total Realized */}
        <div className="text-center p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
          <p className="text-sm text-gray-600 mb-1">Total Réalisé</p>
          <p className="text-2xl font-bold text-purple-700">${formatCurrency(stats.totalRealized)}</p>
          <p className="text-xs text-gray-500 mt-1">{summary.totalSellQuantity.toFixed(4)} unités vendues</p>
        </div>

        {/* Current Value */}
        <div className="text-center p-4 bg-gradient-to-br from-primary to-primary-dark text-white rounded-lg">
          <p className="text-sm opacity-90 mb-1">Valeur Actuelle</p>
          <p className="text-2xl font-bold">${formatCurrency(stats.currentValue)}</p>
          <p className="text-xs opacity-80 mt-1">Portfolio actif</p>
        </div>

        {/* Total P/L */}
        <div
          className={`text-center p-4 rounded-lg border-2 ${
            isProfit
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <p className="text-sm text-gray-600 mb-1">P/L Total</p>
          <p
            className={`text-2xl font-bold ${
              isProfit ? 'text-green-700' : 'text-red-700'
            }`}
          >
            {isProfit ? '+' : ''}${formatCurrency(stats.totalProfitLoss)}
          </p>
          <p className={`text-sm font-semibold mt-1 ${
            isProfit ? 'text-green-600' : 'text-red-600'
          }`}>
            {isProfit ? '▲' : '▼'} {Math.abs(stats.roi).toFixed(2)}% ROI
          </p>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Realized P/L */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">P/L Réalisé (Ventes)</span>
            <span
              className={`font-bold ${
                stats.realizedProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {stats.realizedProfitLoss >= 0 ? '+' : ''}${formatCurrency(Math.abs(stats.realizedProfitLoss))}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                stats.realizedProfitLoss >= 0 ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(Math.abs(stats.realizedProfitLoss / stats.totalInvested * 100), 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Unrealized P/L */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">P/L Non-réalisé (Holdings)</span>
            <span
              className={`font-bold ${
                stats.unrealizedProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {stats.unrealizedProfitLoss >= 0 ? '+' : ''}${formatCurrency(Math.abs(stats.unrealizedProfitLoss))}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                stats.unrealizedProfitLoss >= 0 ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(Math.abs(stats.unrealizedProfitLoss / stats.totalInvested * 100), 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Best & Worst Trades */}
      {(stats.bestTrade || stats.worstTrade) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Best Trade */}
          {stats.bestTrade && (
            <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">🏆</span>
                <span className="text-sm font-semibold text-green-800">Meilleure Vente</span>
              </div>
              <p className="text-lg font-bold text-green-700 mb-1">
                {stats.bestTrade.name} ({stats.bestTrade.symbol.toUpperCase()})
              </p>
              <p className="text-sm text-gray-600">
                {stats.bestTrade.quantity.toFixed(4)} @ ${formatCurrency(stats.bestTrade.pricePerUnit)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Total: ${formatCurrency(stats.bestTrade.totalAmount)}
              </p>
            </div>
          )}

          {/* Worst Trade */}
          {stats.worstTrade && (
            <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">📉</span>
                <span className="text-sm font-semibold text-orange-800">Vente la Plus Basse</span>
              </div>
              <p className="text-lg font-bold text-orange-700 mb-1">
                {stats.worstTrade.name} ({stats.worstTrade.symbol.toUpperCase()})
              </p>
              <p className="text-sm text-gray-600">
                {stats.worstTrade.quantity.toFixed(4)} @ ${formatCurrency(stats.worstTrade.pricePerUnit)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Total: ${formatCurrency(stats.worstTrade.totalAmount)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Transaction Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Résumé des Transactions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-500 mb-1">Transactions</p>
            <p className="text-xl font-bold text-gray-800">{summary.transactionCount}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Achats</p>
            <p className="text-xl font-bold text-green-600">${formatCurrency(summary.totalBuyAmount)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Ventes</p>
            <p className="text-xl font-bold text-red-600">${formatCurrency(summary.totalSellAmount)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Net Investi</p>
            <p className="text-xl font-bold text-primary">${formatCurrency(summary.netInvested)}</p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {summary.transactionCount === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 mb-2">📈 Aucune transaction enregistrée</p>
          <p className="text-sm text-gray-400">
            Commencez à enregistrer vos achats et ventes pour voir vos performances
          </p>
        </div>
      )}
    </div>
  );
}

export default PerformanceMetrics;
