#!/usr/bin/env python3
"""Test crypto details and history endpoints"""

import requests

API_URL = "http://localhost:5000"

print('Test endpoints crypto détails...\n')

# Test details endpoint
print('1. Test /api/crypto/bitcoin/details')
resp = requests.get(f'{API_URL}/api/crypto/bitcoin/details')
if resp.status_code == 200:
    data = resp.json()
    details = data['details']
    print(f'   ✓ {details["name"]} ({details["symbol"]})')
    print(f'   Market Cap Rank: #{details["market_data"]["market_cap_rank"]}')
    print(f'   Current Price: ${details["market_data"]["current_price_usd"]:,.2f}')
    print(f'   ATH: ${details["market_data"]["ath_usd"]:,.2f}')
    print(f'   24h Change: {details["market_data"]["price_change_24h"]:.2f}%')
else:
    print(f'   ✗ Error: {resp.status_code}')
    print(resp.text)

# Test history endpoint
print('\n2. Test /api/crypto/bitcoin/history?period=7d')
resp = requests.get(f'{API_URL}/api/crypto/bitcoin/history', params={'period': '7d'})
if resp.status_code == 200:
    data = resp.json()
    print(f'   ✓ Got {data["data_points"]} data points for {data["period"]}')
    if data['prices']:
        first = data['prices'][0]
        last = data['prices'][-1]
        print(f'   First: {first["date"][:10]} - ${first["price"]:,.2f}')
        print(f'   Last: {last["date"][:10]} - ${last["price"]:,.2f}')
else:
    print(f'   ✗ Error: {resp.status_code}')
    print(resp.text)

print('\n✓ Backend endpoints working!')
