import { CryptoHolding } from '../types/portfolio';

const PORTFOLIO_KEY = 'procrypto_portfolio';
const VERSION_KEY = 'procrypto_version';
const CURRENT_VERSION = 1;

interface LocalStorageData {
  version: number;
  portfolio: CryptoHolding[];
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
