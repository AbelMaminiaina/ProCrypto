import { NavLink } from 'react-router-dom';

function Navbar() {
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
          <div className="flex space-x-4">
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
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
