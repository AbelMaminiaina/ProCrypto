# 🚀 Guide de Déploiement

## Déploiement du Frontend React sur Vercel

### Prérequis

1. Compte GitHub (gratuit)
2. Compte Vercel (gratuit)
3. Backend déployé (Render, Railway, etc.) - voir section backend

---

## 📱 Étape 1: Préparer le Projet

### 1.1 Pousser le code sur GitHub

```bash
# Depuis la racine du projet
git init
git add .
git commit -m "Initial commit - Currency Converter"

# Créer un nouveau repository sur GitHub puis:
git remote add origin https://github.com/VOTRE_USERNAME/ProCrytpo.git
git branch -M main
git push -u origin main
```

---

## 🌐 Étape 2: Déployer sur Vercel

### 2.1 Créer un compte Vercel

1. Allez sur https://vercel.com
2. Cliquez sur "Sign Up"
3. Connectez-vous avec GitHub

### 2.2 Importer le projet

1. Cliquez sur "Add New..." → "Project"
2. Sélectionnez votre repository `ProCrytpo`
3. Cliquez sur "Import"

### 2.3 Configurer le projet

**Dans la configuration Vercel:**

#### Root Directory
```
frontend
```
⚠️ **IMPORTANT**: Spécifiez `frontend` comme Root Directory!

#### Framework Preset
```
Vite
```

#### Build Command
```
npm run build
```

#### Output Directory
```
dist
```

#### Install Command
```
npm install
```

### 2.4 Ajouter les Variables d'Environnement

**IMPORTANT**: Avant de déployer, ajoutez cette variable:

1. Dans "Environment Variables"
2. Ajoutez:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://votre-backend.onrender.com/api`

⚠️ **Remplacez** `votre-backend.onrender.com` par l'URL réelle de votre backend!

### 2.5 Déployer

1. Cliquez sur "Deploy"
2. Attendez 1-2 minutes
3. ✅ Votre site sera disponible sur: `https://votre-projet.vercel.app`

---

## 🐍 Étape 3: Déployer le Backend Python

### Option A: Render (Recommandé - Gratuit)

#### 3.1 Créer un compte Render

1. Allez sur https://render.com
2. Connectez-vous avec GitHub

#### 3.2 Créer un nouveau Web Service

1. Cliquez sur "New +" → "Web Service"
2. Connectez votre repository GitHub
3. Cliquez sur "Connect"

#### 3.3 Configuration Render

- **Name**: `currency-converter-api`
- **Region**: Choisissez le plus proche
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn -w 4 -b 0.0.0.0:$PORT api:app`

#### 3.4 Variables d'environnement (Optionnel)

Aucune variable requise pour ce projet.

#### 3.5 Déployer

1. Cliquez sur "Create Web Service"
2. Attendez 3-5 minutes
3. ✅ Votre API sera disponible sur: `https://currency-converter-api.onrender.com`

#### 3.6 Installer Gunicorn

**IMPORTANT**: Ajoutez gunicorn dans `backend/requirements.txt`:

```txt
requests>=2.31.0
flask>=3.0.0
flask-cors>=4.0.0
gunicorn>=21.2.0
```

Puis committez et poussez:
```bash
git add backend/requirements.txt
git commit -m "Add gunicorn for production"
git push
```

---

## 🔄 Étape 4: Lier Frontend et Backend

### 4.1 Récupérer l'URL du Backend

Après le déploiement sur Render, copiez l'URL:
```
https://currency-converter-api.onrender.com
```

### 4.2 Mettre à jour Vercel

1. Allez dans votre projet Vercel
2. Settings → Environment Variables
3. Modifiez `VITE_API_URL`:
   ```
   https://currency-converter-api.onrender.com/api
   ```
4. Cliquez sur "Save"
5. Allez dans "Deployments"
6. Cliquez sur "..." → "Redeploy"

---

## ✅ Étape 5: Tester le Déploiement

### 5.1 Tester le Backend

```bash
curl https://currency-converter-api.onrender.com/api/health
```

Devrait retourner:
```json
{
  "status": "healthy",
  "currencies_count": 11,
  ...
}
```

### 5.2 Tester le Frontend

1. Ouvrez `https://votre-projet.vercel.app`
2. Vérifiez que "API Status" est vert (✓ Connected)
3. Testez une conversion: 100 EUR → USD
4. ✅ Tout fonctionne!

---

## 🎯 URLs Finales

- **Frontend React**: `https://votre-projet.vercel.app`
- **Backend API**: `https://currency-converter-api.onrender.com`
- **API Health**: `https://currency-converter-api.onrender.com/api/health`

---

## 🔧 Mises à Jour Automatiques

### Déploiement continu

Chaque fois que vous poussez sur GitHub:
- ✅ Vercel redéploie automatiquement le frontend
- ✅ Render redéploie automatiquement le backend

```bash
git add .
git commit -m "Update: nouvelle fonctionnalité"
git push
```

---

## 🐛 Dépannage

### Backend ne répond pas

1. Vérifiez les logs sur Render
2. Vérifiez que gunicorn est installé
3. Vérifiez la Start Command

### Frontend ne se connecte pas au Backend

1. Vérifiez `VITE_API_URL` dans Vercel
2. Vérifiez les logs du navigateur (F12)
3. Vérifiez que le backend est actif

### Erreur CORS

Vérifiez que `flask-cors` est installé dans le backend:
```bash
pip list | grep flask-cors
```

---

## 📊 Plan Gratuit

### Vercel (Frontend)
- ✅ Bande passante illimitée
- ✅ Déploiements illimités
- ✅ HTTPS automatique
- ✅ Domaine personnalisé gratuit

### Render (Backend)
- ⚠️ 750 heures/mois (suffisant)
- ⚠️ Le service s'endort après 15 min d'inactivité
- ⚠️ Premier démarrage peut prendre 30 secondes
- ✅ HTTPS automatique

---

## 🚀 Partager sur Facebook

Une fois déployé, partagez le lien:

```
https://votre-projet.vercel.app
```

Sur votre page Facebook avec:
- 📸 Screenshot de l'interface
- 💬 Description: "Convertisseur de devises en temps réel - 11 devises"
- 🔗 Lien vers l'application

Les utilisateurs cliquent et utilisent directement le convertisseur!

---

## 💡 Prochaines Étapes

1. **Domaine personnalisé** (optionnel):
   - Acheter un domaine (.com, .fr, etc.)
   - Le lier à Vercel (gratuit)

2. **Analytics** (optionnel):
   - Ajouter Google Analytics
   - Voir combien de personnes utilisent votre convertisseur

3. **PWA** (optionnel):
   - Transformer en Progressive Web App
   - Installer comme application mobile

---

Besoin d'aide? Consultez la documentation:
- Vercel: https://vercel.com/docs
- Render: https://render.com/docs
