# ⚙️ Configuration du Cache - ProCrypto

## 📊 Durées de Cache Actuelles (v1.1.0)

### Cache Principal (Frais)

| Endpoint | Durée Cache | Raison |
|----------|-------------|--------|
| `/api/crypto/<id>/details` | **30 minutes** | Prix crypto changent lentement |
| `/api/crypto/<id>/history` | **30 minutes** | Historique stable par période |

**Bénéfice:**
- Navigation dans l'application pendant 30 min sans appel API
- Économie massive d'appels

### Cache Fallback (Périmé)

| Endpoint | Durée Fallback | Usage |
|----------|----------------|-------|
| `/api/crypto/<id>/details` | **24 heures** | Si rate limit dépassé |
| `/api/crypto/<id>/history` | **24 heures** | Si rate limit dépassé |

**Bénéfice:**
- Données toujours disponibles même si limite API atteinte
- Utilisateur ne voit jamais "Erreur" (sauf première visite)

---

## 🔧 Comment Ça Fonctionne

### Flux Normal (Aucun Rate Limit)

```
1. Utilisateur visite /crypto/bitcoin

2. Frontend demande /api/crypto/bitcoin/details
   → Backend vérifie cache (< 30 min) → Trouvé? Retourne immédiatement
   → Pas trouvé? Appel API CoinGecko → Cache résultat → Retourne

3. Frontend attend 2 secondes

4. Frontend demande /api/crypto/bitcoin/history?period=7d
   → Backend vérifie cache (< 30 min) → Trouvé? Retourne immédiatement
   → Pas trouvé? Appel API CoinGecko → Cache résultat → Retourne
```

**Appels API:** 2 (première visite), 0 (visites suivantes dans 30 min)

---

### Flux avec Rate Limit Dépassé

```
1. Utilisateur visite /crypto/cardano (nouvelle crypto non en cache)

2. Frontend demande /api/crypto/cardano/details
   → Backend vérifie cache frais (< 30 min) → Pas trouvé
   → Backend vérifie rate limit → DÉPASSÉ! ❌
   → Backend cherche cache périmé (< 24h) → Trouvé? ✅ Retourne avec warning
   → Pas trouvé? ❌ Retourne erreur 429

3. Si erreur 429:
   Frontend affiche: "⏱️ Limite d'API atteinte. Attendez 10-20 secondes"
```

**Clé:** Si un cache existe (même vieux de 24h), il sera retourné au lieu d'une erreur!

---

## 🎯 Cas d'Usage

### Cas 1: Navigation Normale (Idéal)

**Scénario:**
- Utilisateur visite Bitcoin, Ethereum, Solana
- Revient sur Bitcoin après 10 minutes

**Résultat:**
- Bitcoin: 2 appels API (details + history) → Mise en cache 30 min
- Ethereum: 2 appels API → Mise en cache 30 min
- Solana: 2 appels API → Mise en cache 30 min
- Retour Bitcoin: 0 appels (cache frais)

**Total:** 6 appels API, limite jamais dépassée ✅

---

### Cas 2: Navigation Intensive (Problématique)

**Scénario:**
- Utilisateur visite 20 cryptos différentes rapidement
- Toutes nouvelles (pas en cache)

**Résultat:**
- Cryptos 1-5: 10 appels API → Rate limit OK ✅
- Crypto 6+: Rate limit atteint → Cherche cache périmé
  - Si cache existe (< 24h): Retourne données ✅
  - Si pas de cache: Erreur 429 ❌

**Solution:** Attendre 60 secondes, le rate limiter se réinitialise

---

### Cas 3: Développement/Tests (Fréquent)

**Scénario:**
- Développeur recharge page 20 fois en testant

**Résultat:**
- 1er chargement: 2 appels API → Cache 30 min
- Rechargements suivants: 0 appels (cache frais) ✅

**Aucun problème!** Le cache protège complètement

---

## ⚙️ Configuration Recommandée

### Pour Production

```python
# backend/crypto_api.py

# Cache frais (recommandé: 30-60 min)
cached_details = db.get_cached_details(crypto_id, max_age_seconds=3600)  # 1 heure
cached_history = db.get_cached_history(crypto_id, period, max_age_seconds=3600)  # 1 heure

# Cache fallback (recommandé: 24-48h)
stale_cache = db.get_cached_details(crypto_id, max_age_seconds=86400)  # 24 heures
stale_cache = db.get_cached_history(crypto_id, period, max_age_seconds=86400)  # 24 heures
```

### Pour Développement

```python
# Cache frais plus court pour voir changements rapidement
cached_details = db.get_cached_details(crypto_id, max_age_seconds=300)  # 5 minutes
cached_history = db.get_cached_history(crypto_id, period, max_age_seconds=300)  # 5 minutes

# Fallback toujours long
stale_cache = db.get_cached_details(crypto_id, max_age_seconds=3600)  # 1 heure
```

---

## 🚀 Optimisations Possibles

### Option 1: Pré-Remplir le Cache

**Idée:** Au démarrage du backend, charger automatiquement les 10 cryptos les plus populaires

```python
# backend/api.py
@app.before_first_request
def prefill_cache():
    """Pre-fill cache with top 10 cryptos"""
    popular_cryptos = ['bitcoin', 'ethereum', 'tether', 'binancecoin', 'solana',
                       'ripple', 'cardano', 'dogecoin', 'polkadot', 'uniswap']

    for crypto_id in popular_cryptos:
        try:
            # Call details endpoint to cache
            get_crypto_details(crypto_id)
            time.sleep(6)  # 6 seconds between calls = 10 calls/minute
        except:
            pass
```

**Bénéfice:** Utilisateurs ne voient jamais d'erreur sur cryptos populaires

---

### Option 2: Cache Background Refresh

**Idée:** Rafraîchir automatiquement le cache avant expiration

```python
# backend/api.py
import threading
from apscheduler.schedulers.background import BackgroundScheduler

def refresh_popular_cache():
    """Refresh cache for popular cryptos every 25 minutes"""
    popular = ['bitcoin', 'ethereum', 'tether', 'binancecoin', 'solana']
    for crypto_id in popular:
        try:
            get_crypto_details(crypto_id)
            time.sleep(6)
        except:
            pass

# Start scheduler
scheduler = BackgroundScheduler()
scheduler.add_job(refresh_popular_cache, 'interval', minutes=25)
scheduler.start()
```

**Bénéfice:** Cache toujours frais pour cryptos populaires, pas d'attente

---

### Option 3: Augmenter Rate Limit (CoinGecko Pro)

**Coût:** ~$9.99-29.99/mois
**Limite:** 500-10,000 calls/minute

Si vous passez à CoinGecko Pro API:

```python
# backend/crypto_api.py
RATE_LIMIT_CALLS_PER_MINUTE = 500  # Au lieu de 10

# Réduire cache si Pro
cached_details = db.get_cached_details(crypto_id, max_age_seconds=300)  # 5 min
```

---

## 🐛 Debugging

### Vérifier si Cache est Utilisé

```bash
# Logs backend montrent "cached": true/false
tail -f backend/output.log

# Ou directement dans la réponse API
curl http://localhost:5000/api/crypto/bitcoin/details | grep cached
# Résultat: "cached": true → Du cache
# Résultat: "cached": false → API call
```

### Voir Contenu du Cache

```python
# Dans backend/
python

>>> from db_manager import CryptoDatabase
>>> db = CryptoDatabase()
>>>
>>> # Nombre d'entrées
>>> import sqlite3
>>> conn = sqlite3.connect('crypto_data.db')
>>> cursor = conn.cursor()
>>> cursor.execute('SELECT COUNT(*) FROM crypto_details_cache')
>>> print("Details cache:", cursor.fetchone()[0])
>>> cursor.execute('SELECT COUNT(*) FROM crypto_history_cache')
>>> print("History cache:", cursor.fetchone()[0])
>>>
>>> # Voir les cryptos en cache
>>> cursor.execute('SELECT crypto_id, cached_at FROM crypto_details_cache ORDER BY cached_at DESC')
>>> for row in cursor.fetchall():
...     print(row)
```

### Vider le Cache Manuellement

```python
# Si besoin de forcer refresh
python -c "from db_manager import CryptoDatabase; db = CryptoDatabase(); db.clear_old_cache(hours=0)"
```

---

## 📈 Métriques Attendues

### Avec Cache 30 min

**Scénario:** 100 visites de pages détails crypto en 1 heure

| Type Visite | Nombre | Appels API | Cache Hit |
|-------------|--------|------------|-----------|
| Nouvelles cryptos (jamais vues) | 20 | 40 | 0% |
| Cryptos déjà vues (< 30 min) | 80 | 0 | 100% |
| **Total** | **100** | **40** | **60%** |

**Sans cache:** 200 appels API (100% API calls)
**Avec cache:** 40 appels API (80% de réduction) ✅

---

### Avec Cache 1h

| Type Visite | Nombre | Appels API | Cache Hit |
|-------------|--------|------------|-----------|
| Nouvelles cryptos | 15 | 30 | 0% |
| Cryptos en cache | 85 | 0 | 100% |
| **Total** | **100** | **30** | **85%** |

**Réduction:** 85% d'appels API ✅

---

## 🎯 Recommandations Finales

### Configuration Actuelle (v1.1.0)
```
Cache frais: 30 minutes
Fallback: 24 heures
Rate limit: 10 calls/minute
```

**Verdict:** ✅ **Optimal pour API gratuite**
- Balance entre fraîcheur et économie
- Fallback 24h garantit disponibilité
- Rate limit conservateur évite blocage

### Si Encore des Erreurs

1. **Vérifier que le backend a redémarré** avec les nouveaux paramètres
2. **Attendre 60 secondes** après une erreur (rate limiter se réinitialise)
3. **Naviguer vers des cryptos déjà visitées** (utilise cache)
4. **Considérer CoinGecko Pro** si usage intensif prévu

---

**Date:** 2026-01-05
**Version:** 1.1.0
**Cache Config:** 30 min / 24h fallback
