import { useState, useEffect, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CryptoHolding, PortfolioMetrics, HoldingWithCurrentValue } from '../types/portfolio';
import { CryptoPrice } from '../types/crypto';
import * as localStorageService from '../services/localStorageService';

interface UsePortfolioReturn {
  holdings: CryptoHolding[];
  holdingsWithValues: HoldingWithCurrentValue[];
  metrics: PortfolioMetrics;
  addHolding: (
    cryptoId: string,
    symbol: string,
    name: string,
    quantity: number,
    purchasePrice: number
  ) => void;
  removeHolding: (holdingId: string) => void;
  updateHolding: (holdingId: string, quantity: number, purchasePrice: number) => void;
  clearAllHoldings: () => void;
  isInPortfolio: (cryptoId: string) => boolean;
  exportToJSON: () => void;
}

/**
 * Hook to manage crypto portfolio with localStorage persistence
 */
export const usePortfolio = (prices: Map<string, CryptoPrice>): UsePortfolioReturn => {
  const [holdings, setHoldings] = useState<CryptoHolding[]>([]);

  // Load holdings from localStorage on mount
  useEffect(() => {
    const savedHoldings = localStorageService.getPortfolio();
    setHoldings(savedHoldings);
  }, []);

  // Add a new holding
  const addHolding = useCallback(
    (
      cryptoId: string,
      symbol: string,
      name: string,
      quantity: number,
      purchasePrice: number
    ) => {
      const newHolding: CryptoHolding = {
        id: uuidv4(),
        cryptoId,
        symbol,
        name,
        quantity,
        averagePurchasePrice: purchasePrice,
        totalInvested: quantity * purchasePrice,
        addedAt: new Date().toISOString(),
      };

      localStorageService.addHolding(newHolding);
      setHoldings((prev) => [...prev, newHolding]);
    },
    []
  );

  // Remove a holding
  const removeHolding = useCallback((holdingId: string) => {
    localStorageService.removeHolding(holdingId);
    setHoldings((prev) => prev.filter((h) => h.id !== holdingId));
  }, []);

  // Update a holding
  const updateHolding = useCallback(
    (holdingId: string, quantity: number, purchasePrice: number) => {
      const updates = {
        quantity,
        averagePurchasePrice: purchasePrice,
        totalInvested: quantity * purchasePrice,
      };

      localStorageService.updateHolding(holdingId, updates);
      setHoldings((prev) =>
        prev.map((h) => (h.id === holdingId ? { ...h, ...updates } : h))
      );
    },
    []
  );

  // Clear all holdings
  const clearAllHoldings = useCallback(() => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer tout votre portfolio ?')) {
      localStorageService.clearPortfolio();
      setHoldings([]);
    }
  }, []);

  // Check if crypto is in portfolio
  const isInPortfolio = useCallback(
    (cryptoId: string) => {
      return holdings.some((h) => h.cryptoId === cryptoId);
    },
    [holdings]
  );

  // Export to JSON
  const exportToJSON = useCallback(() => {
    localStorageService.exportPortfolioToJSON();
  }, []);

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
    addHolding,
    removeHolding,
    updateHolding,
    clearAllHoldings,
    isInPortfolio,
    exportToJSON,
  };
};
