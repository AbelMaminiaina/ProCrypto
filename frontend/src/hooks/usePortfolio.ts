import { useState, useEffect, useCallback, useMemo } from 'react';
import { CryptoHolding, PortfolioMetrics, HoldingWithCurrentValue } from '../types/portfolio';
import { CryptoPrice } from '../types/crypto';
import { useAuth } from '../contexts/AuthContext';
import * as portfolioService from '../services/portfolioService';

interface UsePortfolioReturn {
  holdings: CryptoHolding[];
  holdingsWithValues: HoldingWithCurrentValue[];
  metrics: PortfolioMetrics;
  loading: boolean;
  error: string | null;
  addHolding: (
    cryptoId: string,
    symbol: string,
    name: string,
    quantity: number,
    purchasePrice: number
  ) => Promise<void>;
  removeHolding: (holdingId: string) => Promise<void>;
  updateHolding: (holdingId: string, quantity: number, purchasePrice: number) => Promise<void>;
  clearAllHoldings: () => Promise<void>;
  isInPortfolio: (cryptoId: string) => boolean;
  exportToJSON: () => void;
  refreshPortfolio: () => Promise<void>;
}

/**
 * Hook to manage crypto portfolio with backend API
 */
export const usePortfolio = (prices: Map<string, CryptoPrice>): UsePortfolioReturn => {
  const { isAuthenticated } = useAuth();
  const [holdings, setHoldings] = useState<CryptoHolding[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load holdings from backend on mount or when authentication changes
  const refreshPortfolio = useCallback(async () => {
    if (!isAuthenticated) {
      setHoldings([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const portfolioData = await portfolioService.getPortfolio();
      // Map backend format to frontend format
      const mappedHoldings: CryptoHolding[] = portfolioData.map((h) => ({
        id: h.id,
        cryptoId: h.cryptoId,
        symbol: h.symbol,
        name: h.name,
        quantity: h.quantity,
        averagePurchasePrice: h.averagePurchasePrice,
        totalInvested: h.totalInvested,
        addedAt: h.addedAt,
      }));
      setHoldings(mappedHoldings);
    } catch (err: any) {
      console.error('Error loading portfolio:', err);
      setError(err.response?.data?.error || 'Erreur de chargement du portfolio');
      setHoldings([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshPortfolio();
  }, [refreshPortfolio]);

  // Add a new holding
  const addHolding = useCallback(
    async (
      cryptoId: string,
      symbol: string,
      name: string,
      quantity: number,
      purchasePrice: number
    ) => {
      if (!isAuthenticated) {
        setError('Vous devez être connecté pour ajouter au portfolio');
        return;
      }

      setError(null);

      try {
        await portfolioService.addToPortfolio({
          cryptoId,
          symbol,
          name,
          quantity,
          purchasePrice,
        });

        // Refresh portfolio to get updated data
        await refreshPortfolio();
      } catch (err: any) {
        console.error('Error adding to portfolio:', err);
        setError(err.response?.data?.error || 'Erreur lors de l\'ajout au portfolio');
        throw err;
      }
    },
    [isAuthenticated, refreshPortfolio]
  );

  // Remove a holding
  const removeHolding = useCallback(
    async (holdingId: string) => {
      if (!isAuthenticated) {
        setError('Vous devez être connecté');
        return;
      }

      setError(null);

      try {
        await portfolioService.deleteHolding(holdingId);
        // Update local state immediately for better UX
        setHoldings((prev) => prev.filter((h) => h.id !== holdingId));
      } catch (err: any) {
        console.error('Error removing holding:', err);
        setError(err.response?.data?.error || 'Erreur lors de la suppression');
        // Refresh to restore state in case of error
        await refreshPortfolio();
        throw err;
      }
    },
    [isAuthenticated, refreshPortfolio]
  );

  // Update a holding
  const updateHolding = useCallback(
    async (holdingId: string, quantity: number, purchasePrice: number) => {
      if (!isAuthenticated) {
        setError('Vous devez être connecté');
        return;
      }

      setError(null);

      try {
        await portfolioService.updateHolding(holdingId, {
          quantity,
          purchasePrice,
        });

        // Refresh portfolio to get updated data
        await refreshPortfolio();
      } catch (err: any) {
        console.error('Error updating holding:', err);
        setError(err.response?.data?.error || 'Erreur lors de la mise à jour');
        throw err;
      }
    },
    [isAuthenticated, refreshPortfolio]
  );

  // Clear all holdings
  const clearAllHoldings = useCallback(async () => {
    if (!isAuthenticated) {
      setError('Vous devez être connecté');
      return;
    }

    if (!window.confirm('Êtes-vous sûr de vouloir supprimer tout votre portfolio ?')) {
      return;
    }

    setError(null);

    try {
      await portfolioService.clearPortfolio();
      setHoldings([]);
    } catch (err: any) {
      console.error('Error clearing portfolio:', err);
      setError(err.response?.data?.error || 'Erreur lors de la suppression');
      throw err;
    }
  }, [isAuthenticated]);

  // Check if crypto is in portfolio
  const isInPortfolio = useCallback(
    (cryptoId: string) => {
      return holdings.some((h) => h.cryptoId === cryptoId);
    },
    [holdings]
  );

  // Export to JSON
  const exportToJSON = useCallback(() => {
    const dataStr = JSON.stringify(holdings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `procrypto-portfolio-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [holdings]);

  // Calculate holdings with current values
  const holdingsWithValues: HoldingWithCurrentValue[] = useMemo(() => {
    return holdings.map((holding) => {
      const currentPrice = prices.get(holding.cryptoId);

      if (!currentPrice) {
        // If price not available, return holding with zero current values
        return {
          ...holding,
          currentPriceUSD: 0,
          currentValueUSD: 0,
          profitLoss: -holding.totalInvested,
          profitLossPercentage: -100,
          priceChange24h: null,
        };
      }

      const currentValueUSD = holding.quantity * currentPrice.current_price_usd;
      const profitLoss = currentValueUSD - holding.totalInvested;
      const profitLossPercentage =
        holding.totalInvested > 0 ? (profitLoss / holding.totalInvested) * 100 : 0;

      return {
        ...holding,
        currentPriceUSD: currentPrice.current_price_usd,
        currentValueUSD,
        profitLoss,
        profitLossPercentage,
        priceChange24h: currentPrice.price_change_24h,
      };
    });
  }, [holdings, prices]);

  // Calculate portfolio metrics
  const metrics: PortfolioMetrics = useMemo(() => {
    const totalInvested = holdingsWithValues.reduce((sum, h) => sum + h.totalInvested, 0);
    const totalCurrentValueUSD = holdingsWithValues.reduce((sum, h) => sum + h.currentValueUSD, 0);
    const totalProfitLoss = totalCurrentValueUSD - totalInvested;
    const profitLossPercentage = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

    // Get EUR to USD rate (approximate from first available crypto price)
    const firstPrice = Array.from(prices.values())[0];
    const eurToUsd = firstPrice
      ? firstPrice.current_price_usd / firstPrice.price_eur
      : 1.09;
    const usdToEur = 1 / eurToUsd;

    // Get MGA rate (from first available crypto price)
    const mgaRate = firstPrice
      ? firstPrice.price_mga / firstPrice.price_eur
      : 5070;

    return {
      totalCurrentValueUSD,
      totalCurrentValueEUR: totalCurrentValueUSD * usdToEur,
      totalCurrentValueMGA: totalCurrentValueUSD * usdToEur * mgaRate,
      totalInvested,
      totalProfitLoss,
      profitLossPercentage,
    };
  }, [holdingsWithValues, prices]);

  return {
    holdings,
    holdingsWithValues,
    metrics,
    loading,
    error,
    addHolding,
    removeHolding,
    updateHolding,
    clearAllHoldings,
    isInPortfolio,
    exportToJSON,
    refreshPortfolio,
  };
};
