import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { usePageTracking } from './hooks/usePageTracking';

// Lazy load pages for better performance
const CurrencyConverterPage = lazy(() => import('./pages/CurrencyConverterPage'));
const CryptoPortfolioPage = lazy(() => import('./pages/CryptoPortfolioPage'));
const CryptoDetailPage = lazy(() => import('./pages/CryptoDetailPage'));
const TransactionHistoryPage = lazy(() => import('./pages/TransactionHistoryPage'));
const PriceAlertsPage = lazy(() => import('./pages/PriceAlertsPage'));
const SalaryCalculatorPage = lazy(() => import('./pages/SalaryCalculatorPage'));
const ShippingCalculatorPage = lazy(() => import('./pages/ShippingCalculatorPage'));
const BankRatesPage = lazy(() => import('./pages/BankRatesPage'));
const LegalNoticePage = lazy(() => import('./pages/LegalNoticePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const AnalyticsDashboardPage = lazy(() => import('./pages/AnalyticsDashboardPage'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      <p className="text-white mt-4 text-xl">Chargement...</p>
    </div>
  </div>
);

// Component to enable tracking inside Router
function AppWithTracking() {
  usePageTracking();

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
            {/* Public Routes with Layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<CurrencyConverterPage />} />
              <Route path="salary" element={<SalaryCalculatorPage />} />
              <Route path="shipping" element={<ShippingCalculatorPage />} />
              <Route path="bank-rates" element={<BankRatesPage />} />
              <Route path="legal" element={<LegalNoticePage />} />
            </Route>

            {/* Auth Routes (no layout) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Analytics Route (no layout - has own design) */}
            <Route path="/analytics" element={<AnalyticsDashboardPage />} />

            {/* Crypto Routes with Layout */}
            <Route path="/" element={<Layout />}>
              {/* Public access with limited features (freemium) */}
              <Route path="crypto" element={<CryptoPortfolioPage />} />
              <Route path="crypto/:cryptoId" element={<CryptoDetailPage />} />

              {/* Protected Routes */}
              <Route
                path="crypto/transactions"
                element={
                  <ProtectedRoute>
                    <TransactionHistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="crypto/alerts"
                element={
                  <ProtectedRoute>
                    <PriceAlertsPage />
                  </ProtectedRoute>
                }
              />
            </Route>
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppWithTracking />
      </Router>
    </AuthProvider>
  );
}

export default App;
