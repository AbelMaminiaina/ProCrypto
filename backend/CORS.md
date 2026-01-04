# Configuration CORS du Backend

## Origines Autorisées

Le backend autorise les requêtes CORS depuis:

### Production
- ✅ `https://procrypto.vercel.app` - Frontend Vercel

### Développement Local
- ✅ `http://localhost:3000` - Vite dev server
- ✅ `http://localhost:5173` - Vite dev server (port alternatif)
- ✅ `http://localhost:5000` - Backend local

## Ajouter d'Autres Origines

### Via Variable d'Environnement

Si vous avez d'autres domaines (ex: domaine personnalisé):

1. **Sur Render:**
   - Allez dans Dashboard → Votre service
   - Environment → Add Environment Variable
   - Name: `ALLOWED_ORIGINS`
   - Value: `https://votre-domaine.com,https://autre-domaine.com`

2. **Localement:**
   ```bash
   export ALLOWED_ORIGINS="https://monsite.com,https://autresite.com"
   python api.py
   ```

### Via Code

Éditez `backend/api.py`:

```python
cors_origins = [
    "https://procrypto.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5000",
    "https://votre-nouveau-domaine.com",  # Ajoutez ici
]
```

## Tester la Configuration CORS

### Test Local

```bash
cd backend
python -c "from api import cors_origins; print(cors_origins)"
```

### Test avec curl

```bash
# Test depuis une origine autorisée
curl -H "Origin: https://procrypto.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://votre-backend.onrender.com/api/health
```

Si CORS est bien configuré, vous verrez:
```
Access-Control-Allow-Origin: https://procrypto.vercel.app
Access-Control-Allow-Credentials: true
```

## Déployer les Changements

### 1. Commit et Push

```bash
git add backend/api.py
git commit -m "feat: configure CORS for Vercel frontend"
git push
```

### 2. Render Redéploie Automatiquement

Render détecte le nouveau commit et redéploie le backend (3-5 min).

### 3. Vérifier le Déploiement

Ouvrez votre frontend Vercel et vérifiez:
- ✅ API Status: Connected (vert)
- ✅ Pas d'erreur CORS dans la console (F12)

## Erreurs CORS Courantes

### Erreur: "blocked by CORS policy"

**Cause:** L'origine n'est pas dans la liste.

**Solution:**
1. Vérifiez l'URL exacte du frontend (avec/sans slash final)
2. Ajoutez l'origine dans `cors_origins`
3. Redéployez

### Erreur: "No 'Access-Control-Allow-Origin' header"

**Cause:** `flask-cors` pas installé ou mal configuré.

**Solution:**
```bash
cd backend
pip install flask-cors
```

### Le frontend local ne peut pas se connecter

**Cause:** Port localhost différent.

**Solution:** Ajoutez votre port dans `cors_origins`:
```python
"http://localhost:VOTRE_PORT",
```

## Sécurité

### ✅ Bonnes Pratiques Appliquées

- Liste blanche d'origines spécifiques (pas de wildcard `*`)
- Support des credentials sécurisé
- Variables d'environnement pour flexibilité
- Origines de dev séparées de production

### ⚠️ Ne Jamais Faire

```python
# ❌ MAUVAIS - Trop permissif
CORS(app, origins="*")

# ✅ BON - Origines spécifiques
CORS(app, origins=["https://monsite.com"])
```

## Support Multi-Domaines Vercel

Si vous avez plusieurs déploiements Vercel (preview, production, etc.):

```python
cors_origins = [
    "https://procrypto.vercel.app",           # Production
    "https://procrypto-*.vercel.app",         # Preview deployments
    "http://localhost:3000",
]
```

**Note:** Flask-CORS supporte les wildcards limités comme `*.vercel.app`.

## Logs de Débogage

Pour voir quelles requêtes CORS sont acceptées/rejetées:

```python
# Dans api.py
import logging
logging.basicConfig(level=logging.DEBUG)
```

Puis regardez les logs Render pour voir les requêtes CORS.
