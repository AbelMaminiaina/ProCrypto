"""
Script to pre-fill the crypto cache with popular cryptocurrencies
Run this to avoid rate limit errors for users
"""
import time
import requests
from datetime import datetime

POPULAR_CRYPTOS = [
    'bitcoin', 'ethereum', 'tether', 'binancecoin', 'solana',
    'ripple', 'usd-coin', 'cardano', 'dogecoin', 'tron',
    'avalanche-2', 'shiba-inu', 'polkadot', 'chainlink', 'matic-network',
    'wrapped-bitcoin', 'litecoin', 'bitcoin-cash', 'dai', 'uniswap',
    'stellar', 'cosmos', 'ethereum-classic', 'monero', 'okb'
]

def prefill_cache():
    print("🚀 Starting cache pre-fill...")
    print(f"⏰ Started at: {datetime.now().strftime('%H:%M:%S')}")
    print(f"📊 Total cryptos to cache: {len(POPULAR_CRYPTOS)}")
    print("")

    success_count = 0
    error_count = 0

    for i, crypto_id in enumerate(POPULAR_CRYPTOS, 1):
        try:
            print(f"[{i}/{len(POPULAR_CRYPTOS)}] Fetching {crypto_id}...", end=" ")

            # Call details endpoint
            response = requests.get(
                f'http://localhost:5000/api/crypto/{crypto_id}/details',
                timeout=15
            )

            if response.status_code == 200:
                data = response.json()
                cached = data.get('cached', False)
                status = "✅ CACHED" if cached else "✅ FETCHED"
                print(status)
                success_count += 1
            else:
                print(f"❌ ERROR {response.status_code}")
                error_count += 1

            # Wait 7 seconds between calls (safe rate: ~8.5 calls/minute)
            if i < len(POPULAR_CRYPTOS):
                print(f"   ⏳ Waiting 7 seconds...", end="\r")
                time.sleep(7)
                print(" " * 50, end="\r")  # Clear the waiting message

        except Exception as e:
            print(f"❌ EXCEPTION: {str(e)}")
            error_count += 1
            time.sleep(7)

    print("")
    print("=" * 60)
    print(f"✅ Successfully cached: {success_count}")
    print(f"❌ Errors: {error_count}")
    print(f"⏰ Finished at: {datetime.now().strftime('%H:%M:%S')}")
    print("=" * 60)
    print("")
    print("🎉 Cache pre-fill complete!")
    print("Users can now browse these cryptos without rate limit errors.")

if __name__ == '__main__':
    print("")
    print("=" * 60)
    print("  CRYPTO CACHE PRE-FILL SCRIPT")
    print("=" * 60)
    print("")
    print("⚠️  IMPORTANT:")
    print("   - Make sure the backend is running (python api.py)")
    print("   - This will take ~3-4 minutes (7 seconds per crypto)")
    print("   - Do NOT interrupt the script")
    print("")
    print("Starting automatically...")
    print("")

    prefill_cache()
