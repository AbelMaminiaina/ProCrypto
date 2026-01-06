import { useState, useEffect, useCallback, useMemo } from 'react';
import { PriceAlert, CreateAlertInput, AlertSummary } from '../types/alert';
import { CryptoPrice } from '../types/crypto';
import { useAuth } from '../contexts/AuthContext';
import * as alertsService from '../services/alertsService';
import {
  sendPriceAlertNotification,
  areNotificationsEnabled,
} from '../services/notificationService';

interface UsePriceAlertsReturn {
  alerts: PriceAlert[];
  summary: AlertSummary;
  loading: boolean;
  error: string | null;
  addAlert: (input: CreateAlertInput) => Promise<void>;
  removeAlert: (alertId: string) => Promise<void>;
  toggleAlertStatus: (alertId: string) => Promise<void>;
  clearAllAlerts: () => Promise<void>;
  exportToJSON: () => void;
  notificationsEnabled: boolean;
  refreshAlerts: () => Promise<void>;
}

/**
 * Hook to manage price alerts with automatic monitoring and backend API
 */
export const usePriceAlerts = (prices: Map<string, CryptoPrice>): UsePriceAlertsReturn => {
  const { isAuthenticated } = useAuth();
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);

  // Load alerts from backend
  const refreshAlerts = useCallback(async () => {
    if (!isAuthenticated) {
      setAlerts([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const alertsData = await alertsService.getAlerts();
      setAlerts(alertsData);
    } catch (err: any) {
      console.error('Error loading alerts:', err);
      setError(err.response?.data?.error || 'Erreur de chargement des alertes');
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshAlerts();
    setNotificationsEnabled(areNotificationsEnabled());
  }, [refreshAlerts]);

  // Monitor prices and trigger alerts
  useEffect(() => {
    if (!isAuthenticated || alerts.length === 0 || prices.size === 0) {
      return;
    }

    alerts.forEach(async (alert) => {
      // Only check active alerts that haven't been triggered yet
      if (alert.status !== 'active' || alert.notified) {
        return;
      }

      const cryptoPrice = prices.get(alert.cryptoId);
      if (!cryptoPrice) {
        return;
      }

      const currentPrice = cryptoPrice.current_price_usd;
      let shouldTrigger = false;

      // Check if condition is met
      if (alert.condition === 'above' && currentPrice >= alert.targetPrice) {
        shouldTrigger = true;
      } else if (alert.condition === 'below' && currentPrice <= alert.targetPrice) {
        shouldTrigger = true;
      }

      // Trigger alert
      if (shouldTrigger) {
        console.log(
          `Alert triggered for ${alert.symbol}: ${currentPrice} ${alert.condition} ${alert.targetPrice}`
        );

        // Send notification if enabled
        if (notificationsEnabled) {
          sendPriceAlertNotification(
            alert.symbol,
            currentPrice,
            alert.targetPrice,
            alert.condition
          );
        }

        try {
          // Mark alert as triggered in backend
          await alertsService.triggerAlert(alert.id);

          // Update local state
          setAlerts((prevAlerts) =>
            prevAlerts.map((a) =>
              a.id === alert.id
                ? {
                    ...a,
                    status: 'triggered' as const,
                    triggeredAt: new Date().toISOString(),
                    notified: true,
                  }
                : a
            )
          );
        } catch (err) {
          console.error('Error triggering alert in backend:', err);
        }
      }
    });
  }, [prices, alerts, notificationsEnabled, isAuthenticated]);

  /**
   * Add a new alert
   */
  const addAlert = useCallback(
    async (input: CreateAlertInput) => {
      if (!isAuthenticated) {
        setError('Vous devez être connecté pour créer une alerte');
        return;
      }

      setError(null);

      try {
        await alertsService.createAlert(input);
        // Refresh alerts to get updated data
        await refreshAlerts();
      } catch (err: any) {
        console.error('Error adding alert:', err);
        setError(err.response?.data?.error || 'Erreur lors de la création de l\'alerte');
        throw err;
      }
    },
    [isAuthenticated, refreshAlerts]
  );

  /**
   * Remove an alert
   */
  const removeAlert = useCallback(
    async (alertId: string) => {
      if (!isAuthenticated) {
        setError('Vous devez être connecté');
        return;
      }

      setError(null);

      try {
        await alertsService.deleteAlert(alertId);
        // Update local state immediately for better UX
        setAlerts((prev) => prev.filter((a) => a.id !== alertId));
      } catch (err: any) {
        console.error('Error removing alert:', err);
        setError(err.response?.data?.error || 'Erreur lors de la suppression');
        // Refresh to restore state in case of error
        await refreshAlerts();
        throw err;
      }
    },
    [isAuthenticated, refreshAlerts]
  );

  /**
   * Toggle alert status (active/disabled)
   */
  const toggleAlertStatus = useCallback(
    async (alertId: string) => {
      if (!isAuthenticated) {
        setError('Vous devez être connecté');
        return;
      }

      setError(null);

      try {
        const result = await alertsService.toggleAlert(alertId);

        // Update local state
        setAlerts((prev) =>
          prev.map((a) =>
            a.id === alertId
              ? { ...a, status: result.status as 'active' | 'disabled' }
              : a
          )
        );
      } catch (err: any) {
        console.error('Error toggling alert:', err);
        setError(err.response?.data?.error || 'Erreur lors de la modification');
        throw err;
      }
    },
    [isAuthenticated]
  );

  /**
   * Clear all alerts
   */
  const clearAllAlerts = useCallback(async () => {
    if (!isAuthenticated) {
      setError('Vous devez être connecté');
      return;
    }

    if (!window.confirm('Êtes-vous sûr de vouloir supprimer toutes les alertes ?')) {
      return;
    }

    setError(null);

    try {
      await alertsService.clearAlerts();
      setAlerts([]);
    } catch (err: any) {
      console.error('Error clearing alerts:', err);
      setError(err.response?.data?.error || 'Erreur lors de la suppression');
      throw err;
    }
  }, [isAuthenticated]);

  /**
   * Export alerts to JSON
   */
  const exportToJSON = useCallback(() => {
    const dataStr = JSON.stringify(alerts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `procrypto-alerts-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [alerts]);

  /**
   * Calculate alert summary statistics
   */
  const summary: AlertSummary = useMemo(() => {
    return {
      totalAlerts: alerts.length,
      activeAlerts: alerts.filter((a) => a.status === 'active').length,
      triggeredAlerts: alerts.filter((a) => a.status === 'triggered').length,
      disabledAlerts: alerts.filter((a) => a.status === 'disabled').length,
    };
  }, [alerts]);

  return {
    alerts,
    summary,
    loading,
    error,
    addAlert,
    removeAlert,
    toggleAlertStatus,
    clearAllAlerts,
    exportToJSON,
    notificationsEnabled,
    refreshAlerts,
  };
};
