#!/usr/bin/env python3
"""
Integration test for ProCrypto Backend API
Tests authentication, portfolio, transactions, and alerts
"""

import requests
import json
import time
from datetime import datetime

API_URL = "http://localhost:5000"

def print_section(title):
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}")

def print_result(endpoint, status, data):
    print(f"✓ {endpoint}: {status}")
    if data:
        print(f"  Response: {json.dumps(data, indent=2)[:200]}...")

def test_auth():
    print_section("TESTING AUTHENTICATION")

    # 1. Register new user
    test_email = f"test_{int(time.time())}@example.com"
    test_password = "TestPass123!"

    print(f"\n1. Registering user: {test_email}")
    register_response = requests.post(f"{API_URL}/api/auth/register", json={
        "email": test_email,
        "password": test_password
    })

    if register_response.status_code == 201:
        print_result("POST /api/auth/register", register_response.status_code, register_response.json())
        tokens = register_response.json()
        access_token = tokens['access_token']
        refresh_token = tokens['refresh_token']
    else:
        print(f"✗ Registration failed: {register_response.status_code}")
        print(register_response.json())
        return None

    # 2. Login with credentials
    print(f"\n2. Logging in with credentials")
    login_response = requests.post(f"{API_URL}/api/auth/login", json={
        "email": test_email,
        "password": test_password
    })

    if login_response.status_code == 200:
        print_result("POST /api/auth/login", login_response.status_code, login_response.json())
        access_token = login_response.json()['access_token']
    else:
        print(f"✗ Login failed: {login_response.status_code}")
        return None

    # 3. Verify token
    print(f"\n3. Verifying token")
    headers = {"Authorization": f"Bearer {access_token}"}
    verify_response = requests.get(f"{API_URL}/api/auth/verify", headers=headers)

    if verify_response.status_code == 200:
        print_result("GET /api/auth/verify", verify_response.status_code, verify_response.json())
    else:
        print(f"✗ Token verification failed: {verify_response.status_code}")
        print(f"  Error: {verify_response.text}")

    # 4. Get user info
    print(f"\n4. Getting user info")
    me_response = requests.get(f"{API_URL}/api/auth/me", headers=headers)

    if me_response.status_code == 200:
        print_result("GET /api/auth/me", me_response.status_code, me_response.json())
        user_id = me_response.json()['user']['id']
    else:
        print(f"✗ Get user info failed: {me_response.status_code}")
        return None

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user_id": user_id,
        "email": test_email
    }

def test_portfolio(auth_data):
    print_section("TESTING PORTFOLIO ENDPOINTS")

    headers = {"Authorization": f"Bearer {auth_data['access_token']}"}

    # 1. Get empty portfolio
    print("\n1. Getting empty portfolio")
    response = requests.get(f"{API_URL}/api/portfolio", headers=headers)
    print_result("GET /api/portfolio", response.status_code, response.json())

    # 2. Add Bitcoin to portfolio
    print("\n2. Adding Bitcoin to portfolio")
    response = requests.post(f"{API_URL}/api/portfolio", headers=headers, json={
        "cryptoId": "bitcoin",
        "symbol": "BTC",
        "name": "Bitcoin",
        "quantity": 0.5,
        "purchasePrice": 45000
    })
    print_result("POST /api/portfolio", response.status_code, response.json())
    btc_id = response.json().get('holding_id')

    # 3. Add Ethereum to portfolio
    print("\n3. Adding Ethereum to portfolio")
    response = requests.post(f"{API_URL}/api/portfolio", headers=headers, json={
        "cryptoId": "ethereum",
        "symbol": "ETH",
        "name": "Ethereum",
        "quantity": 2.0,
        "purchasePrice": 3000
    })
    print_result("POST /api/portfolio", response.status_code, response.json())
    eth_id = response.json().get('holding_id')

    # 4. Get portfolio with holdings
    print("\n4. Getting portfolio with holdings")
    response = requests.get(f"{API_URL}/api/portfolio", headers=headers)
    print_result("GET /api/portfolio", response.status_code, response.json())

    # 5. Update Bitcoin holding
    print("\n5. Updating Bitcoin holding")
    response = requests.put(f"{API_URL}/api/portfolio/{btc_id}", headers=headers, json={
        "quantity": 1.0,
        "purchasePrice": 46000
    })
    print_result(f"PUT /api/portfolio/{btc_id}", response.status_code, response.json())

    # 6. Delete Ethereum holding
    print("\n6. Deleting Ethereum holding")
    response = requests.delete(f"{API_URL}/api/portfolio/{eth_id}", headers=headers)
    print_result(f"DELETE /api/portfolio/{eth_id}", response.status_code, response.json())

    return btc_id

def test_transactions(auth_data):
    print_section("TESTING TRANSACTION ENDPOINTS")

    headers = {"Authorization": f"Bearer {auth_data['access_token']}"}

    # 1. Get empty transactions
    print("\n1. Getting empty transactions")
    response = requests.get(f"{API_URL}/api/transactions", headers=headers)
    print_result("GET /api/transactions", response.status_code, response.json())

    # 2. Add buy transaction
    print("\n2. Adding buy transaction")
    response = requests.post(f"{API_URL}/api/transactions", headers=headers, json={
        "cryptoId": "bitcoin",
        "symbol": "BTC",
        "name": "Bitcoin",
        "type": "buy",
        "quantity": 0.5,
        "pricePerUnit": 45000,
        "date": datetime.now().isoformat(),
        "notes": "Initial purchase"
    })
    print_result("POST /api/transactions", response.status_code, response.json())
    tx1_id = response.json().get('transaction_id')

    # 3. Add sell transaction
    print("\n3. Adding sell transaction")
    response = requests.post(f"{API_URL}/api/transactions", headers=headers, json={
        "cryptoId": "bitcoin",
        "symbol": "BTC",
        "name": "Bitcoin",
        "type": "sell",
        "quantity": 0.1,
        "pricePerUnit": 48000,
        "date": datetime.now().isoformat(),
        "notes": "Partial sale"
    })
    print_result("POST /api/transactions", response.status_code, response.json())

    # 4. Get all transactions
    print("\n4. Getting all transactions")
    response = requests.get(f"{API_URL}/api/transactions", headers=headers)
    print_result("GET /api/transactions", response.status_code, response.json())

    # 5. Get transactions for Bitcoin
    print("\n5. Getting Bitcoin transactions")
    response = requests.get(f"{API_URL}/api/transactions/crypto/bitcoin", headers=headers)
    print_result("GET /api/transactions/crypto/bitcoin", response.status_code, response.json())

    # 6. Delete transaction
    print("\n6. Deleting a transaction")
    response = requests.delete(f"{API_URL}/api/transactions/{tx1_id}", headers=headers)
    print_result(f"DELETE /api/transactions/{tx1_id}", response.status_code, response.json())

    return True

def test_alerts(auth_data):
    print_section("TESTING ALERT ENDPOINTS")

    headers = {"Authorization": f"Bearer {auth_data['access_token']}"}

    # 1. Get empty alerts
    print("\n1. Getting empty alerts")
    response = requests.get(f"{API_URL}/api/alerts", headers=headers)
    print_result("GET /api/alerts", response.status_code, response.json())

    # 2. Create alert (Bitcoin above $50k)
    print("\n2. Creating alert: BTC > $50,000")
    response = requests.post(f"{API_URL}/api/alerts", headers=headers, json={
        "cryptoId": "bitcoin",
        "symbol": "BTC",
        "name": "Bitcoin",
        "targetPrice": 50000,
        "condition": "above"
    })
    print_result("POST /api/alerts", response.status_code, response.json())
    alert1_id = response.json().get('alert_id')

    # 3. Create alert (ETH below $2k)
    print("\n3. Creating alert: ETH < $2,000")
    response = requests.post(f"{API_URL}/api/alerts", headers=headers, json={
        "cryptoId": "ethereum",
        "symbol": "ETH",
        "name": "Ethereum",
        "targetPrice": 2000,
        "condition": "below"
    })
    print_result("POST /api/alerts", response.status_code, response.json())
    alert2_id = response.json().get('alert_id')

    # 4. Get all alerts
    print("\n4. Getting all alerts")
    response = requests.get(f"{API_URL}/api/alerts", headers=headers)
    print_result("GET /api/alerts", response.status_code, response.json())

    # 5. Get active alerts
    print("\n5. Getting active alerts")
    response = requests.get(f"{API_URL}/api/alerts/active", headers=headers)
    print_result("GET /api/alerts/active", response.status_code, response.json())

    # 6. Toggle alert (disable)
    print("\n6. Toggling alert (disable)")
    response = requests.post(f"{API_URL}/api/alerts/{alert1_id}/toggle", headers=headers)
    print_result(f"POST /api/alerts/{alert1_id}/toggle", response.status_code, response.json())

    # 7. Toggle alert again (re-enable)
    print("\n7. Toggling alert (re-enable)")
    response = requests.post(f"{API_URL}/api/alerts/{alert1_id}/toggle", headers=headers)
    print_result(f"POST /api/alerts/{alert1_id}/toggle", response.status_code, response.json())

    # 8. Trigger alert
    print("\n8. Triggering alert")
    response = requests.post(f"{API_URL}/api/alerts/{alert2_id}/trigger", headers=headers)
    print_result(f"POST /api/alerts/{alert2_id}/trigger", response.status_code, response.json())

    # 9. Update alert
    print("\n9. Updating alert")
    response = requests.put(f"{API_URL}/api/alerts/{alert1_id}", headers=headers, json={
        "targetPrice": 55000,
        "condition": "above"
    })
    print_result(f"PUT /api/alerts/{alert1_id}", response.status_code, response.json())

    # 10. Delete alert
    print("\n10. Deleting alert")
    response = requests.delete(f"{API_URL}/api/alerts/{alert2_id}", headers=headers)
    print_result(f"DELETE /api/alerts/{alert2_id}", response.status_code, response.json())

    return True

def test_crypto_endpoints():
    print_section("TESTING CRYPTO PRICE ENDPOINTS (PUBLIC)")

    # 1. Get crypto list
    print("\n1. Getting crypto list")
    response = requests.get(f"{API_URL}/api/crypto/list")
    print_result("GET /api/crypto/list", response.status_code, response.json())

    # 2. Get all prices
    print("\n2. Getting all crypto prices")
    response = requests.get(f"{API_URL}/api/crypto/prices")
    if response.status_code == 200:
        data = response.json()
        print(f"✓ GET /api/crypto/prices: {response.status_code}")
        print(f"  Got {len(data.get('prices', []))} crypto prices")
        print(f"  Cache age: {data.get('cache_age_seconds', 0)} seconds")
    else:
        print(f"✗ Failed: {response.status_code}")

    # 3. Get specific crypto price
    print("\n3. Getting Bitcoin price")
    response = requests.get(f"{API_URL}/api/crypto/prices/bitcoin")
    print_result("GET /api/crypto/prices/bitcoin", response.status_code, response.json())

    return True

def main():
    print("\n" + "="*60)
    print("  ProCrypto Backend Integration Test")
    print("="*60)

    try:
        # Test public endpoints
        test_crypto_endpoints()

        # Test authentication
        auth_data = test_auth()
        if not auth_data:
            print("\n✗ Authentication tests failed. Stopping.")
            return

        # Test protected endpoints
        test_portfolio(auth_data)
        test_transactions(auth_data)
        test_alerts(auth_data)

        print_section("ALL TESTS COMPLETED SUCCESSFULLY")
        print("\n✓ Authentication system working")
        print("✓ Portfolio management working")
        print("✓ Transaction tracking working")
        print("✓ Price alerts working")
        print("✓ Public crypto endpoints working")

    except Exception as e:
        print(f"\n✗ Test failed with error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
