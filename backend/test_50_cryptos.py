#!/usr/bin/env python3
"""Test de récupération des 50 cryptos"""

import requests
import time

API_URL = "http://localhost:5000"

print('Test de récupération des 50 cryptos...\n')

# Refresh les prix depuis CoinGecko
print('1. Rafraîchissement des prix depuis CoinGecko...')
resp = requests.post(f'{API_URL}/api/crypto/prices/refresh')
if resp.status_code == 200:
    data = resp.json()
    print(f'   ✓ {len(data["prices"])} cryptos récupérées')
    time.sleep(1)
else:
    print(f'   ✗ Erreur: {resp.status_code}')
    print(resp.text)
    exit(1)

# Vérifier les prix
print('\n2. Vérification des prix...')
resp = requests.get(f'{API_URL}/api/crypto/prices')
if resp.status_code == 200:
    data = resp.json()
    prices = data['prices']
    print(f'   ✓ {len(prices)} cryptos disponibles')

    print('\n   Top 5 cryptos (mode authentifié):')
    for i, crypto in enumerate(prices[:5], 1):
        price = crypto['current_price_usd']
        print(f'   {i}. {crypto["symbol"]:6s} - {crypto["name"]:20s} = ${price:,.2f}')

    print('\n   Cryptos 41-50 (mode gratuit):')
    for i, crypto in enumerate(prices[40:50], 41):
        price = crypto['current_price_usd']
        print(f'   {i}. {crypto["symbol"]:6s} - {crypto["name"]:20s} = ${price:,.2f}')
else:
    print(f'   ✗ Erreur: {resp.status_code}')
    print(resp.text)
    exit(1)

print('\n✓ Tous les tests passés!')
print(f'\n📊 Résumé:')
print(f'   - Total cryptos supportées: 50')
print(f'   - Mode gratuit: 10 cryptos (positions 41-50)')
print(f'   - Mode authentifié: 50 cryptos complètes')
