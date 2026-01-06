import axios from 'axios';
import { getAuthHeader } from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface PriceAlert {
  id: string;
  cryptoId: string;
  symbol: string;
  name: string;
  targetPrice: number;
  condition: 'above' | 'below';
  status: 'active' | 'triggered' | 'disabled';
  notified: boolean;
  createdAt: string;
  triggeredAt?: string;
}

export interface CreateAlertRequest {
  cryptoId: string;
  symbol: string;
  name: string;
  targetPrice: number;
  condition: 'above' | 'below';
}

export interface UpdateAlertRequest {
  targetPrice?: number;
  condition?: 'above' | 'below';
  status?: 'active' | 'triggered' | 'disabled';
  notified?: boolean;
  triggeredAt?: string;
}

/**
 * Get user's alerts
 */
export const getAlerts = async (): Promise<PriceAlert[]> => {
  const response = await axios.get(`${API_URL}/alerts`, {
    headers: getAuthHeader(),
  });
  return response.data.alerts;
};

/**
 * Get only active alerts
 */
export const getActiveAlerts = async (): Promise<PriceAlert[]> => {
  const response = await axios.get(`${API_URL}/alerts/active`, {
    headers: getAuthHeader(),
  });
  return response.data.alerts;
};

/**
 * Create a new alert
 */
export const createAlert = async (data: CreateAlertRequest): Promise<{ success: boolean; alert_id: number }> => {
  const response = await axios.post(`${API_URL}/alerts`, data, {
    headers: getAuthHeader(),
  });
  return response.data;
};

/**
 * Update an alert
 */
export const updateAlert = async (alertId: string, data: UpdateAlertRequest): Promise<{ success: boolean }> => {
  const response = await axios.put(`${API_URL}/alerts/${alertId}`, data, {
    headers: getAuthHeader(),
  });
  return response.data;
};

/**
 * Delete an alert
 */
export const deleteAlert = async (alertId: string): Promise<{ success: boolean }> => {
  const response = await axios.delete(`${API_URL}/alerts/${alertId}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

/**
 * Clear all alerts
 */
export const clearAlerts = async (): Promise<{ success: boolean }> => {
  const response = await axios.delete(`${API_URL}/alerts/clear`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

/**
 * Mark alert as triggered
 */
export const triggerAlert = async (alertId: string): Promise<{ success: boolean }> => {
  const response = await axios.post(`${API_URL}/alerts/${alertId}/trigger`, {}, {
    headers: getAuthHeader(),
  });
  return response.data;
};

/**
 * Toggle alert status (active/disabled)
 */
export const toggleAlert = async (alertId: string): Promise<{ success: boolean; status: string }> => {
  const response = await axios.post(`${API_URL}/alerts/${alertId}/toggle`, {}, {
    headers: getAuthHeader(),
  });
  return response.data;
};
