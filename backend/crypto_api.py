"""
Crypto API endpoints for portfolio tracking
Integrates with CoinGecko API for real-time cryptocurrency prices
"""
from flask import Blueprint, jsonify, request
import requests
from datetime import datetime, timedelta
from typing import List, Dict, Any
from db_manager import CryptoDatabase

crypto_bp = Blueprint('crypto', __name__)

# CoinGecko API configuration
COINGECKO_API = 'https://api.coingecko.com/api/v3'
CACHE_DURATION_SECONDS = 60
RATE_LIMIT_CALLS_PER_MINUTE = 45

# Initialize database
db = CryptoDatabase()

# Simple rate limiter (in-memory)
class RateLimiter:
    def __init__(self, max_calls=RATE_LIMIT_CALLS_PER_MINUTE, window_seconds=60):
        self.max_calls = max_calls
        self.window_seconds = window_seconds
        self.calls = []

    def can_make_call(self):
        """Check if we can make an API call"""
        now = datetime.now()
        cutoff = now - timedelta(seconds=self.window_seconds)

        # Remove old calls
        self.calls = [call_time for call_time in self.calls if call_time > cutoff]

        # Check if under limit
        if len(self.calls) < self.max_calls:
            self.calls.append(now)
            return True
        return False

    def wait_time(self):
        """Get seconds to wait before next call"""
        if len(self.calls) == 0:
            return 0

        oldest_call = min(self.calls)
        elapsed = (datetime.now() - oldest_call).total_seconds()
        return max(0, self.window_seconds - elapsed)


rate_limiter = RateLimiter()


def get_eur_to_mga_rate():
    """Get EUR to MGA exchange rate from existing currency API"""
    # Import from existing api.py
    try:
        from api import EXCHANGE_RATES
        if 'EUR' in EXCHANGE_RATES and 'MGA' in EXCHANGE_RATES['EUR']:
            return EXCHANGE_RATES['EUR']['MGA']
    except:
        pass

    # Fallback default rate
    return 5070.0


@crypto_bp.route('/api/crypto/list', methods=['GET'])
def get_supported_cryptos():
    """Get list of supported cryptocurrencies"""
    try:
        cryptos = db.get_supported_cryptos()
        return jsonify({
            'success': True,
            'count': len(cryptos),
            'cryptos': cryptos
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@crypto_bp.route('/api/crypto/prices', methods=['GET'])
def get_all_crypto_prices():
    """Get all cached crypto prices"""
    try:
        # Try to get from cache first
        cached_prices = db.get_all_cached_prices(max_age_seconds=CACHE_DURATION_SECONDS)

        if cached_prices:
            return jsonify({
                'success': True,
                'count': len(cached_prices),
                'prices': cached_prices,
                'cached': True,
                'cache_age': CACHE_DURATION_SECONDS
            }), 200

        # If no cache, fetch from CoinGecko
        return refresh_all_prices()

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@crypto_bp.route('/api/crypto/prices/<crypto_id>', methods=['GET'])
def get_crypto_price(crypto_id: str):
    """Get specific crypto price from cache or CoinGecko"""
    try:
        # Try cache first
        cached_price = db.get_cached_price(crypto_id, max_age_seconds=CACHE_DURATION_SECONDS)

        if cached_price:
            return jsonify({
                'success': True,
                'price': cached_price,
                'cached': True
            }), 200

        # Fetch from CoinGecko
        if not rate_limiter.can_make_call():
            wait_time = rate_limiter.wait_time()
            return jsonify({
                'success': False,
                'error': f'Rate limit exceeded. Please wait {int(wait_time)} seconds.'
            }), 429

        # Call CoinGecko API
        response = requests.get(
            f'{COINGECKO_API}/simple/price',
            params={
                'ids': crypto_id,
                'vs_currencies': 'usd,eur',
                'include_24hr_change': 'true',
                'include_market_cap': 'true',
                'include_24h_vol': 'true'
            },
            timeout=5
        )
        response.raise_for_status()
        data = response.json()

        if crypto_id not in data:
            return jsonify({
                'success': False,
                'error': f'Cryptocurrency {crypto_id} not found'
            }), 404

        # Get crypto info
        crypto_info = db.get_supported_cryptos()
        crypto_data = next((c for c in crypto_info if c['id'] == crypto_id), None)

        if not crypto_data:
            return jsonify({
                'success': False,
                'error': f'Cryptocurrency {crypto_id} not supported'
            }), 404

        # Calculate MGA price
        eur_to_mga = get_eur_to_mga_rate()
        price_mga = data[crypto_id].get('eur', 0) * eur_to_mga

        # Prepare price data
        price_data = {
            'id': crypto_id,
            'symbol': crypto_data['symbol'],
            'name': crypto_data['name'],
            'current_price_usd': data[crypto_id].get('usd', 0),
            'price_eur': data[crypto_id].get('eur', 0),
            'price_mga': price_mga,
            'price_change_24h': data[crypto_id].get('usd_24h_change', 0),
            'market_cap_usd': data[crypto_id].get('usd_market_cap', 0),
            'volume_24h_usd': data[crypto_id].get('usd_24h_vol', 0)
        }

        # Update cache
        db.update_price(crypto_id, price_data)

        price_data['last_updated'] = datetime.now().isoformat()

        return jsonify({
            'success': True,
            'price': price_data,
            'cached': False
        }), 200

    except requests.exceptions.RequestException as e:
        return jsonify({
            'success': False,
            'error': f'CoinGecko API error: {str(e)}'
        }), 503
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@crypto_bp.route('/api/crypto/prices/refresh', methods=['POST'])
def refresh_all_prices():
    """Force refresh all crypto prices from CoinGecko"""
    try:
        # Check rate limit
        if not rate_limiter.can_make_call():
            wait_time = rate_limiter.wait_time()
            return jsonify({
                'success': False,
                'error': f'Rate limit exceeded. Please wait {int(wait_time)} seconds.'
            }), 429

        # Get list of supported cryptos
        cryptos = db.get_supported_cryptos()
        crypto_ids = [c['id'] for c in cryptos]

        # CoinGecko allows up to 250 IDs per request
        ids_param = ','.join(crypto_ids)

        # Call CoinGecko API
        response = requests.get(
            f'{COINGECKO_API}/simple/price',
            params={
                'ids': ids_param,
                'vs_currencies': 'usd,eur',
                'include_24hr_change': 'true',
                'include_market_cap': 'true',
                'include_24h_vol': 'true'
            },
            timeout=10
        )
        response.raise_for_status()
        data = response.json()

        # Get EUR to MGA rate
        eur_to_mga = get_eur_to_mga_rate()

        # Prepare bulk update data
        prices_data = []
        crypto_map = {c['id']: c for c in cryptos}

        for crypto_id, price_info in data.items():
            if crypto_id in crypto_map:
                crypto_data = crypto_map[crypto_id]
                price_mga = price_info.get('eur', 0) * eur_to_mga

                prices_data.append({
                    'id': crypto_id,
                    'symbol': crypto_data['symbol'],
                    'name': crypto_data['name'],
                    'current_price_usd': price_info.get('usd', 0),
                    'price_eur': price_info.get('eur', 0),
                    'price_mga': price_mga,
                    'price_change_24h': price_info.get('usd_24h_change', 0),
                    'market_cap_usd': price_info.get('usd_market_cap', 0),
                    'volume_24h_usd': price_info.get('usd_24h_vol', 0)
                })

        # Bulk update cache
        if prices_data:
            db.bulk_update_prices(prices_data)

        return jsonify({
            'success': True,
            'count': len(prices_data),
            'prices': prices_data,
            'cached': False,
            'timestamp': datetime.now().isoformat()
        }), 200

    except requests.exceptions.RequestException as e:
        # Return cached data on API failure
        cached_prices = db.get_all_cached_prices(max_age_seconds=3600)  # 1 hour old cache

        return jsonify({
            'success': True,
            'count': len(cached_prices),
            'prices': cached_prices,
            'cached': True,
            'warning': f'Using cached data due to API error: {str(e)}'
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@crypto_bp.route('/api/crypto/search', methods=['GET'])
def search_cryptos():
    """Search cryptocurrencies by name or symbol"""
    query = request.args.get('q', '').lower()

    if not query:
        return jsonify({
            'success': False,
            'error': 'Query parameter "q" is required'
        }), 400

    try:
        cryptos = db.get_supported_cryptos()

        # Filter cryptos by name or symbol
        results = [
            c for c in cryptos
            if query in c['name'].lower() or query in c['symbol'].lower()
        ]

        return jsonify({
            'success': True,
            'count': len(results),
            'results': results
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@crypto_bp.route('/api/crypto/convert', methods=['POST'])
def convert_crypto_to_fiat():
    """
    Convert crypto amount to fiat currencies
    Body: { "cryptoId": "bitcoin", "amount": 1.5, "currencies": ["USD", "EUR", "MGA"] }
    """
    try:
        data = request.get_json()

        crypto_id = data.get('cryptoId')
        amount = data.get('amount', 1)
        currencies = data.get('currencies', ['USD', 'EUR', 'MGA'])

        if not crypto_id:
            return jsonify({
                'success': False,
                'error': 'cryptoId is required'
            }), 400

        # Get crypto price
        cached_price = db.get_cached_price(crypto_id, max_age_seconds=CACHE_DURATION_SECONDS)

        if not cached_price:
            # Fetch fresh price
            price_response = get_crypto_price(crypto_id)
            if price_response[1] != 200:
                return price_response

            cached_price = price_response[0].get_json()['price']

        # Calculate conversions
        conversions = {}

        if 'USD' in currencies:
            conversions['USD'] = cached_price['current_price_usd'] * amount

        if 'EUR' in currencies:
            conversions['EUR'] = cached_price['price_eur'] * amount

        if 'MGA' in currencies:
            conversions['MGA'] = cached_price['price_mga'] * amount

        return jsonify({
            'success': True,
            'cryptoId': crypto_id,
            'symbol': cached_price['symbol'],
            'amount': amount,
            'conversions': conversions,
            'timestamp': datetime.now().isoformat()
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
