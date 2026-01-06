import { CryptoHolding } from '../types/portfolio';
import { Transaction } from '../types/transaction';
import { PriceAlert } from '../types/alert';

const PORTFOLIO_KEY = 'procrypto_portfolio';
const TRANSACTIONS_KEY = 'procrypto_transactions';
const ALERTS_KEY = 'procrypto_alerts';
const CURRENT_VERSION = 1;

interface LocalStorageData {
  version: number;
  portfolio: CryptoHolding[];
  lastUpdated: string;
}

interface TransactionsData {
  version: number;
  transactions: Transaction[];
  lastUpdated: string;
}

interface AlertsData {
  version: number;
  alerts: PriceAlert[];
  lastUpdated: string;
}

/**
 * Get portfolio from localStorage
 */
export const getPortfolio = (): CryptoHolding[] => {
  try {
    const data = localStorage.getItem(PORTFOLIO_KEY);
    if (!data) {
      return [];
    }

    const parsed: LocalStorageData = JSON.parse(data);

    // Version check and migration if needed
    if (parsed.version !== CURRENT_VERSION) {
      // Future: handle migrations here
      return migrateData(parsed);
    }

    return parsed.portfolio || [];
  } catch (error) {
    console.error('Error reading portfolio from localStorage:', error);
    return [];
  }
};

/**
 * Save portfolio to localStorage
 */
export const savePortfolio = (portfolio: CryptoHolding[]): void => {
  try {
    const data: LocalStorageData = {
      version: CURRENT_VERSION,
      portfolio,
      lastUpdated: new Date().toISOString(),
    };

    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving portfolio to localStorage:', error);
    throw new Error('Failed to save portfolio. Storage may be full.');
  }
};

/**
 * Add a holding to portfolio
 */
export const addHolding = (holding: CryptoHolding): void => {
  const portfolio = getPortfolio();
  portfolio.push(holding);
  savePortfolio(portfolio);
};

/**
 * Update a holding in portfolio
 */
export const updateHolding = (holdingId: string, updates: Partial<CryptoHolding>): void => {
  const portfolio = getPortfolio();
  const index = portfolio.findIndex((h) => h.id === holdingId);

  if (index !== -1) {
    portfolio[index] = { ...portfolio[index], ...updates };
    savePortfolio(portfolio);
  }
};

/**
 * Remove a holding from portfolio
 */
export const removeHolding = (holdingId: string): void => {
  const portfolio = getPortfolio();
  const filtered = portfolio.filter((h) => h.id !== holdingId);
  savePortfolio(filtered);
};

/**
 * Clear entire portfolio
 */
export const clearPortfolio = (): void => {
  localStorage.removeItem(PORTFOLIO_KEY);
};

/**
 * Get portfolio size (number of holdings)
 */
export const getPortfolioSize = (): number => {
  return getPortfolio().length;
};

/**
 * Check if a crypto is already in portfolio
 */
export const isCryptoInPortfolio = (cryptoId: string): boolean => {
  const portfolio = getPortfolio();
  return portfolio.some((h) => h.cryptoId === cryptoId);
};

/**
 * Migrate old data format to new version
 */
const migrateData = (oldData: any): CryptoHolding[] => {
  // For future use when we need to migrate data
  // For now, just return empty array
  console.warn('Migrating old portfolio data to new version');
  return oldData.portfolio || [];
};

/**
 * Export portfolio as JSON file
 */
export const exportPortfolioToJSON = (): void => {
  const portfolio = getPortfolio();
  const dataStr = JSON.stringify(portfolio, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `procrypto-portfolio-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Import portfolio from JSON file
 */
export const importPortfolioFromJSON = (jsonString: string): void => {
  try {
    const portfolio: CryptoHolding[] = JSON.parse(jsonString);

    // Validate structure
    if (!Array.isArray(portfolio)) {
      throw new Error('Invalid portfolio format');
    }

    // Basic validation of each holding
    portfolio.forEach((holding) => {
      if (!holding.id || !holding.cryptoId || !holding.symbol || !holding.name) {
        throw new Error('Invalid holding structure');
      }
    });

    savePortfolio(portfolio);
  } catch (error) {
    console.error('Error importing portfolio:', error);
    throw new Error('Failed to import portfolio. Invalid JSON format.');
  }
};

// ============================================
// TRANSACTIONS MANAGEMENT
// ============================================

/**
 * Get transactions from localStorage
 */
export const getTransactions = (): Transaction[] => {
  try {
    const data = localStorage.getItem(TRANSACTIONS_KEY);
    if (!data) {
      return [];
    }

    const parsed: TransactionsData = JSON.parse(data);

    // Version check
    if (parsed.version !== CURRENT_VERSION) {
      return migrateTransactionsData(parsed);
    }

    return parsed.transactions || [];
  } catch (error) {
    console.error('Error reading transactions from localStorage:', error);
    return [];
  }
};

/**
 * Save transactions to localStorage
 */
export const saveTransactions = (transactions: Transaction[]): void => {
  try {
    const data: TransactionsData = {
      version: CURRENT_VERSION,
      transactions,
      lastUpdated: new Date().toISOString(),
    };

    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving transactions to localStorage:', error);
    throw new Error('Failed to save transactions. Storage may be full.');
  }
};

/**
 * Add a transaction
 */
export const addTransaction = (transaction: Transaction): void => {
  const transactions = getTransactions();
  transactions.unshift(transaction); // Add to beginning (most recent first)
  saveTransactions(transactions);
};

/**
 * Remove a transaction
 */
export const removeTransaction = (transactionId: string): void => {
  const transactions = getTransactions();
  const filtered = transactions.filter((t) => t.id !== transactionId);
  saveTransactions(filtered);
};

/**
 * Clear all transactions
 */
export const clearTransactions = (): void => {
  localStorage.removeItem(TRANSACTIONS_KEY);
};

/**
 * Get transactions for a specific crypto
 */
export const getTransactionsByCrypto = (cryptoId: string): Transaction[] => {
  const transactions = getTransactions();
  return transactions.filter((t) => t.cryptoId === cryptoId);
};

/**
 * Export transactions as JSON
 */
export const exportTransactionsToJSON = (): void => {
  const transactions = getTransactions();
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
};

/**
 * Migrate old transactions data
 */
const migrateTransactionsData = (oldData: any): Transaction[] => {
  console.warn('Migrating old transactions data to new version');
  return oldData.transactions || [];
};

// ============================================
// PRICE ALERTS MANAGEMENT
// ============================================

/**
 * Get alerts from localStorage
 */
export const getAlerts = (): PriceAlert[] => {
  try {
    const data = localStorage.getItem(ALERTS_KEY);
    if (!data) {
      return [];
    }

    const parsed: AlertsData = JSON.parse(data);

    // Version check
    if (parsed.version !== CURRENT_VERSION) {
      return migrateAlertsData(parsed);
    }

    return parsed.alerts || [];
  } catch (error) {
    console.error('Error reading alerts from localStorage:', error);
    return [];
  }
};

/**
 * Save alerts to localStorage
 */
export const saveAlerts = (alerts: PriceAlert[]): void => {
  try {
    const data: AlertsData = {
      version: CURRENT_VERSION,
      alerts,
      lastUpdated: new Date().toISOString(),
    };

    localStorage.setItem(ALERTS_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving alerts to localStorage:', error);
    throw new Error('Failed to save alerts. Storage may be full.');
  }
};

/**
 * Add an alert
 */
export const addAlert = (alert: PriceAlert): void => {
  const alerts = getAlerts();
  alerts.push(alert);
  saveAlerts(alerts);
};

/**
 * Update an alert
 */
export const updateAlert = (alertId: string, updates: Partial<PriceAlert>): void => {
  const alerts = getAlerts();
  const index = alerts.findIndex((a) => a.id === alertId);

  if (index !== -1) {
    alerts[index] = { ...alerts[index], ...updates };
    saveAlerts(alerts);
  }
};

/**
 * Remove an alert
 */
export const removeAlert = (alertId: string): void => {
  const alerts = getAlerts();
  const filtered = alerts.filter((a) => a.id !== alertId);
  saveAlerts(filtered);
};

/**
 * Clear all alerts
 */
export const clearAlerts = (): void => {
  localStorage.removeItem(ALERTS_KEY);
};

/**
 * Get active alerts only
 */
export const getActiveAlerts = (): PriceAlert[] => {
  const alerts = getAlerts();
  return alerts.filter((a) => a.status === 'active');
};

/**
 * Get alerts for a specific crypto
 */
export const getAlertsByCrypto = (cryptoId: string): PriceAlert[] => {
  const alerts = getAlerts();
  return alerts.filter((a) => a.cryptoId === cryptoId);
};

/**
 * Mark alert as triggered
 */
export const markAlertAsTriggered = (alertId: string): void => {
  updateAlert(alertId, {
    status: 'triggered',
    triggeredAt: new Date().toISOString(),
    notified: true,
  });
};

/**
 * Toggle alert status (active/disabled)
 */
export const toggleAlertStatus = (alertId: string): void => {
  const alerts = getAlerts();
  const alert = alerts.find((a) => a.id === alertId);

  if (alert) {
    const newStatus = alert.status === 'active' ? 'disabled' : 'active';
    updateAlert(alertId, { status: newStatus });
  }
};

/**
 * Export alerts as JSON
 */
export const exportAlertsToJSON = (): void => {
  const alerts = getAlerts();
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
};

/**
 * Migrate old alerts data
 */
const migrateAlertsData = (oldData: any): PriceAlert[] => {
  console.warn('Migrating old alerts data to new version');
  return oldData.alerts || [];
};
