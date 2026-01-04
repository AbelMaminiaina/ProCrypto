import axios from 'axios';
import type {
  CryptoPrice,
  CryptoInfo,
  CryptoPricesResponse,
  CryptoListResponse,
  CryptoConversionRequest,
  CryptoConversionResponse,
} from '../types/crypto';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Get list of supported cryptocurrencies
 */
export const getCryptoList = async (): Promise<CryptoInfo[]> => {
  const response = await axios.get<CryptoListResponse>(`${API_URL}/crypto/list`);
  if (!response.data.success) {
    throw new Error('Failed to fetch crypto list');
  }
  return response.data.cryptos;
};

/**
 * Get all cryptocurrency prices
 */
export const getAllCryptoPrices = async (): Promise<CryptoPrice[]> => {
  const response = await axios.get<CryptoPricesResponse>(`${API_URL}/crypto/prices`);
  if (!response.data.success) {
    throw new Error('Failed to fetch crypto prices');
  }
  return response.data.prices;
};

/**
 * Get specific cryptocurrency price by ID
 */
export const getCryptoPrice = async (cryptoId: string): Promise<CryptoPrice> => {
  const response = await axios.get<{ success: boolean; price: CryptoPrice }>(
    `${API_URL}/crypto/prices/${cryptoId}`
  );
  if (!response.data.success) {
    throw new Error(`Failed to fetch price for ${cryptoId}`);
  }
  return response.data.price;
};

/**
 * Force refresh all cryptocurrency prices from CoinGecko
 */
export const refreshCryptoPrices = async (): Promise<CryptoPrice[]> => {
  const response = await axios.post<CryptoPricesResponse>(`${API_URL}/crypto/prices/refresh`);
  if (!response.data.success) {
    throw new Error('Failed to refresh crypto prices');
  }
  return response.data.prices;
};

/**
 * Search cryptocurrencies by name or symbol
 */
export const searchCryptos = async (query: string): Promise<CryptoInfo[]> => {
  const response = await axios.get<{ success: boolean; count: number; results: CryptoInfo[] }>(
    `${API_URL}/crypto/search`,
    {
      params: { q: query },
    }
  );
  if (!response.data.success) {
    throw new Error('Failed to search cryptos');
  }
  return response.data.results;
};

/**
 * Convert cryptocurrency amount to fiat currencies
 */
export const convertCryptoToFiat = async (
  request: CryptoConversionRequest
): Promise<CryptoConversionResponse> => {
  const response = await axios.post<CryptoConversionResponse>(
    `${API_URL}/crypto/convert`,
    request
  );
  if (!response.data.success) {
    throw new Error('Failed to convert crypto to fiat');
  }
  return response.data;
};
