import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../services/analyticsService';

// Map of routes to page titles
const PAGE_TITLES: Record<string, string> = {
  '/': 'Convertisseur de Devises',
  '/crypto': 'Portfolio Crypto',
  '/salary': 'Calculateur de Salaire',
  '/shipping': 'Transport Maritime',
  '/bank-rates': 'Taux de Crédit',
  '/login': 'Connexion',
  '/register': 'Inscription',
  '/crypto/transactions': 'Historique Transactions',
  '/crypto/alerts': 'Alertes de Prix',
  '/legal': 'Mentions Légales',
  '/analytics': 'Analytics Admin',
};

/**
 * Custom hook to automatically track page views
 * Add this hook to your main App component
 */
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const pagePath = location.pathname;

    // Get page title from mapping or use document.title
    const pageTitle = PAGE_TITLES[pagePath] || document.title;

    // Track the page view
    trackPageView(pagePath, pageTitle);
  }, [location]);
};
