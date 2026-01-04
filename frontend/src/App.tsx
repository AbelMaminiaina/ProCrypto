import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import CurrencyConverterPage from './pages/CurrencyConverterPage';
import CryptoPortfolioPage from './pages/CryptoPortfolioPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<CurrencyConverterPage />} />
          <Route path="crypto" element={<CryptoPortfolioPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
