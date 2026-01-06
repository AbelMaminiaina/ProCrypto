"""
SQLite database manager for crypto price caching
"""
import sqlite3
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
import os


class CryptoDatabase:
    def __init__(self, db_path='crypto_data.db'):
        self.db_path = db_path
        self.init_db()

    def get_connection(self):
        """Get database connection"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def init_db(self):
        """Initialize database tables"""
        conn = self.get_connection()
        cursor = conn.cursor()

        # Create crypto_prices table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS crypto_prices (
                id TEXT PRIMARY KEY,
                symbol TEXT NOT NULL,
                name TEXT NOT NULL,
                current_price_usd REAL NOT NULL,
                price_eur REAL NOT NULL,
                price_mga REAL NOT NULL,
                price_change_24h REAL,
                market_cap_usd REAL,
                volume_24h_usd REAL,
                last_updated TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # Create supported_cryptos table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS supported_cryptos (
                id TEXT PRIMARY KEY,
                symbol TEXT NOT NULL,
                name TEXT NOT NULL,
                image_url TEXT,
                is_active BOOLEAN DEFAULT 1,
                sort_order INTEGER DEFAULT 0
            )
        ''')

        # Create indexes
        cursor.execute('''
            CREATE INDEX IF NOT EXISTS idx_crypto_symbol
            ON crypto_prices(symbol)
        ''')

        cursor.execute('''
            CREATE INDEX IF NOT EXISTS idx_crypto_last_updated
            ON crypto_prices(last_updated)
        ''')

        # Table for caching crypto details (5 minute cache)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS crypto_details_cache (
                crypto_id TEXT PRIMARY KEY,
                details_json TEXT NOT NULL,
                cached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        cursor.execute('''
            CREATE INDEX IF NOT EXISTS idx_details_cached_at
            ON crypto_details_cache(cached_at)
        ''')

        # Table for caching crypto history (10 minute cache per period)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS crypto_history_cache (
                crypto_id TEXT NOT NULL,
                period TEXT NOT NULL,
                history_json TEXT NOT NULL,
                cached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (crypto_id, period)
            )
        ''')

        cursor.execute('''
            CREATE INDEX IF NOT EXISTS idx_history_cached_at
            ON crypto_history_cache(cached_at)
        ''')

        # Insert supported cryptos (Top 50)
        supported_cryptos = [
            # Top 10
            ('bitcoin', 'BTC', 'Bitcoin', 1),
            ('ethereum', 'ETH', 'Ethereum', 2),
            ('tether', 'USDT', 'Tether', 3),
            ('binancecoin', 'BNB', 'BNB', 4),
            ('solana', 'SOL', 'Solana', 5),
            ('ripple', 'XRP', 'XRP', 6),
            ('usd-coin', 'USDC', 'USD Coin', 7),
            ('cardano', 'ADA', 'Cardano', 8),
            ('dogecoin', 'DOGE', 'Dogecoin', 9),
            ('tron', 'TRX', 'TRON', 10),

            # 11-20
            ('avalanche-2', 'AVAX', 'Avalanche', 11),
            ('shiba-inu', 'SHIB', 'Shiba Inu', 12),
            ('polkadot', 'DOT', 'Polkadot', 13),
            ('chainlink', 'LINK', 'Chainlink', 14),
            ('matic-network', 'MATIC', 'Polygon', 15),
            ('wrapped-bitcoin', 'WBTC', 'Wrapped Bitcoin', 16),
            ('litecoin', 'LTC', 'Litecoin', 17),
            ('bitcoin-cash', 'BCH', 'Bitcoin Cash', 18),
            ('dai', 'DAI', 'Dai', 19),
            ('uniswap', 'UNI', 'Uniswap', 20),

            # 21-30
            ('stellar', 'XLM', 'Stellar', 21),
            ('cosmos', 'ATOM', 'Cosmos', 22),
            ('ethereum-classic', 'ETC', 'Ethereum Classic', 23),
            ('monero', 'XMR', 'Monero', 24),
            ('okb', 'OKB', 'OKB', 25),
            ('filecoin', 'FIL', 'Filecoin', 26),
            ('internet-computer', 'ICP', 'Internet Computer', 27),
            ('hedera-hashgraph', 'HBAR', 'Hedera', 28),
            ('aptos', 'APT', 'Aptos', 29),
            ('the-graph', 'GRT', 'The Graph', 30),

            # 31-40
            ('vechain', 'VET', 'VeChain', 31),
            ('near', 'NEAR', 'NEAR Protocol', 32),
            ('algorand', 'ALGO', 'Algorand', 33),
            ('quant-network', 'QNT', 'Quant', 34),
            ('optimism', 'OP', 'Optimism', 35),
            ('aave', 'AAVE', 'Aave', 36),
            ('fantom', 'FTM', 'Fantom', 37),
            ('theta-token', 'THETA', 'Theta Network', 38),
            ('flow', 'FLOW', 'Flow', 39),
            ('elrond-erd-2', 'EGLD', 'MultiversX', 40),

            # 41-50 (Affichés en mode gratuit)
            ('eos', 'EOS', 'EOS', 41),
            ('axie-infinity', 'AXS', 'Axie Infinity', 42),
            ('tezos', 'XTZ', 'Tezos', 43),
            ('the-sandbox', 'SAND', 'The Sandbox', 44),
            ('decentraland', 'MANA', 'Decentraland', 45),
            ('zcash', 'ZEC', 'Zcash', 46),
            ('kucoin-shares', 'KCS', 'KuCoin Token', 47),
            ('neo', 'NEO', 'NEO', 48),
            ('iota', 'MIOTA', 'IOTA', 49),
            ('chiliz', 'CHZ', 'Chiliz', 50),
        ]

        cursor.executemany('''
            INSERT OR IGNORE INTO supported_cryptos (id, symbol, name, sort_order)
            VALUES (?, ?, ?, ?)
        ''', supported_cryptos)

        conn.commit()
        conn.close()

    def get_supported_cryptos(self) -> List[Dict[str, Any]]:
        """Get list of supported cryptocurrencies"""
        conn = self.get_connection()
        cursor = conn.cursor()

        cursor.execute('''
            SELECT id, symbol, name, image_url, sort_order
            FROM supported_cryptos
            WHERE is_active = 1
            ORDER BY sort_order
        ''')

        cryptos = []
        for row in cursor.fetchall():
            cryptos.append({
                'id': row['id'],
                'symbol': row['symbol'],
                'name': row['name'],
                'image_url': row['image_url'],
                'sort_order': row['sort_order']
            })

        conn.close()
        return cryptos

    def get_cached_price(self, crypto_id: str, max_age_seconds=60) -> Optional[Dict[str, Any]]:
        """
        Get cached price if not expired

        Args:
            crypto_id: CoinGecko ID (e.g., 'bitcoin')
            max_age_seconds: Maximum age of cache in seconds (default: 60)

        Returns:
            Price data dict if fresh, None if stale or not found
        """
        conn = self.get_connection()
        cursor = conn.cursor()

        cutoff_time = datetime.now() - timedelta(seconds=max_age_seconds)

        cursor.execute('''
            SELECT *
            FROM crypto_prices
            WHERE id = ? AND last_updated > ?
        ''', (crypto_id, cutoff_time))

        row = cursor.fetchone()
        conn.close()

        if row:
            return {
                'id': row['id'],
                'symbol': row['symbol'],
                'name': row['name'],
                'current_price_usd': row['current_price_usd'],
                'price_eur': row['price_eur'],
                'price_mga': row['price_mga'],
                'price_change_24h': row['price_change_24h'],
                'market_cap_usd': row['market_cap_usd'],
                'volume_24h_usd': row['volume_24h_usd'],
                'last_updated': row['last_updated']
            }
        return None

    def get_all_cached_prices(self, max_age_seconds=60) -> List[Dict[str, Any]]:
        """Get all cached prices that are not expired"""
        conn = self.get_connection()
        cursor = conn.cursor()

        cutoff_time = datetime.now() - timedelta(seconds=max_age_seconds)

        cursor.execute('''
            SELECT *
            FROM crypto_prices
            WHERE last_updated > ?
            ORDER BY symbol
        ''', (cutoff_time,))

        prices = []
        for row in cursor.fetchall():
            prices.append({
                'id': row['id'],
                'symbol': row['symbol'],
                'name': row['name'],
                'current_price_usd': row['current_price_usd'],
                'price_eur': row['price_eur'],
                'price_mga': row['price_mga'],
                'price_change_24h': row['price_change_24h'],
                'market_cap_usd': row['market_cap_usd'],
                'volume_24h_usd': row['volume_24h_usd'],
                'last_updated': row['last_updated']
            })

        conn.close()
        return prices

    def update_price(self, crypto_id: str, price_data: Dict[str, Any]):
        """
        Update or insert crypto price

        Args:
            crypto_id: CoinGecko ID
            price_data: Dict with price information
        """
        conn = self.get_connection()
        cursor = conn.cursor()

        cursor.execute('''
            INSERT OR REPLACE INTO crypto_prices (
                id, symbol, name, current_price_usd, price_eur, price_mga,
                price_change_24h, market_cap_usd, volume_24h_usd, last_updated
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            crypto_id,
            price_data.get('symbol', '').upper(),
            price_data.get('name', ''),
            price_data.get('current_price_usd', 0),
            price_data.get('price_eur', 0),
            price_data.get('price_mga', 0),
            price_data.get('price_change_24h', 0),
            price_data.get('market_cap_usd', 0),
            price_data.get('volume_24h_usd', 0),
            datetime.now()
        ))

        conn.commit()
        conn.close()

    def bulk_update_prices(self, prices_data: List[Dict[str, Any]]):
        """Bulk update multiple crypto prices"""
        conn = self.get_connection()
        cursor = conn.cursor()

        now = datetime.now()

        data_tuples = [
            (
                price.get('id'),
                price.get('symbol', '').upper(),
                price.get('name', ''),
                price.get('current_price_usd', 0),
                price.get('price_eur', 0),
                price.get('price_mga', 0),
                price.get('price_change_24h', 0),
                price.get('market_cap_usd', 0),
                price.get('volume_24h_usd', 0),
                now
            )
            for price in prices_data
        ]

        cursor.executemany('''
            INSERT OR REPLACE INTO crypto_prices (
                id, symbol, name, current_price_usd, price_eur, price_mga,
                price_change_24h, market_cap_usd, volume_24h_usd, last_updated
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', data_tuples)

        conn.commit()
        conn.close()

    def clear_old_prices(self, days=7):
        """Delete price records older than specified days"""
        conn = self.get_connection()
        cursor = conn.cursor()

        cutoff_date = datetime.now() - timedelta(days=days)

        cursor.execute('''
            DELETE FROM crypto_prices
            WHERE last_updated < ?
        ''', (cutoff_date,))

        deleted_count = cursor.rowcount
        conn.commit()
        conn.close()

        return deleted_count

    def get_cached_details(self, crypto_id: str, max_age_seconds=300):
        """Get cached crypto details (default 5 minutes)"""
        import json
        conn = self.get_connection()
        cursor = conn.cursor()

        cutoff_time = datetime.now() - timedelta(seconds=max_age_seconds)

        cursor.execute('''
            SELECT details_json, cached_at
            FROM crypto_details_cache
            WHERE crypto_id = ? AND cached_at > ?
        ''', (crypto_id, cutoff_time))

        row = cursor.fetchone()
        conn.close()

        if row:
            return json.loads(row[0])
        return None

    def cache_details(self, crypto_id: str, details: dict):
        """Cache crypto details"""
        import json
        conn = self.get_connection()
        cursor = conn.cursor()

        cursor.execute('''
            INSERT OR REPLACE INTO crypto_details_cache (crypto_id, details_json, cached_at)
            VALUES (?, ?, ?)
        ''', (crypto_id, json.dumps(details), datetime.now()))

        conn.commit()
        conn.close()

    def get_cached_history(self, crypto_id: str, period: str, max_age_seconds=600):
        """Get cached crypto history (default 10 minutes)"""
        import json
        conn = self.get_connection()
        cursor = conn.cursor()

        cutoff_time = datetime.now() - timedelta(seconds=max_age_seconds)

        cursor.execute('''
            SELECT history_json, cached_at
            FROM crypto_history_cache
            WHERE crypto_id = ? AND period = ? AND cached_at > ?
        ''', (crypto_id, period, cutoff_time))

        row = cursor.fetchone()
        conn.close()

        if row:
            return json.loads(row[0])
        return None

    def cache_history(self, crypto_id: str, period: str, history: dict):
        """Cache crypto history"""
        import json
        conn = self.get_connection()
        cursor = conn.cursor()

        cursor.execute('''
            INSERT OR REPLACE INTO crypto_history_cache (crypto_id, period, history_json, cached_at)
            VALUES (?, ?, ?, ?)
        ''', (crypto_id, period, json.dumps(history), datetime.now()))

        conn.commit()
        conn.close()

    def clear_old_cache(self, hours=24):
        """Clear old cached details and history"""
        conn = self.get_connection()
        cursor = conn.cursor()

        cutoff_time = datetime.now() - timedelta(hours=hours)

        cursor.execute('DELETE FROM crypto_details_cache WHERE cached_at < ?', (cutoff_time,))
        details_deleted = cursor.rowcount

        cursor.execute('DELETE FROM crypto_history_cache WHERE cached_at < ?', (cutoff_time,))
        history_deleted = cursor.rowcount

        conn.commit()
        conn.close()

        return {'details': details_deleted, 'history': history_deleted}
