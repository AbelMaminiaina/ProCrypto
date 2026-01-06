import { Link } from 'react-router-dom';
import { CryptoPrice } from '../../types/crypto';

interface CryptoCardProps {
  crypto: CryptoPrice;
}

function CryptoCard({ crypto }: CryptoCardProps) {
  const isPricePositive = (crypto.price_change_24h ?? 0) >= 0;

  const formatPrice = (price: number, currency: string) => {
    if (currency === 'MGA') {
      return price.toLocaleString('fr-FR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: currency === 'USD' ? 2 : 6,
    });
  };

  const formatMarketCap = (marketCap: number | null) => {
    if (!marketCap) return 'N/A';
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return `$${marketCap.toFixed(0)}`;
  };

  return (
    <article
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100"
      aria-label={`Carte crypto ${crypto.name}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-bold"
            aria-hidden="true"
          >
            {crypto.symbol.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-800">{crypto.name}</h3>
            <p className="text-sm text-gray-500">{crypto.symbol.toUpperCase()}</p>
          </div>
        </div>

        {/* 24h Change Badge */}
        {crypto.price_change_24h !== null && (
          <div
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              isPricePositive
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {isPricePositive ? '▲' : '▼'} {Math.abs(crypto.price_change_24h).toFixed(2)}%
          </div>
        )}
      </div>

      {/* Prices */}
      <div className="space-y-3">
        {/* USD Price */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Prix USD:</span>
          <span className="font-bold text-lg text-primary">
            ${formatPrice(crypto.current_price_usd, 'USD')}
          </span>
        </div>

        {/* EUR Price */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Prix EUR:</span>
          <span className="font-semibold text-gray-800">
            €{formatPrice(crypto.price_eur, 'EUR')}
          </span>
        </div>

        {/* MGA Price */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Prix MGA:</span>
          <span className="font-semibold text-gray-800">
            {formatPrice(crypto.price_mga, 'MGA')} Ar
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-4"></div>

      {/* Market Cap */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">Market Cap:</span>
        <span className="font-semibold text-gray-700">
          {formatMarketCap(crypto.market_cap_usd)}
        </span>
      </div>

      {/* Last Updated */}
      <div className="mt-3 text-xs text-gray-400 text-center">
        Mis à jour: {new Date(crypto.last_updated).toLocaleTimeString('fr-FR')}
      </div>

      {/* Details Button */}
      <Link
        to={`/crypto/${crypto.id}`}
        className="mt-4 block w-full text-center bg-gradient-to-r from-primary to-primary-dark text-white font-semibold py-2 px-4 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
        aria-label={`Voir les détails de ${crypto.name}`}
      >
        <span aria-hidden="true">📊</span> Voir détails
      </Link>
    </article>
  );
}

export default CryptoCard;
