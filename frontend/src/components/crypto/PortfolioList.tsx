import { HoldingWithCurrentValue } from '../../types/portfolio';

interface PortfolioListProps {
  holdings: HoldingWithCurrentValue[];
  onRemove: (holdingId: string) => void;
}

function PortfolioList({ holdings, onRemove }: PortfolioListProps) {
  const formatNumber = (num: number, decimals = 2) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const handleRemove = (holdingId: string, cryptoName: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir retirer ${cryptoName} de votre portfolio ?`)) {
      onRemove(holdingId);
    }
  };

  if (holdings.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="mr-2">📊</span>
        Mes Cryptomonnaies
      </h2>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Crypto</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Quantité</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">
                Prix d'achat
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">
                Prix actuel
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">
                Valeur totale
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">P/L</th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding) => {
              const isProfitable = holding.profitLoss >= 0;
              return (
                <tr
                  key={holding.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  {/* Crypto */}
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {holding.symbol.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{holding.name}</p>
                        <p className="text-sm text-gray-500">{holding.symbol.toUpperCase()}</p>
                      </div>
                    </div>
                  </td>

                  {/* Quantity */}
                  <td className="py-4 px-4 text-right font-semibold text-gray-700">
                    {formatNumber(holding.quantity, 4)}
                  </td>

                  {/* Purchase Price */}
                  <td className="py-4 px-4 text-right text-gray-600">
                    ${formatNumber(holding.averagePurchasePrice)}
                  </td>

                  {/* Current Price */}
                  <td className="py-4 px-4 text-right">
                    <div className="font-semibold text-gray-800">
                      ${formatNumber(holding.currentPriceUSD)}
                    </div>
                    {holding.priceChange24h !== null && (
                      <div
                        className={`text-xs ${
                          holding.priceChange24h >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {holding.priceChange24h >= 0 ? '▲' : '▼'}{' '}
                        {Math.abs(holding.priceChange24h).toFixed(2)}%
                      </div>
                    )}
                  </td>

                  {/* Total Value */}
                  <td className="py-4 px-4 text-right">
                    <div className="font-bold text-primary">
                      ${formatNumber(holding.currentValueUSD)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Investi: ${formatNumber(holding.totalInvested)}
                    </div>
                  </td>

                  {/* P/L */}
                  <td className="py-4 px-4 text-right">
                    <div
                      className={`font-bold ${
                        isProfitable ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {isProfitable ? '+' : ''}${formatNumber(Math.abs(holding.profitLoss))}
                    </div>
                    <div
                      className={`text-sm font-semibold ${
                        isProfitable ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {isProfitable ? '▲' : '▼'} {Math.abs(holding.profitLossPercentage).toFixed(2)}
                      %
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => handleRemove(holding.id, holding.name)}
                      className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-semibold"
                    >
                      Retirer
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {holdings.map((holding) => {
          const isProfitable = holding.profitLoss >= 0;
          return (
            <div
              key={holding.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {holding.symbol.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{holding.name}</p>
                    <p className="text-sm text-gray-500">{holding.symbol.toUpperCase()}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(holding.id, holding.name)}
                  className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-xs font-semibold"
                >
                  Retirer
                </button>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantité:</span>
                  <span className="font-semibold">{formatNumber(holding.quantity, 4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Prix d'achat:</span>
                  <span>${formatNumber(holding.averagePurchasePrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Prix actuel:</span>
                  <span className="font-semibold">${formatNumber(holding.currentPriceUSD)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">Valeur totale:</span>
                  <span className="font-bold text-primary">
                    ${formatNumber(holding.currentValueUSD)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">P/L:</span>
                  <span
                    className={`font-bold ${
                      isProfitable ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {isProfitable ? '+' : ''}${formatNumber(Math.abs(holding.profitLoss))} (
                    {isProfitable ? '▲' : '▼'} {Math.abs(holding.profitLossPercentage).toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PortfolioList;
