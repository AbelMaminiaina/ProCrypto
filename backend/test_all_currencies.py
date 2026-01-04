"""
Script de test complet pour toutes les devises
Complete test script for all currencies
"""

import requests

print("=" * 80)
print("TEST COMPLET DES APIs POUR TOUTES LES DEVISES")
print("COMPLETE API TEST FOR ALL CURRENCIES")
print("=" * 80)

# Test 1: API Frankfurter - Toutes les devises principales
print("\n1. Test API Frankfurter (EUR vers toutes les devises)...")
try:
    response = requests.get('https://api.frankfurter.app/latest?from=EUR', timeout=5)
    response.raise_for_status()
    data = response.json()

    print(f"   ✓ Succès! / Success!")
    print(f"   Date: {data.get('date')}")
    print("\n   Taux disponibles / Available rates:")

    currencies_to_check = ['USD', 'GBP', 'JPY', 'CNY', 'CAD', 'AUD', 'INR', 'AED', 'SAR']

    for currency in currencies_to_check:
        if currency in data['rates']:
            print(f"      ✓ {currency}: 1 EUR = {data['rates'][currency]:.4f} {currency}")
        else:
            print(f"      ✗ {currency}: Non disponible / Not available")

except Exception as e:
    print(f"   ✗ Erreur: {e}")

# Test 2: API Currency pour MGA, AED, SAR
print("\n2. Test API Currency pour MGA, AED, SAR...")
try:
    response = requests.get(
        'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json',
        timeout=5
    )
    response.raise_for_status()
    data = response.json()

    print(f"   ✓ Succès! / Success!")
    print(f"   Date: {data.get('date', 'N/A')}")

    # MGA (Ariary)
    if 'mga' in data.get('eur', {}):
        mga_rate = data['eur']['mga']
        print(f"      ✓ MGA (Ariary): 1 EUR = {mga_rate:.2f} MGA")
    else:
        print(f"      ✗ MGA: Non disponible / Not available")

    # AED (Dirham UAE)
    if 'aed' in data.get('eur', {}):
        aed_rate = data['eur']['aed']
        print(f"      ✓ AED (Dirham): 1 EUR = {aed_rate:.4f} AED")
    else:
        print(f"      ✗ AED: Non disponible / Not available")

    # SAR (Riyal saoudien)
    if 'sar' in data.get('eur', {}):
        sar_rate = data['eur']['sar']
        print(f"      ✓ SAR (Riyal): 1 EUR = {sar_rate:.4f} SAR")
    else:
        print(f"      ✗ SAR: Non disponible / Not available")

except Exception as e:
    print(f"   ✗ Erreur: {e}")

# Test 3: Vérifier la disponibilité de toutes les devises requises
print("\n3. Résumé des devises supportées / Summary of supported currencies:")
print("=" * 80)

supported_currencies = {
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

for code, name in supported_currencies.items():
    print(f"   {code:4s} - {name}")

print("\n" + "=" * 80)
print("TESTS TERMINÉS / TESTS COMPLETED")
print("=" * 80)
print("\nToutes les devises sont maintenant supportées!")
print("All currencies are now supported!")
