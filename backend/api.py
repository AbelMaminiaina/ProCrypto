"""
API Flask pour le convertisseur de devises
Flask API for currency converter
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import datetime, timedelta
import requests
import os
from typing import Dict, Any

# Import blueprints
from crypto_api import crypto_bp
from db_manager import CryptoDatabase
from auth_api import auth_bp
from portfolio_api import portfolio_bp
from transactions_api import transactions_bp
from alerts_api import alerts_bp
from analytics_api import analytics_bp
from auth_manager import AuthManager

app = Flask(__name__)

# JWT Configuration
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'procrypto-secret-key-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)

# Initialize JWT
jwt = JWTManager(app)

# Initialize databases
crypto_db = CryptoDatabase()
auth_manager = AuthManager()

# Configuration CORS pour autoriser le frontend Vercel et localhost
cors_origins = [
    "https://procrypto.vercel.app",  # Production Vercel
    "http://localhost:3000",          # Dev local (Vite)
    "http://localhost:3001",          # Dev local (Vite port alternatif)
    "http://localhost:3002",          # Dev local (Vite port alternatif)
    "http://localhost:5173",          # Dev local (Vite alternative)
    "http://localhost:5000",          # Dev local
]

# Ajouter d'autres origines depuis variable d'environnement si nécessaire
if os.getenv('ALLOWED_ORIGINS'):
    additional_origins = os.getenv('ALLOWED_ORIGINS').split(',')
    cors_origins.extend(additional_origins)

# Configuration CORS avec headers personnalisés pour analytics
CORS(app,
     origins=cors_origins,
     supports_credentials=True,
     allow_headers=['Content-Type', 'Authorization', 'X-Admin-Key'],
     expose_headers=['Content-Type', 'Authorization'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])

# Register all blueprints
app.register_blueprint(crypto_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(portfolio_bp)
app.register_blueprint(transactions_bp)
app.register_blueprint(alerts_bp)
app.register_blueprint(analytics_bp)

# Import des devises et fonctions du convertisseur
CURRENCIES = {
    'USD': 'Dollar américain / US Dollar',
    'EUR': 'Euro',
    'GBP': 'Livre sterling / British Pound',
    'JPY': 'Yen japonais / Japanese Yen',
    'CNY': 'Yuan chinois / Chinese Yuan',
    'CAD': 'Dollar canadien / Canadian Dollar',
    'AUD': 'Dollar australien / Australian Dollar',
    'INR': 'Roupie indienne / Indian Rupee',
    'AED': 'Dirham des Émirats / UAE Dirham',
    'SAR': 'Riyal saoudien / Saudi Riyal',
    'MGA': 'Ariary malgache / Malagasy Ariary'
}

DEFAULT_RATES_BASE_EUR = {
    'USD': 1.09, 'GBP': 0.85, 'JPY': 160.0, 'CNY': 7.85,
    'CAD': 1.48, 'AUD': 1.65, 'INR': 89.5, 'AED': 4.00,
    'SAR': 4.08, 'MGA': 5070.0, 'EUR': 1.0
}

# Cache global
EXCHANGE_RATES = {}
last_update = None

def build_exchange_matrix(base_rates: Dict[str, float]) -> Dict[str, Dict[str, float]]:
    """
    Construit une matrice complète de taux de change
    Build complete exchange rate matrix
    """
    matrix = {}

    for from_curr in CURRENCIES.keys():
        matrix[from_curr] = {}
        for to_curr in CURRENCIES.keys():
            if from_curr == to_curr:
                matrix[from_curr][to_curr] = 1.0
            else:
                from_to_eur = 1.0 / base_rates.get(from_curr, 1.0)
                eur_to_to = base_rates.get(to_curr, 1.0)
                matrix[from_curr][to_curr] = from_to_eur * eur_to_to

    return matrix

def fetch_live_rates() -> Dict[str, Any]:
    """
    Récupère les taux de change en temps réel
    Fetch live exchange rates
    """
    global EXCHANGE_RATES, last_update

    try:
        base_rates = {'EUR': 1.0}

        # API Frankfurter
        try:
            response_eur = requests.get('https://api.frankfurter.app/latest?from=EUR', timeout=5)
            response_eur.raise_for_status()
            data_eur = response_eur.json()

            for currency in ['USD', 'GBP', 'JPY', 'CNY', 'CAD', 'AUD', 'INR', 'AED', 'SAR']:
                if currency in data_eur['rates']:
                    base_rates[currency] = data_eur['rates'][currency]
                else:
                    base_rates[currency] = DEFAULT_RATES_BASE_EUR.get(currency, 1.0)

        except Exception as e:
            print(f"Frankfurter API error: {e}")
            for currency in ['USD', 'GBP', 'JPY', 'CNY', 'CAD', 'AUD', 'INR', 'AED', 'SAR']:
                base_rates[currency] = DEFAULT_RATES_BASE_EUR.get(currency, 1.0)

        # API Currency pour MGA, AED, SAR
        try:
            response_currency_api = requests.get(
                'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json',
                timeout=5
            )
            response_currency_api.raise_for_status()
            data_currency_api = response_currency_api.json()

            if 'mga' in data_currency_api.get('eur', {}):
                base_rates['MGA'] = data_currency_api['eur']['mga']

            if 'aed' in data_currency_api.get('eur', {}):
                base_rates['AED'] = data_currency_api['eur']['aed']

            if 'sar' in data_currency_api.get('eur', {}):
                base_rates['SAR'] = data_currency_api['eur']['sar']

        except Exception as e:
            print(f"Currency API error: {e}")
            base_rates['MGA'] = DEFAULT_RATES_BASE_EUR.get('MGA', 5070.0)
            if 'AED' not in base_rates:
                base_rates['AED'] = DEFAULT_RATES_BASE_EUR.get('AED', 4.00)
            if 'SAR' not in base_rates:
                base_rates['SAR'] = DEFAULT_RATES_BASE_EUR.get('SAR', 4.08)

        EXCHANGE_RATES = build_exchange_matrix(base_rates)
        last_update = datetime.now()

        return {
            'success': True,
            'rates': EXCHANGE_RATES,
            'last_update': last_update.isoformat(),
            'base_rates': base_rates
        }

    except Exception as e:
        print(f"Error fetching rates: {e}")
        EXCHANGE_RATES = build_exchange_matrix(DEFAULT_RATES_BASE_EUR)
        return {
            'success': False,
            'rates': EXCHANGE_RATES,
            'error': str(e)
        }

# Initialiser les taux au démarrage
fetch_live_rates()

@app.route('/api/currencies', methods=['GET'])
def get_currencies():
    """Retourne la liste des devises supportées"""
    return jsonify({
        'currencies': [
            {'code': code, 'name': name}
            for code, name in CURRENCIES.items()
        ]
    })

@app.route('/api/rates', methods=['GET'])
def get_rates():
    """Retourne tous les taux de change"""
    return jsonify({
        'rates': EXCHANGE_RATES,
        'last_update': last_update.isoformat() if last_update else None
    })

@app.route('/api/rates/refresh', methods=['POST'])
def refresh_rates():
    """Force le rafraîchissement des taux"""
    result = fetch_live_rates()
    return jsonify(result)

@app.route('/api/convert', methods=['POST'])
def convert():
    """
    Convertit un montant d'une devise à une autre
    Body JSON: {
        "amount": 100,
        "from": "USD",
        "to": "EUR"
    }
    """
    data = request.get_json()

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    amount = data.get('amount')
    from_currency = data.get('from')
    to_currency = data.get('to')

    if not all([amount, from_currency, to_currency]):
        return jsonify({'error': 'Missing required fields: amount, from, to'}), 400

    try:
        amount = float(amount)
    except ValueError:
        return jsonify({'error': 'Invalid amount'}), 400

    if from_currency not in CURRENCIES or to_currency not in CURRENCIES:
        return jsonify({'error': 'Invalid currency code'}), 400

    if not EXCHANGE_RATES:
        fetch_live_rates()

    if from_currency not in EXCHANGE_RATES or to_currency not in EXCHANGE_RATES[from_currency]:
        return jsonify({'error': 'Exchange rate not available'}), 500

    rate = EXCHANGE_RATES[from_currency][to_currency]
    result = amount * rate

    return jsonify({
        'amount': amount,
        'from': from_currency,
        'to': to_currency,
        'result': result,
        'rate': rate,
        'last_update': last_update.isoformat() if last_update else None
    })

@app.route('/api/convert/all', methods=['POST'])
def convert_all():
    """
    Convertit un montant vers toutes les devises
    Body JSON: {
        "amount": 100,
        "from": "USD"
    }
    """
    data = request.get_json()

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    amount = data.get('amount')
    from_currency = data.get('from')

    if not all([amount, from_currency]):
        return jsonify({'error': 'Missing required fields: amount, from'}), 400

    try:
        amount = float(amount)
    except ValueError:
        return jsonify({'error': 'Invalid amount'}), 400

    if from_currency not in CURRENCIES:
        return jsonify({'error': 'Invalid currency code'}), 400

    if not EXCHANGE_RATES:
        fetch_live_rates()

    conversions = []
    for to_currency in CURRENCIES.keys():
        if to_currency != from_currency:
            rate = EXCHANGE_RATES[from_currency][to_currency]
            result = amount * rate
            conversions.append({
                'currency': to_currency,
                'name': CURRENCIES[to_currency],
                'result': result,
                'rate': rate
            })

    return jsonify({
        'amount': amount,
        'from': from_currency,
        'conversions': conversions,
        'last_update': last_update.isoformat() if last_update else None
    })

@app.route('/api/health', methods=['GET'])
def health():
    """Endpoint de santé de l'API"""
    return jsonify({
        'status': 'healthy',
        'currencies_count': len(CURRENCIES),
        'rates_loaded': len(EXCHANGE_RATES) > 0,
        'last_update': last_update.isoformat() if last_update else None
    })

if __name__ == '__main__':
    print("=" * 70)
    print("🚀 ProCrypto API - Currency Converter & Crypto Tracker")
    print("=" * 70)
    print(f"Devises supportées: {len(CURRENCIES)}")
    print(f"Cryptomonnaies supportées: {len(crypto_db.get_supported_cryptos())}")
    print("\nEndpoints disponibles:")
    print("\n  CURRENCY CONVERTER (Public):")
    print("  GET  /api/currencies         - Liste des devises")
    print("  GET  /api/rates              - Tous les taux de change")
    print("  POST /api/rates/refresh      - Rafraîchir les taux")
    print("  POST /api/convert            - Convertir un montant")
    print("  POST /api/convert/all        - Convertir vers toutes les devises")
    print("  GET  /api/health             - État de l'API")
    print("\n  CRYPTO TRACKER (Public):")
    print("  GET  /api/crypto/list        - Liste des cryptos supportées")
    print("  GET  /api/crypto/prices      - Tous les prix crypto")
    print("  GET  /api/crypto/prices/<id> - Prix d'une crypto spécifique")
    print("  POST /api/crypto/prices/refresh - Rafraîchir tous les prix")
    print("  GET  /api/crypto/search      - Rechercher des cryptos")
    print("  POST /api/crypto/convert     - Convertir crypto vers fiat")
    print("\n  AUTHENTICATION:")
    print("  POST /api/auth/register      - Créer un compte")
    print("  POST /api/auth/login         - Se connecter")
    print("  POST /api/auth/refresh       - Rafraîchir le token")
    print("  GET  /api/auth/verify        - Vérifier le token (protégé)")
    print("  GET  /api/auth/me            - Info utilisateur (protégé)")
    print("  POST /api/auth/logout        - Se déconnecter (protégé)")
    print("  PUT  /api/auth/change-password - Changer mot de passe (protégé)")
    print("\n  PORTFOLIO (Protégé - JWT requis):")
    print("  GET    /api/portfolio        - Lire portfolio")
    print("  POST   /api/portfolio        - Ajouter crypto")
    print("  PUT    /api/portfolio/<id>   - Modifier holding")
    print("  DELETE /api/portfolio/<id>   - Supprimer holding")
    print("  DELETE /api/portfolio/clear  - Vider portfolio")
    print("\n  TRANSACTIONS (Protégé - JWT requis):")
    print("  GET    /api/transactions     - Lire transactions")
    print("  POST   /api/transactions     - Ajouter transaction")
    print("  DELETE /api/transactions/<id> - Supprimer transaction")
    print("  DELETE /api/transactions/clear - Vider transactions")
    print("  GET    /api/transactions/crypto/<id> - Transactions par crypto")
    print("\n  ALERTS (Protégé - JWT requis):")
    print("  GET    /api/alerts           - Lire alertes")
    print("  POST   /api/alerts           - Créer alerte")
    print("  PUT    /api/alerts/<id>      - Modifier alerte")
    print("  DELETE /api/alerts/<id>      - Supprimer alerte")
    print("  DELETE /api/alerts/clear     - Vider alertes")
    print("  POST   /api/alerts/<id>/trigger - Marquer comme déclenchée")
    print("  POST   /api/alerts/<id>/toggle - Activer/désactiver")
    print("  GET    /api/alerts/active    - Alertes actives uniquement")
    print("\n  ANALYTICS (Tracking Public, Stats Protégées):")
    print("  POST /api/analytics/track         - Tracker page view (public)")
    print("  GET  /api/analytics/stats         - Statistiques globales (admin)")
    print("  GET  /api/analytics/popular-pages - Pages populaires (admin)")
    print("  GET  /api/analytics/daily-stats   - Stats par jour (admin)")
    print("  GET  /api/analytics/recent-activity - Activité récente (admin)")
    print("=" * 70)
    print("\n🌐 Serveur démarré sur http://localhost:5000")
    print("   React frontend peut se connecter à cette API\n")

    app.run(debug=True, host='0.0.0.0', port=5000)
