import { useState, useEffect, useCallback, useMemo } from 'react';
import { Transaction, TransactionType, TransactionSummary, PerformanceStats } from '../types/transaction';
import { CryptoPrice } from '../types/crypto';
import { HoldingWithCurrentValue } from '../types/portfolio';
import { useAuth } from '../contexts/AuthContext';
import * as transactionsService from '../services/transactionsService';

interface UseTransactionsReturn {
  transactions: Transaction[];
  summary: TransactionSummary;
  performanceStats: PerformanceStats;
  loading: boolean;
  error: string | null;
  addTransaction: (
    cryptoId: string,
    symbol: string,
    name: string,
    type: TransactionType,
    quantity: number,
    pricePerUnit: number,
    date: string,
    notes?: string
  ) => Promise<void>;
  removeTransaction: (transactionId: string) => Promise<void>;
  clearAllTransactions: () => Promise<void>;
  getTransactionsByCrypto: (cryptoId: string) => Transaction[];
  exportToJSON: () => void;
  refreshTransactions: () => Promise<void>;
}

/**
 * Hook to manage crypto transactions with backend API
 */
export const useTransactions = (
  holdings: HoldingWithCurrentValue[],
  _prices: Map<string, CryptoPrice>
): UseTransactionsReturn => {
  const { isAuthenticated } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load transactions from backend
  const refreshTransactions = useCallback(async () => {
    if (!isAuthenticated) {
      setTransactions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const transactionsData = await transactionsService.getTransactions();
      setTransactions(transactionsData);
    } catch (err: any) {
      console.error('Error loading transactions:', err);
      setError(err.response?.data?.error || 'Erreur de chargement des transactions');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshTransactions();
  }, [refreshTransactions]);

  // Add a new transaction
  const addTransaction = useCallback(
    async (
      cryptoId: string,
      symbol: string,
      name: string,
      type: TransactionType,
      quantity: number,
      pricePerUnit: number,
      date: string,
      notes?: string
    ) => {
      if (!isAuthenticated) {
        setError('Vous devez être connecté pour ajouter une transaction');
        return;
      }

      setError(null);

      try {
        await transactionsService.addTransaction({
          cryptoId,
          symbol,
          name,
          type,
          quantity,
          pricePerUnit,
          date,
          notes,
        });

        // Refresh transactions to get updated data
        await refreshTransactions();
      } catch (err: any) {
        console.error('Error adding transaction:', err);
        setError(err.response?.data?.error || 'Erreur lors de l\'ajout de la transaction');
        throw err;
      }
    },
    [isAuthenticated, refreshTransactions]
  );

  // Remove a transaction
  const removeTransaction = useCallback(
    async (transactionId: string) => {
      if (!isAuthenticated) {
        setError('Vous devez être connecté');
        return;
      }

      setError(null);

      try {
        await transactionsService.deleteTransaction(transactionId);
        // Update local state immediately for better UX
        setTransactions((prev) => prev.filter((t) => t.id !== transactionId));
      } catch (err: any) {
        console.error('Error removing transaction:', err);
        setError(err.response?.data?.error || 'Erreur lors de la suppression');
        // Refresh to restore state in case of error
        await refreshTransactions();
        throw err;
      }
    },
    [isAuthenticated, refreshTransactions]
  );

  // Clear all transactions
  const clearAllTransactions = useCallback(async () => {
    if (!isAuthenticated) {
      setError('Vous devez être connecté');
      return;
    }

    if (!window.confirm('Êtes-vous sûr de vouloir supprimer tout l\'historique des transactions ?')) {
      return;
    }

    setError(null);

    try {
      await transactionsService.clearTransactions();
      setTransactions([]);
    } catch (err: any) {
      console.error('Error clearing transactions:', err);
      setError(err.response?.data?.error || 'Erreur lors de la suppression');
      throw err;
    }
  }, [isAuthenticated]);

  // Get transactions for a specific crypto
  const getTransactionsByCrypto = useCallback(
    (cryptoId: string) => {
      return transactions.filter((t) => t.cryptoId === cryptoId);
    },
    [transactions]
  );

  // Export to JSON
  const exportToJSON = useCallback(() => {
    const dataStr = JSON.stringify(transactions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `procrypto-transactions-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [transactions]);

  // Calculate transaction summary
  const summary: TransactionSummary = useMemo(() => {
    const buyTransactions = transactions.filter((t) => t.type === 'buy');
    const sellTransactions = transactions.filter((t) => t.type === 'sell');

    const totalBuyAmount = buyTransactions.reduce((sum, t) => sum + t.totalAmount, 0);
    const totalSellAmount = sellTransactions.reduce((sum, t) => sum + t.totalAmount, 0);
    const totalBuyQuantity = buyTransactions.reduce((sum, t) => sum + t.quantity, 0);
    const totalSellQuantity = sellTransactions.reduce((sum, t) => sum + t.quantity, 0);

    return {
      totalBuyAmount,
      totalSellAmount,
      totalBuyQuantity,
      totalSellQuantity,
      netInvested: totalBuyAmount - totalSellAmount,
      transactionCount: transactions.length,
    };
  }, [transactions]);

  // Calculate performance statistics
  const performanceStats: PerformanceStats = useMemo(() => {
    // Total invested (all buys)
    const totalInvested = summary.totalBuyAmount;

    // Total realized (all sells)
    const totalRealized = summary.totalSellAmount;

    // Current portfolio value
    const currentValue = holdings.reduce((sum, h) => sum + h.currentValueUSD, 0);

    // Realized P/L (from sells - buys cost basis would need more complex tracking)
    // Simplified: we'll calculate based on average buy price
    const realizedProfitLoss = totalRealized - (summary.totalSellQuantity > 0
      ? (totalInvested / summary.totalBuyQuantity) * summary.totalSellQuantity
      : 0);

    // Unrealized P/L (current holdings)
    const unrealizedProfitLoss = holdings.reduce((sum, h) => sum + h.profitLoss, 0);

    // Total P/L
    const totalProfitLoss = realizedProfitLoss + unrealizedProfitLoss;

    // ROI
    const roi = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

    // Find best and worst trades (sell transactions only)
    const sellTransactions = transactions.filter((t) => t.type === 'sell');
    let bestTrade: Transaction | undefined;
    let worstTrade: Transaction | undefined;

    if (sellTransactions.length > 0) {
      // For simplicity, we'll compare based on price per unit
      // A more accurate method would need to track the buy price for each sell
      bestTrade = sellTransactions.reduce((best, t) =>
        t.pricePerUnit > (best?.pricePerUnit || 0) ? t : best
      );

      worstTrade = sellTransactions.reduce((worst, t) =>
        t.pricePerUnit < (worst?.pricePerUnit || Infinity) ? t : worst
      );
    }

    return {
      totalInvested,
      totalRealized,
      currentValue,
      realizedProfitLoss,
      unrealizedProfitLoss,
      totalProfitLoss,
      roi,
      bestTrade,
      worstTrade,
    };
  }, [transactions, holdings, summary]);

  return {
    transactions,
    summary,
    performanceStats,
    loading,
    error,
    addTransaction,
    removeTransaction,
    clearAllTransactions,
    getTransactionsByCrypto,
    exportToJSON,
    refreshTransactions,
  };
};
