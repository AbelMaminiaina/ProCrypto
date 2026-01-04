import { PortfolioMetrics } from '../../types/portfolio';

interface PortfolioSummaryProps {
  metrics: PortfolioMetrics;
  holdingsCount: number;
}

function PortfolioSummary({ metrics, holdingsCount }: PortfolioSummaryProps) {
  const isProfitable = metrics.totalProfitLoss >= 0;

  const formatCurrency = (amount: number, currency: 'USD' | 'EUR' | 'MGA') => {
    if (currency === 'MGA') {
      return amount.toLocaleString('fr-FR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="mr-2">💼</span>
        Résumé du Portfolio
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Holdings */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Cryptos détenues</p>
          <p className="text-3xl font-bold text-primary">{holdingsCount}</p>
        </div>

        {/* Total Invested */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Total investi</p>
          <p className="text-2xl font-bold text-gray-700">
            ${formatCurrency(metrics.totalInvested, 'USD')}
          </p>
        </div>

        {/* Current Value */}
        <div className="text-center p-4 bg-gradient-to-br from-primary to-primary-dark text-white rounded-lg">
          <p className="text-sm opacity-90 mb-1">Valeur actuelle</p>
          <p className="text-2xl font-bold">
            ${formatCurrency(metrics.totalCurrentValueUSD, 'USD')}
          </p>
          <div className="text-xs opacity-80 mt-2 space-y-1">
            <div>€{formatCurrency(metrics.totalCurrentValueEUR, 'EUR')}</div>
            <div>{formatCurrency(metrics.totalCurrentValueMGA, 'MGA')} Ar</div>
          </div>
        </div>

        {/* Profit/Loss */}
        <div
          className={`text-center p-4 rounded-lg ${
            isProfitable
              ? 'bg-green-50 border-2 border-green-200'
              : 'bg-red-50 border-2 border-red-200'
          }`}
        >
          <p className="text-sm text-gray-600 mb-1">Profit / Perte</p>
          <p
            className={`text-2xl font-bold ${
              isProfitable ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isProfitable ? '+' : ''}${formatCurrency(Math.abs(metrics.totalProfitLoss), 'USD')}
          </p>
          <div
            className={`text-lg font-semibold mt-1 ${
              isProfitable ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isProfitable ? '▲' : '▼'} {Math.abs(metrics.profitLossPercentage).toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Performance Indicator */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Performance globale</span>
          <span
            className={`text-sm font-semibold ${
              isProfitable ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isProfitable ? 'En gain' : 'En perte'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              isProfitable ? 'bg-green-500' : 'bg-red-500'
            }`}
            style={{
              width: `${Math.min(Math.abs(metrics.profitLossPercentage), 100)}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Empty State */}
      {holdingsCount === 0 && (
        <div className="mt-6 text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 mb-2">📈 Votre portfolio est vide</p>
          <p className="text-sm text-gray-400">
            Ajoutez vos premières cryptomonnaies pour commencer à suivre vos investissements
          </p>
        </div>
      )}
    </div>
  );
}

export default PortfolioSummary;
