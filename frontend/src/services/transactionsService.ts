import axios from 'axios';
import { getAuthHeader } from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface Transaction {
  id: string;
  cryptoId: string;
  symbol: string;
  name: string;
  type: 'buy' | 'sell';
  quantity: number;
  pricePerUnit: number;
  totalAmount: number;
  date: string;
  notes?: string;
  createdAt: string;
}

export interface AddTransactionRequest {
  cryptoId: string;
  symbol: string;
  name: string;
  type: 'buy' | 'sell';
  quantity: number;
  pricePerUnit: number;
  date: string;
  notes?: string;
}

/**
 * Get user's transactions
 */
export const getTransactions = async (): Promise<Transaction[]> => {
  const response = await axios.get(`${API_URL}/transactions`, {
    headers: getAuthHeader(),
  });
  return response.data.transactions;
};

/**
 * Add a transaction
 */
export const addTransaction = async (data: AddTransactionRequest): Promise<{ success: boolean; transaction_id: number }> => {
  const response = await axios.post(`${API_URL}/transactions`, data, {
    headers: getAuthHeader(),
  });
  return response.data;
};

/**
 * Delete a transaction
 */
export const deleteTransaction = async (transactionId: string): Promise<{ success: boolean }> => {
  const response = await axios.delete(`${API_URL}/transactions/${transactionId}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

/**
 * Clear all transactions
 */
export const clearTransactions = async (): Promise<{ success: boolean }> => {
  const response = await axios.delete(`${API_URL}/transactions/clear`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

/**
 * Get transactions for a specific crypto
 */
export const getTransactionsByCrypto = async (cryptoId: string): Promise<Transaction[]> => {
  const response = await axios.get(`${API_URL}/transactions/crypto/${cryptoId}`, {
    headers: getAuthHeader(),
  });
  return response.data.transactions;
};
