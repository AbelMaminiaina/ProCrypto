export interface CryptoHolding {
  id: string;
  cryptoId: string;
  symbol: string;
  name: string;
  quantity: number;
  averagePurchasePrice: number; // in USD
  totalInvested: number; // quantity * averagePurchasePrice
  addedAt: string; // ISO timestamp
}

export interface PortfolioMetrics {
  totalCurrentValueUSD: number;
  totalCurrentValueEUR: number;
  totalCurrentValueMGA: number;
  totalInvested: number; // in USD
  totalProfitLoss: number; // in USD
  profitLossPercentage: number; // %
}

export interface HoldingWithCurrentValue extends CryptoHolding {
  currentPriceUSD: number;
  currentValueUSD: number;
  profitLoss: number;
  profitLossPercentage: number;
  priceChange24h: number | null;
}
