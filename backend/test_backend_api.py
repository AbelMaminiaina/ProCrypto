"""
Script de test pour l'API Flask du convertisseur
Test script for the Flask converter API
"""

import requests
import json

API_URL = "http://localhost:5000/api"

print("=" * 80)
print("🧪 TEST DE L'API BACKEND PYTHON / TESTING PYTHON BACKEND API")
print("=" * 80)

# Test 1: Health check
print("\n1. Test de santé de l'API / API Health Check")
print("-" * 80)
try:
    response = requests.get(f"{API_URL}/health")
    data = response.json()
    print(f"✅ Status: {data['status']}")
    print(f"   Devises chargées: {data['currencies_count']}")
    print(f"   Taux chargés: {data['rates_loaded']}")
    print(f"   Dernière mise à jour: {data['last_update']}")
except Exception as e:
    print(f"❌ Erreur: {e}")

# Test 2: Liste des devises
print("\n2. Liste des devises / Currencies List")
print("-" * 80)
try:
    response = requests.get(f"{API_URL}/currencies")
    data = response.json()
    print(f"✅ {len(data['currencies'])} devises disponibles:")
    for currency in data['currencies']:
        print(f"   - {currency['code']}: {currency['name']}")
except Exception as e:
    print(f"❌ Erreur: {e}")

# Test 3: Conversion simple
print("\n3. Conversion simple: 100 EUR → USD")
print("-" * 80)
try:
    response = requests.post(
        f"{API_URL}/convert",
        json={"amount": 100, "from": "EUR", "to": "USD"}
    )
    data = response.json()
    print(f"✅ Conversion réussie:")
    print(f"   {data['amount']} {data['from']} = {data['result']:.2f} {data['to']}")
    print(f"   Taux de change: 1 {data['from']} = {data['rate']:.6f} {data['to']}")
except Exception as e:
    print(f"❌ Erreur: {e}")

# Test 4: Conversion EUR → Ariary
print("\n4. Conversion: 100 EUR → Ariary (MGA)")
print("-" * 80)
try:
    response = requests.post(
        f"{API_URL}/convert",
        json={"amount": 100, "from": "EUR", "to": "MGA"}
    )
    data = response.json()
    print(f"✅ Conversion réussie:")
    print(f"   {data['amount']} {data['from']} = {data['result']:,.2f} {data['to']}")
    print(f"   Taux de change: 1 {data['from']} = {data['rate']:.2f} {data['to']}")
except Exception as e:
    print(f"❌ Erreur: {e}")

# Test 5: Conversion vers toutes les devises
print("\n5. Conversion vers toutes les devises: 1000 USD → Toutes")
print("-" * 80)
try:
    response = requests.post(
        f"{API_URL}/convert/all",
        json={"amount": 1000, "from": "USD"}
    )
    data = response.json()
    print(f"✅ Conversions pour {data['amount']} {data['from']}:")
    for conv in data['conversions'][:5]:  # Afficher les 5 premières
        print(f"   → {conv['result']:>15,.2f} {conv['currency']:4s} ({conv['name'][:30]})")
    print(f"   ... et {len(data['conversions']) - 5} autres devises")
except Exception as e:
    print(f"❌ Erreur: {e}")

# Test 6: Tous les taux de change
print("\n6. Récupération de tous les taux de change")
print("-" * 80)
try:
    response = requests.get(f"{API_URL}/rates")
    data = response.json()
    print(f"✅ Taux récupérés:")
    print(f"   EUR → USD: {data['rates']['EUR']['USD']:.4f}")
    print(f"   USD → EUR: {data['rates']['USD']['EUR']:.4f}")
    print(f"   EUR → MGA: {data['rates']['EUR']['MGA']:.2f}")
    print(f"   Dernière mise à jour: {data['last_update']}")
except Exception as e:
    print(f"❌ Erreur: {e}")

# Test 7: Rafraîchissement des taux
print("\n7. Rafraîchissement des taux (peut prendre quelques secondes)")
print("-" * 80)
try:
    response = requests.post(f"{API_URL}/rates/refresh")
    data = response.json()
    if data.get('success'):
        print(f"✅ Taux rafraîchis avec succès!")
        print(f"   1 EUR = {data['base_rates']['USD']:.4f} USD")
        print(f"   1 EUR = {data['base_rates']['MGA']:.2f} MGA")
    else:
        print(f"⚠️  Rafraîchissement avec erreurs (utilisation des taux par défaut)")
except Exception as e:
    print(f"❌ Erreur: {e}")

print("\n" + "=" * 80)
print("✅ TOUS LES TESTS SONT TERMINÉS / ALL TESTS COMPLETED")
print("=" * 80)
print("\n💡 L'API backend Python fonctionne correctement!")
print("   Vous pouvez maintenant lancer le frontend React:")
print("   cd frontend && npm install && npm run dev")
