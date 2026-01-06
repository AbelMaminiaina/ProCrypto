import axios from 'axios';
import { getAuthHeader } from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface PortfolioHolding {
  id: string;
  cryptoId: string;
  symbol: string;
  name: string;
  quantity: number;
  averagePurchasePrice: number;
  totalInvested: number;
  addedAt: string;
}

export interface AddHoldingRequest {
  cryptoId: string;
  symbol: string;
  name: string;
  quantity: number;
  purchasePrice: number;
}

export interface UpdateHoldingRequest {
  quantity?: number;
  purchasePrice?: number;
}

/**
 * Get user's portfolio
 */
export const getPortfolio = async (): Promise<PortfolioHolding[]> => {
  const response = await axios.get(`${API_URL}/portfolio`, {
    headers: getAuthHeader(),
  });
  return response.data.portfolio;
};

/**
 * Add crypto to portfolio
 */
export const addToPortfolio = async (data: AddHoldingRequest): Promise<{ success: boolean; holding_id: number }> => {
  const response = await axios.post(`${API_URL}/portfolio`, data, {
    headers: getAuthHeader(),
  });
  return response.data;
};

/**
 * Update portfolio holding
 */
export const updateHolding = async (holdingId: string, data: UpdateHoldingRequest): Promise<{ success: boolean }> => {
  const response = await axios.put(`${API_URL}/portfolio/${holdingId}`, data, {
    headers: getAuthHeader(),
  });
  return response.data;
};

/**
 * Delete portfolio holding
 */
export const deleteHolding = async (holdingId: string): Promise<{ success: boolean }> => {
  const response = await axios.delete(`${API_URL}/portfolio/${holdingId}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

/**
 * Clear entire portfolio
 */
export const clearPortfolio = async (): Promise<{ success: boolean }> => {
  const response = await axios.delete(`${API_URL}/portfolio/clear`, {
    headers: getAuthHeader(),
  });
  return response.data;
};
