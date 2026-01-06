export type AlertCondition = 'above' | 'below';
export type AlertStatus = 'active' | 'triggered' | 'disabled';

export interface PriceAlert {
  id: string;
  cryptoId: string;
  symbol: string;
  name: string;
  targetPrice: number;
  condition: AlertCondition;
  status: AlertStatus;
  createdAt: string;
  triggeredAt?: string;
  notified: boolean;
}

export interface CreateAlertInput {
  cryptoId: string;
  symbol: string;
  name: string;
  targetPrice: number;
  condition: AlertCondition;
}

export interface AlertSummary {
  totalAlerts: number;
  activeAlerts: number;
  triggeredAlerts: number;
  disabledAlerts: number;
}
