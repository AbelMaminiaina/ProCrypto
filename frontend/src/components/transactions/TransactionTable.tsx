import { useState } from 'react';
import { Transaction } from '../../types/transaction';
import { format } from 'date-fns';

interface TransactionTableProps {
  transactions: Transaction[];
  onRemove: (transactionId: string) => void;
}

type SortField = 'date' | 'crypto' | 'type' | 'amount';
type SortDirection = 'asc' | 'desc';

function TransactionTable({ transactions, onRemove }: TransactionTableProps) {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterType, setFilterType] = useState<'all' | 'buy' | 'sell'>('all');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Filter and sort transactions
  const filteredAndSortedTransactions = transactions
    .filter((t) => filterType === 'all' || t.type === filterType)
    .sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'crypto':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'amount':
          comparison = a.totalAmount - b.totalAmount;
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

  const formatNumber = (num: number, decimals = 2) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch {
      return dateString;
    }
  };

  const handleRemove = (transaction: Transaction) => {
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer cette transaction ${transaction.type} de ${transaction.name} ?`
      )
    ) {
      onRemove(transaction.id);
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📜</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Aucune transaction</h2>
          <p className="text-gray-600">
            Commencez à enregistrer vos achats et ventes de cryptomonnaies
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
      {/* Header with filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <span className="mr-2">📜</span>
          Historique des Transactions
        </h2>

        {/* Filter buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filterType === 'all'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Toutes ({transactions.length})
          </button>
          <button
            onClick={() => setFilterType('buy')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filterType === 'buy'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Achats ({transactions.filter((t) => t.type === 'buy').length})
          </button>
          <button
            onClick={() => setFilterType('sell')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filterType === 'sell'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Ventes ({transactions.filter((t) => t.type === 'sell').length})
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th
                className="text-left py-3 px-4 text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('date')}
              >
                Date {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="text-left py-3 px-4 text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('type')}
              >
                Type {sortField === 'type' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="text-left py-3 px-4 text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('crypto')}
              >
                Crypto {sortField === 'crypto' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Quantité</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Prix unitaire</th>
              <th
                className="text-right py-3 px-4 text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('amount')}
              >
                Total {sortField === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Notes</th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedTransactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                {/* Date */}
                <td className="py-4 px-4 text-sm text-gray-600">{formatDate(transaction.date)}</td>

                {/* Type */}
                <td className="py-4 px-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      transaction.type === 'buy'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {transaction.type === 'buy' ? '📈 Achat' : '📉 Vente'}
                  </span>
                </td>

                {/* Crypto */}
                <td className="py-4 px-4">
                  <div>
                    <p className="font-semibold text-gray-800">{transaction.name}</p>
                    <p className="text-sm text-gray-500">{transaction.symbol.toUpperCase()}</p>
                  </div>
                </td>

                {/* Quantity */}
                <td className="py-4 px-4 text-right font-semibold text-gray-700">
                  {formatNumber(transaction.quantity, 4)}
                </td>

                {/* Price per unit */}
                <td className="py-4 px-4 text-right text-gray-600">
                  ${formatNumber(transaction.pricePerUnit)}
                </td>

                {/* Total */}
                <td className="py-4 px-4 text-right">
                  <span className="font-bold text-primary">${formatNumber(transaction.totalAmount)}</span>
                </td>

                {/* Notes */}
                <td className="py-4 px-4 text-sm text-gray-500 max-w-xs truncate">
                  {transaction.notes || '-'}
                </td>

                {/* Action */}
                <td className="py-4 px-4 text-center">
                  <button
                    onClick={() => handleRemove(transaction)}
                    className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-semibold"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {filteredAndSortedTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="border border-gray-200 rounded-lg p-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  transaction.type === 'buy'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {transaction.type === 'buy' ? '📈 Achat' : '📉 Vente'}
              </span>
              <span className="text-xs text-gray-500">{formatDate(transaction.date)}</span>
            </div>

            {/* Details */}
            <div className="space-y-2 text-sm mb-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Crypto:</span>
                <span className="font-semibold">{transaction.name} ({transaction.symbol.toUpperCase()})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quantité:</span>
                <span className="font-semibold">{formatNumber(transaction.quantity, 4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Prix unitaire:</span>
                <span>${formatNumber(transaction.pricePerUnit)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600">Total:</span>
                <span className="font-bold text-primary">${formatNumber(transaction.totalAmount)}</span>
              </div>
              {transaction.notes && (
                <div className="pt-2 border-t">
                  <span className="text-gray-600 text-xs">Notes: </span>
                  <span className="text-gray-700 text-xs">{transaction.notes}</span>
                </div>
              )}
            </div>

            {/* Action */}
            <button
              onClick={() => handleRemove(transaction)}
              className="w-full px-3 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-semibold"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>

      {filteredAndSortedTransactions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Aucune transaction de type "{filterType === 'buy' ? 'achat' : 'vente'}" trouvée
        </div>
      )}
    </div>
  );
}

export default TransactionTable;
