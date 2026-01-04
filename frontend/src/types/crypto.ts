export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price_usd: number;
  price_eur: number;
  price_mga: number;
  price_change_24h: number | null;
  market_cap_usd: number | null;
  volume_24h_usd: number | null;
  last_updated: string;
}

export interface CryptoInfo {
  id: string;
  symbol: string;
  name: string;
  image_url?: string;
  sort_order?: number;
}

export interface CryptoPricesResponse {
  success: boolean;
  count: number;
  prices: CryptoPrice[];
  cached: boolean;
  cache_age?: number;
  warning?: string;
  timestamp?: string;
}

export interface CryptoListResponse {
  success: boolean;
  count: number;
  cryptos: CryptoInfo[];
}

export interface CryptoConversionRequest {
  cryptoId: string;
  amount: number;
  currencies: ('USD' | 'EUR' | 'MGA')[];
}

export interface CryptoConversionResponse {
  success: boolean;
  cryptoId: string;
  symbol: string;
  amount: number;
  conversions: {
    [currency: string]: number;
  };
  timestamp: string;
}
