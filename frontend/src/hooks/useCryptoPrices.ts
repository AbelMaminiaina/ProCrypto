import { useState, useEffect, useCallback, useRef } from 'react';
import { getAllCryptoPrices, refreshCryptoPrices } from '../services/cryptoService';
import type { CryptoPrice } from '../types/crypto';

interface UseCryptoPricesReturn {
  prices: Map<string, CryptoPrice>;
  pricesList: CryptoPrice[];
  loading: boolean;
  error: string;
  lastUpdate: Date | null;
  refresh: () => Promise<void>;
}

const REFRESH_INTERVAL_MS = 60000; // 60 seconds

/**
 * Hook to manage cryptocurrency prices with auto-refresh
 */
export const useCryptoPrices = (): UseCryptoPricesReturn => {
  const [prices, setPrices] = useState<Map<string, CryptoPrice>>(new Map());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchPrices = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    setError('');

    try {
      const pricesData = await getAllCryptoPrices();
      const pricesMap = new Map<string, CryptoPrice>();

      pricesData.forEach((price) => {
        pricesMap.set(price.id, price);
      });

      setPrices(pricesMap);
      setLastUpdate(new Date());
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch crypto prices');
      console.error('Error fetching crypto prices:', err);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const pricesData = await refreshCryptoPrices();
      const pricesMap = new Map<string, CryptoPrice>();

      pricesData.forEach((price) => {
        pricesMap.set(price.id, price);
      });

      setPrices(pricesMap);
      setLastUpdate(new Date());
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to refresh crypto prices');
      console.error('Error refreshing crypto prices:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  // Auto-refresh interval
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set up new interval
    intervalRef.current = setInterval(() => {
      fetchPrices(false); // Don't show loading on auto-refresh
    }, REFRESH_INTERVAL_MS);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchPrices]);

  // Convert Map to array for easier rendering
  const pricesList = Array.from(prices.values());

  return {
    prices,
    pricesList,
    loading,
    error,
    lastUpdate,
    refresh,
  };
};
