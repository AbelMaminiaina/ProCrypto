import { useState, useEffect } from 'react';
import { CryptoPrice } from '../../types/crypto';

interface AddCryptoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (cryptoId: string, symbol: string, name: string, quantity: number, purchasePrice: number) => void;
  availableCryptos: CryptoPrice[];
  isInPortfolio: (cryptoId: string) => boolean;
}

function AddCryptoModal({
  isOpen,
  onClose,
  onAdd,
  availableCryptos,
  isInPortfolio,
}: AddCryptoModalProps) {
  const [selectedCryptoId, setSelectedCryptoId] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [purchasePrice, setPurchasePrice] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedCryptoId('');
      setQuantity('');
      setPurchasePrice('');
      setError('');
    }
  }, [isOpen]);

  // Auto-fill purchase price when crypto is selected
  useEffect(() => {
    if (selectedCryptoId) {
      const crypto = availableCryptos.find((c) => c.id === selectedCryptoId);
      if (crypto) {
        setPurchasePrice(crypto.current_price_usd.toString());
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

    const quantityNum = parseFloat(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      setError('Veuillez entrer une quantité valide (> 0)');
      return;
    }

    const priceNum = parseFloat(purchasePrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Veuillez entrer un prix d\'achat valide (> 0)');
      return;
    }

    // Check if already in portfolio
    if (isInPortfolio(selectedCryptoId)) {
      setError('Cette cryptomonnaie est déjà dans votre portfolio');
      return;
    }

    // Get crypto details
    const crypto = availableCryptos.find((c) => c.id === selectedCryptoId);
    if (!crypto) {
      setError('Cryptomonnaie introuvable');
      return;
    }

    // Add to portfolio
    onAdd(crypto.id, crypto.symbol, crypto.name, quantityNum, priceNum);
    onClose();
  };

  if (!isOpen) return null;

  const filteredCryptos = availableCryptos.filter((c) => !isInPortfolio(c.id));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              ➕ Ajouter une Crypto
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
              {filteredCryptos.map((crypto) => (
                <option key={crypto.id} value={crypto.id}>
                  {crypto.name} ({crypto.symbol.toUpperCase()}) - ${crypto.current_price_usd.toFixed(2)}
                </option>
              ))}
            </select>
            {filteredCryptos.length === 0 && (
              <p className="text-sm text-orange-600 mt-2">
                Toutes les cryptomonnaies disponibles sont déjà dans votre portfolio
              </p>
            )}
          </div>

          {/* Quantity */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-semibold text-gray-700 mb-2">
              Quantité
            </label>
            <input
              id="quantity"
              type="number"
              step="0.00000001"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Ex: 0.5"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Nombre de tokens que vous possédez
            </p>
          </div>

          {/* Purchase Price */}
          <div>
            <label htmlFor="purchase-price" className="block text-sm font-semibold text-gray-700 mb-2">
              Prix d'achat (USD)
            </label>
            <input
              id="purchase-price"
              type="number"
              step="0.01"
              min="0"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              placeholder="Ex: 42000"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Prix auquel vous avez acheté (auto-rempli avec le prix actuel)
            </p>
          </div>

          {/* Total Invested Preview */}
          {quantity && purchasePrice && !isNaN(parseFloat(quantity)) && !isNaN(parseFloat(purchasePrice)) && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total investi:</p>
              <p className="text-2xl font-bold text-primary">
                ${(parseFloat(quantity) * parseFloat(purchasePrice)).toFixed(2)}
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
              disabled={filteredCryptos.length === 0}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCryptoModal;
