import { useState, useEffect } from 'react';
import { TransactionType } from '../../types/transaction';
import { CryptoPrice } from '../../types/crypto';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (
    cryptoId: string,
    symbol: string,
    name: string,
    type: TransactionType,
    quantity: number,
    pricePerUnit: number,
    date: string,
    notes?: string
  ) => void;
  availableCryptos: CryptoPrice[];
}

function AddTransactionModal({
  isOpen,
  onClose,
  onAdd,
  availableCryptos,
}: AddTransactionModalProps) {
  const [type, setType] = useState<TransactionType>('buy');
  const [selectedCryptoId, setSelectedCryptoId] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [pricePerUnit, setPricePerUnit] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setType('buy');
      setSelectedCryptoId('');
      setQuantity('');
      setPricePerUnit('');
      setDate(new Date().toISOString().slice(0, 16)); // Format: YYYY-MM-DDTHH:mm
      setNotes('');
      setError('');
    }
  }, [isOpen]);

  // Auto-fill price when crypto is selected
  useEffect(() => {
    if (selectedCryptoId) {
      const crypto = availableCryptos.find((c) => c.id === selectedCryptoId);
      if (crypto) {
        setPricePerUnit(crypto.current_price_usd.toString());
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

    const priceNum = parseFloat(pricePerUnit);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Veuillez entrer un prix valide (> 0)');
      return;
    }

    if (!date) {
      setError('Veuillez sélectionner une date');
      return;
    }

    // Get crypto details
    const crypto = availableCryptos.find((c) => c.id === selectedCryptoId);
    if (!crypto) {
      setError('Cryptomonnaie introuvable');
      return;
    }

    // Add transaction
    onAdd(
      crypto.id,
      crypto.symbol,
      crypto.name,
      type,
      quantityNum,
      priceNum,
      new Date(date).toISOString(),
      notes || undefined
    );
    onClose();
  };

  if (!isOpen) return null;

  const totalAmount = quantity && pricePerUnit && !isNaN(parseFloat(quantity)) && !isNaN(parseFloat(pricePerUnit))
    ? parseFloat(quantity) * parseFloat(pricePerUnit)
    : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              ➕ Nouvelle Transaction
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
          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Type de transaction
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('buy')}
                className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                  type === 'buy'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📈 Achat
              </button>
              <button
                type="button"
                onClick={() => setType('sell')}
                className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                  type === 'sell'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📉 Vente
              </button>
            </div>
          </div>

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
          </div>

          {/* Price per unit */}
          <div>
            <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
              Prix unitaire (USD)
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={pricePerUnit}
              onChange={(e) => setPricePerUnit(e.target.value)}
              placeholder="Ex: 42000"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Auto-rempli avec le prix actuel du marché
            </p>
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-2">
              Date et heure
            </label>
            <input
              id="date"
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
              Notes (optionnel)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Achat lors du dip, stratégie DCA..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors resize-none"
              rows={3}
            />
          </div>

          {/* Total Preview */}
          {totalAmount > 0 && (
            <div className={`p-4 rounded-lg ${
              type === 'buy' ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <p className="text-sm text-gray-600 mb-1">Montant total:</p>
              <p className={`text-2xl font-bold ${
                type === 'buy' ? 'text-green-700' : 'text-red-700'
              }`}>
                {type === 'buy' ? '-' : '+'} ${totalAmount.toFixed(2)}
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
                type === 'buy'
                  ? 'bg-gradient-to-r from-green-600 to-green-700'
                  : 'bg-gradient-to-r from-red-600 to-red-700'
              }`}
            >
              {type === 'buy' ? '📈 Enregistrer l\'achat' : '📉 Enregistrer la vente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTransactionModal;
