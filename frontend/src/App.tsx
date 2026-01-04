import { useState, useEffect } from 'react';
import {
  getCurrencies,
  convertCurrency,
  convertToAll,
  refreshRates,
  checkApiHealth,
} from './services/currencyService';
import { Currency } from './types/currency';

function App() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [fromCurrency, setFromCurrency] = useState<string>('EUR');
  const [toCurrency, setToCurrency] = useState<string>('USD');
  const [amount, setAmount] = useState<string>('100');
  const [result, setResult] = useState<number | null>(null);
  const [rate, setRate] = useState<number | null>(null);
  const [allConversions, setAllConversions] = useState<any>(null);
  const [showAllConversions, setShowAllConversions] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<string>('');

  useEffect(() => {
    loadCurrencies();
    checkHealth();
  }, []);

  const loadCurrencies = async () => {
    try {
      const data = await getCurrencies();
      setCurrencies(data);
    } catch (err) {
      setError('Impossible de charger les devises');
      console.error(err);
    }
  };

  const checkHealth = async () => {
    try {
      const health = await checkApiHealth();
      setApiStatus(health.status);
      setLastUpdate(health.lastUpdate);
    } catch (err) {
      setApiStatus('error');
      console.error(err);
    }
  };

  const handleConvert = async () => {
    setError('');
    setResult(null);
    setRate(null);
    setAllConversions(null);

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Veuillez entrer un montant valide');
      return;
    }

    setLoading(true);

    try {
      if (showAllConversions) {
        const data = await convertToAll(amountNum, fromCurrency);
        setAllConversions(data);
        setLastUpdate(data.lastUpdate);
      } else {
        const data = await convertCurrency(amountNum, fromCurrency, toCurrency);
        setResult(data.result);
        setRate(data.rate);
        setLastUpdate(data.date);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la conversion');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshRates = async () => {
    setLoading(true);
    setError('');

    try {
      await refreshRates();
      await checkHealth();
      alert('Taux actualisés avec succès!');
    } catch (err) {
      setError('Erreur lors du rafraîchissement des taux');
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center text-white mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            💱 Convertisseur de Devises
          </h1>
          <p className="text-xl opacity-90 mb-4">Multi-Currency Converter</p>
          <div className="text-sm mb-2">
            API Status:{' '}
            <span
              className={`font-bold ${
                apiStatus === 'healthy' ? 'text-green-300' : 'text-red-300'
              }`}
            >
              {apiStatus === 'healthy' ? '✓ Connected' : '✗ Disconnected'}
            </span>
          </div>
          {lastUpdate && (
            <div className="text-sm opacity-80">
              Dernière mise à jour: {new Date(lastUpdate).toLocaleString('fr-FR')}
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="space-y-6">
          {/* Converter Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
            {/* Amount Input */}
            <div className="mb-6">
              <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">
                Montant / Amount
              </label>
              <input
                id="amount"
                type="number"
                className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100"
                min="0"
                step="0.01"
              />
            </div>

            {/* Currency Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 mb-6 items-end">
              {/* From Currency */}
              <div>
                <label
                  htmlFor="from-currency"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  De / From
                </label>
                <select
                  id="from-currency"
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                >
                  {currencies.map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code} - {curr.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Swap Button */}
              <button
                className="w-12 h-12 bg-primary hover:bg-primary-dark text-white rounded-full text-2xl transition-all transform hover:rotate-180 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                onClick={swapCurrencies}
                title="Échanger"
              >
                ⇄
              </button>

              {/* To Currency */}
              <div>
                <label
                  htmlFor="to-currency"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Vers / To
                </label>
                <select
                  id="to-currency"
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  disabled={showAllConversions}
                >
                  {currencies.map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code} - {curr.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Show All Conversions Checkbox */}
            <div className="mb-6">
              <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
                  checked={showAllConversions}
                  onChange={(e) => setShowAllConversions(e.target.checked)}
                />
                <span>Afficher toutes les conversions / Show all conversions</span>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="flex-1 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                onClick={handleConvert}
                disabled={loading}
              >
                {loading ? '⏳ Conversion...' : '💱 Convertir'}
              </button>
              <button
                className="flex-1 sm:flex-initial bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleRefreshRates}
                disabled={loading}
              >
                {loading ? '⏳...' : '🔄 Actualiser'}
              </button>
            </div>
          </div>

          {/* Single Conversion Result */}
          {result !== null && !showAllConversions && (
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Résultat / Result</h2>
              <div className="text-3xl md:text-4xl font-bold text-primary text-center py-6 bg-gray-50 rounded-lg">
                {parseFloat(amount).toLocaleString('fr-FR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                {fromCurrency}
                <span className="text-gray-400 mx-3">=</span>
                {result.toLocaleString('fr-FR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                {toCurrency}
              </div>
              {rate && (
                <div className="text-center text-gray-600 mt-4">
                  Taux de change: 1 {fromCurrency} = {rate.toFixed(6)} {toCurrency}
                </div>
              )}
            </div>
          )}

          {/* All Conversions Table */}
          {allConversions && showAllConversions && (
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                📊 Conversions pour {allConversions.amount.toLocaleString('fr-FR')}{' '}
                {allConversions.from}
              </h2>
              <div className="space-y-3">
                {allConversions.conversions.map((conv: any) => (
                  <div
                    key={conv.currency}
                    className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-3 items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex flex-col">
                      <strong className="text-lg text-gray-800">{conv.currency}</strong>
                      <span className="text-sm text-gray-500">
                        {conv.name.split(' / ')[0]}
                      </span>
                    </div>
                    <div className="text-xl md:text-right font-semibold text-primary">
                      {conv.result.toLocaleString('fr-FR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                    <div className="text-sm md:text-right text-gray-500">
                      1 {allConversions.from} = {conv.rate.toFixed(6)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="text-center text-white mt-8 py-6 opacity-90">
          <p className="mb-2">Powered by Python Backend API 🐍 + React TypeScript ⚛️</p>
          <p>{currencies.length} devises supportées</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
