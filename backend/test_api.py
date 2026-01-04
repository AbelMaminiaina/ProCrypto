"""
Script de test pour vérifier les APIs de taux de change
Test script to verify exchange rate APIs
"""

import requests

print("=" * 60)
print("TEST DES APIs DE TAUX DE CHANGE / TESTING EXCHANGE RATE APIs")
print("=" * 60)

# Test 1: API Frankfurter (EUR/USD)
print("\n1. Test API Frankfurter (EUR/USD)...")
try:
    response = requests.get('https://api.frankfurter.app/latest?from=EUR', timeout=5)
    response.raise_for_status()
    data = response.json()
    print(f"   ✓ Succès! / Success!")
    print(f"   Date: {data.get('date')}")
    print(f"   1 EUR = {data['rates'].get('USD', 'N/A')} USD")
except Exception as e:
    print(f"   ✗ Erreur: {e}")

# Test 2: API Frankfurter (USD/EUR)
print("\n2. Test API Frankfurter (USD/EUR)...")
try:
    response = requests.get('https://api.frankfurter.app/latest?from=USD', timeout=5)
    response.raise_for_status()
    data = response.json()
    print(f"   ✓ Succès! / Success!")
    print(f"   Date: {data.get('date')}")
    print(f"   1 USD = {data['rates'].get('EUR', 'N/A')} EUR")
except Exception as e:
    print(f"   ✗ Erreur: {e}")

# Test 3: API Currency (EUR vers MGA - Ariary)
print("\n3. Test API Currency (EUR vers MGA - Ariary)...")
try:
    response = requests.get(
        'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json',
        timeout=5
    )
    response.raise_for_status()
    data = response.json()
    print(f"   ✓ Succès! / Success!")
    print(f"   Date: {data.get('date', 'N/A')}")
    if 'mga' in data.get('eur', {}):
        eur_to_mga = data['eur']['mga']
        print(f"   1 EUR = {eur_to_mga:.2f} MGA (Ariary)")
        print(f"   1 ARIARY = {1/eur_to_mga:.6f} EUR")
    else:
        print("   ✗ MGA non trouvé dans la réponse / MGA not found in response")
except Exception as e:
    print(f"   ✗ Erreur: {e}")

# Test 4: API Currency (USD vers MGA - Ariary)
print("\n4. Test API Currency (USD vers MGA - Ariary)...")
try:
    response = requests.get(
        'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
        timeout=5
    )
    response.raise_for_status()
    data = response.json()
    print(f"   ✓ Succès! / Success!")
    print(f"   Date: {data.get('date', 'N/A')}")
    if 'mga' in data.get('usd', {}):
        usd_to_mga = data['usd']['mga']
        print(f"   1 USD = {usd_to_mga:.2f} MGA (Ariary)")
        print(f"   1 ARIARY = {1/usd_to_mga:.6f} USD")
    else:
        print("   ✗ MGA non trouvé dans la réponse / MGA not found in response")
except Exception as e:
    print(f"   ✗ Erreur: {e}")

print("\n" + "=" * 60)
print("TESTS TERMINÉS / TESTS COMPLETED")
print("=" * 60)
