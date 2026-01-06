import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              ProCrypto
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <span className="inline-block mr-2">💱</span>
              Currency Converter
            </NavLink>

            <NavLink
              to="/crypto"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <span className="inline-block mr-2">₿</span>
              Crypto Portfolio
              {!isAuthenticated && (
                <span className="ml-1 text-xs opacity-70">(Aperçu)</span>
              )}
            </NavLink>

            <NavLink
              to="/salary"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <span className="inline-block mr-2">💰</span>
              Calculateur Salaire
            </NavLink>

            <NavLink
              to="/shipping"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <span className="inline-block mr-2">🚢</span>
              Transport Maritime
            </NavLink>

            <NavLink
              to="/bank-rates"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <span className="inline-block mr-2">🏦</span>
              Taux Crédit
            </NavLink>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition-all"
                >
                  <span className="inline-block">👤</span>
                  <span>{user?.email}</span>
                  <span className="text-xs">▼</span>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-xs text-gray-500">Connecté en tant que</p>
                      <p className="text-sm font-semibold text-gray-800 truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      🚪 Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-2">
                <NavLink
                  to="/login"
                  className="px-4 py-2 rounded-lg font-semibold text-primary border-2 border-primary hover:bg-primary hover:text-white transition-all"
                >
                  🔓 Connexion
                </NavLink>
                <NavLink
                  to="/register"
                  className="px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-primary to-primary-dark text-white shadow-md hover:shadow-lg transition-all"
                >
                  ✨ Inscription
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
