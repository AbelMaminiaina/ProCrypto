import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">ProCrypto</h3>
            <p className="text-sm text-gray-400">
              Votre plateforme d'information financière pour Madagascar.
              Calculateurs, comparateurs et outils gratuits.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Convertisseur de devises
                </Link>
              </li>
              <li>
                <Link to="/salary" className="hover:text-white transition-colors">
                  Calculateur de salaire
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-white transition-colors">
                  Transport maritime
                </Link>
              </li>
              <li>
                <Link to="/bank-rates" className="hover:text-white transition-colors">
                  Comparateur de crédits
                </Link>
              </li>
              <li>
                <Link to="/crypto" className="hover:text-white transition-colors">
                  Portfolio Crypto
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Informations légales</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/legal" className="hover:text-white transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link to="/legal#rgpd" className="hover:text-white transition-colors">
                  Protection des données
                </Link>
              </li>
              <li>
                <Link to="/legal#cookies" className="hover:text-white transition-colors">
                  Politique de cookies
                </Link>
              </li>
              <li>
                <Link to="/legal#contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h4 className="text-white font-semibold mb-4">Avertissement</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Les informations fournies sont indicatives uniquement et ne constituent
              pas un conseil financier. Consultez toujours un professionnel avant toute
              décision financière importante.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © {currentYear} ProCrypto. Tous droits réservés.
            </div>

            {/* Important Legal Notice */}
            <div className="text-xs text-gray-500 text-center md:text-right max-w-2xl">
              ⚠️ Ce site n'est pas un courtier en crédit. Les taux affichés sont indicatifs.
              Les cryptomonnaies sont des actifs à haut risque. Vous pouvez perdre votre capital.
            </div>
          </div>
        </div>

        {/* Additional Legal Line */}
        <div className="mt-4 pt-4 border-t border-gray-800">
          <p className="text-xs text-gray-500 text-center">
            Fait avec ❤️ à Madagascar |
            <Link to="/legal" className="ml-1 hover:text-white transition-colors underline">
              Voir les mentions légales complètes
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
