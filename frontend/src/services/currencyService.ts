import axios from 'axios';
import { ExchangeRates, ConversionResult, Currency } from '../types/currency';

// URL de l'API Python backend
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Get all supported currencies
 */
export async function getCurrencies(): Promise<Currency[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/currencies`);
    return response.data.currencies.map((curr: any) => {
      const [nameFr, nameEn] = curr.name.split(' / ');
      return {
        code: curr.code,
        name: nameFr || curr.name,
        nameEn: nameEn || nameFr || curr.name,
      };
    });
  } catch (error) {
    console.error('Error fetching currencies:', error);
    throw error;
  }
}

/**
 * Get all exchange rates
 */
export async function getExchangeRates(): Promise<{
  rates: ExchangeRates;
  lastUpdate: string | null;
}> {
  try {
    const response = await axios.get(`${API_BASE_URL}/rates`);
    return {
      rates: response.data.rates,
      lastUpdate: response.data.last_update,
    };
  } catch (error) {
    console.error('Error fetching rates:', error);
    throw error;
  }
}

/**
 * Refresh exchange rates from APIs
 */
export async function refreshRates(): Promise<void> {
  try {
    await axios.post(`${API_BASE_URL}/rates/refresh`);
  } catch (error) {
    console.error('Error refreshing rates:', error);
    throw error;
  }
}

/**
 * Convert currency
 */
export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<ConversionResult> {
  try {
    const response = await axios.post(`${API_BASE_URL}/convert`, {
      amount,
      from: fromCurrency,
      to: toCurrency,
    });

    return {
      amount: response.data.amount,
      fromCurrency: response.data.from,
      toCurrency: response.data.to,
      result: response.data.result,
      rate: response.data.rate,
      date: response.data.last_update,
    };
  } catch (error) {
    console.error('Error converting currency:', error);
    throw error;
  }
}

/**
 * Convert to all currencies
 */
export async function convertToAll(
  amount: number,
  fromCurrency: string
): Promise<{
  amount: number;
  from: string;
  conversions: Array<{
    currency: string;
    name: string;
    result: number;
    rate: number;
  }>;
  lastUpdate: string | null;
}> {
  try {
    const response = await axios.post(`${API_BASE_URL}/convert/all`, {
      amount,
      from: fromCurrency,
    });

    return response.data;
  } catch (error) {
    console.error('Error converting to all currencies:', error);
    throw error;
  }
}

/**
 * Check API health
 */
export async function checkApiHealth(): Promise<{
  status: string;
  currenciesCount: number;
  ratesLoaded: boolean;
  lastUpdate: string | null;
}> {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return {
      status: response.data.status,
      currenciesCount: response.data.currencies_count,
      ratesLoaded: response.data.rates_loaded,
      lastUpdate: response.data.last_update,
    };
  } catch (error) {
    console.error('Error checking API health:', error);
    throw error;
  }
}
