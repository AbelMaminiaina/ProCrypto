export type TransactionType = 'buy' | 'sell';

export interface Transaction {
  id: string;
  cryptoId: string;
  symbol: string;
  name: string;
  type: TransactionType;
  quantity: number;
  pricePerUnit: number; // in USD
  totalAmount: number; // quantity * pricePerUnit
  date: string; // ISO timestamp
  notes?: string;
}

export interface TransactionSummary {
  totalBuyAmount: number;
  totalSellAmount: number;
  totalBuyQuantity: number;
  totalSellQuantity: number;
  netInvested: number; // totalBuyAmount - totalSellAmount
  transactionCount: number;
}

export interface PerformanceStats {
  totalInvested: number;
  totalRealized: number; // from sells
  currentValue: number; // current portfolio value
  realizedProfitLoss: number; // from completed sells
  unrealizedProfitLoss: number; // from current holdings
  totalProfitLoss: number; // realized + unrealized
  roi: number; // return on investment %
  bestTrade?: Transaction;
  worstTrade?: Transaction;
}
