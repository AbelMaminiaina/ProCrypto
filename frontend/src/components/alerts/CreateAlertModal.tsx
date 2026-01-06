import { useState, useEffect } from 'react';
import { CreateAlertInput, AlertCondition } from '../../types/alert';
import { CryptoPrice } from '../../types/crypto';

interface CreateAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (input: CreateAlertInput) => void;
  availableCryptos: CryptoPrice[];
}

function CreateAlertModal({
  isOpen,
  onClose,
  onAdd,
  availableCryptos,
}: CreateAlertModalProps) {
  const [selectedCryptoId, setSelectedCryptoId] = useState<string>('');
  const [targetPrice, setTargetPrice] = useState<string>('');
  const [condition, setCondition] = useState<AlertCondition>('above');
  const [error, setError] = useState<string>('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedCryptoId('');
      setTargetPrice('');
      setCondition('above');
      setError('');
    }
  }, [isOpen]);

  // Auto-fill target price when crypto is selected
  useEffect(() => {
    if (selectedCryptoId) {
      const crypto = availableCryptos.find((c) => c.id === selectedCryptoId);
      if (crypto) {
        setTargetPrice(crypto.current_price_usd.toString());
      }
    }
  }, [selectedCryptoId, availableCryptos]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!selectedCryptoId) {
      setError('Veuillez sélectionner une cryptomonnaie');
      return;
    }

    const priceNum = parseFloat(targetPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Veuillez entrer un prix valide (> 0)');
      return;
    }

    // Get crypto details
    const crypto = availableCryptos.find((c) => c.id === selectedCryptoId);
    if (!crypto) {
      setError('Cryptomonnaie introuvable');
      return;
    }

    // Create alert input
    const input: CreateAlertInput = {
      cryptoId: crypto.id,
      symbol: crypto.symbol,
      name: crypto.name,
      targetPrice: priceNum,
      condition,
    };

    onAdd(input);
    onClose();
  };

  if (!isOpen) return null;

  const selectedCrypto = availableCryptos.find((c) => c.id === selectedCryptoId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              🔔 Nouvelle Alerte de Prix
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Crypto Selection */}
          <div>
            <label htmlFor="crypto-select" className="block text-sm font-semibold text-gray-700 mb-2">
              Cryptomonnaie
            </label>
            <select
              id="crypto-select"
              value={selectedCryptoId}
              onChange={(e) => setSelectedCryptoId(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
              required
            >
              <option value="">-- Sélectionner --</option>
              {availableCryptos.map((crypto) => (
                <option key={crypto.id} value={crypto.id}>
                  {crypto.name} ({crypto.symbol.toUpperCase()}) - ${crypto.current_price_usd.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Type d'alerte
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCondition('above')}
                className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                  condition === 'above'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🚀 Au-dessus
              </button>
              <button
                type="button"
                onClick={() => setCondition('below')}
                className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                  condition === 'below'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📉 En dessous
              </button>
            </div>
          </div>

          {/* Target Price */}
          <div>
            <label htmlFor="target-price" className="block text-sm font-semibold text-gray-700 mb-2">
              Prix cible (USD)
            </label>
            <input
              id="target-price"
              type="number"
              step="0.01"
              min="0"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="Ex: 50000"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Auto-rempli avec le prix actuel du marché
            </p>
          </div>

          {/* Preview */}
          {selectedCrypto && targetPrice && !isNaN(parseFloat(targetPrice)) && (
            <div className={`p-4 rounded-lg ${
              condition === 'above' ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <p className="text-sm text-gray-600 mb-1">Alerte sera déclenchée quand:</p>
              <p className={`text-lg font-bold ${
                condition === 'above' ? 'text-green-700' : 'text-red-700'
              }`}>
                {selectedCrypto.symbol.toUpperCase()} {condition === 'above' ? '≥' : '≤'} ${parseFloat(targetPrice).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Prix actuel: ${selectedCrypto.current_price_usd.toLocaleString()}
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className={`flex-1 px-6 py-3 text-white font-semibold rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all ${
                condition === 'above'
                  ? 'bg-gradient-to-r from-green-600 to-green-700'
                  : 'bg-gradient-to-r from-red-600 to-red-700'
              }`}
            >
              🔔 Créer l'alerte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAlertModal;
