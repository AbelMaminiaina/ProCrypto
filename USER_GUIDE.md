# 📖 ProCrypto - Guide Utilisateur

## 🎯 Bienvenue sur ProCrypto

ProCrypto est une application complète de suivi de cryptomonnaies et de conversion de devises avec un modèle freemium.

---

## ✨ Fonctionnalités

### 💱 Convertisseur de Devises (Gratuit)
- Conversion entre 11 devises mondiales
- Taux de change en temps réel via l'API Fixer
- Support de l'Ariary Malgache (MGA)
- Conversion multiple instantanée

### ₿ Tracker Crypto (Modèle Freemium)

#### Mode Gratuit (Sans Connexion)
- 📊 **10 cryptomonnaies basiques** disponibles
- 💹 **Prix en temps réel** (USD, EUR, MGA)
- 📈 **Graphiques historiques** détaillés
- 🔍 **Détails complets** (market cap, volume, ATH/ATL, supply)

#### Mode Premium (Avec Connexion)
- 🚀 **50 cryptomonnaies** principales du marché
- 💼 **Portfolio personnel** avec tracking P/L
- 📝 **Historique transactions** (achats/ventes)
- 🔔 **Alertes de prix** avec notifications navigateur
- 📊 **Métriques de performance** détaillées

---

## 🚀 Démarrage Rapide

### Installation

#### Prérequis
- Node.js 18+ et npm
- Python 3.8+
- Git

#### 1. Cloner le dépôt
```bash
git clone https://github.com/votre-username/ProCrypto.git
cd ProCrypto
```

#### 2. Installer le Backend
```bash
cd backend
pip install -r requirements.txt
python api.py
```
Le backend démarre sur `http://localhost:5000`

#### 3. Installer le Frontend
```bash
cd frontend
npm install
npm run dev
```
Le frontend démarre sur `http://localhost:3000` (ou port alternatif)

#### 4. Accéder à l'application
Ouvrez votre navigateur: `http://localhost:3000`

---

## 📱 Utilisation

### Navigation

**Menu Principal:**
- 💱 **Currency Converter** - Convertisseur de devises
- ₿ **Crypto Portfolio** - Tracker crypto
- 🔐 **Login / Register** - Authentification

### Convertisseur de Devises

1. Sélectionnez la devise source (ex: EUR)
2. Sélectionnez la devise cible (ex: USD)
3. Entrez le montant
4. Le résultat s'affiche instantanément
5. Utilisez "Convertir en tout" pour voir toutes les devises

**Raccourci:** Bouton "Rafraîchir" pour actualiser les taux

### Portfolio Crypto

#### Mode Gratuit
1. Allez sur **Crypto Portfolio**
2. Consultez les **10 cryptos basiques** disponibles
3. Cliquez sur "📊 Voir détails" pour:
   - Graphiques interactifs (1j, 7j, 30j, 90j, 1an)
   - Market cap, volume, ATH/ATL
   - Performance multi-périodes
   - Description et liens officiels

**Message freemium:** Un bandeau vous invite à vous connecter pour accéder aux 50 cryptos et fonctionnalités premium.

#### Mode Premium (Connecté)

##### 1. S'inscrire / Se connecter
- Cliquez sur "🔐 Se connecter"
- Créez un compte ou connectez-vous
- Email + mot de passe (min. 8 caractères)

##### 2. Gérer votre Portfolio
- **Vue Portfolio:** Voir vos holdings personnels
  - Quantité détenue
  - Prix d'achat moyen
  - Valeur actuelle
  - Profit/Loss (en $ et %)
- **Vue Marché:** Voir toutes les 50 cryptos disponibles

**Ajouter une crypto:**
1. Cliquez sur "➕ Ajouter Crypto"
2. Sélectionnez la crypto dans la liste
3. Entrez la quantité
4. Entrez le prix d'achat (USD)
5. Validez

**Supprimer une crypto:**
- Cliquez sur l'icône poubelle 🗑️ dans votre portfolio

##### 3. Historique Transactions
Menu: **Crypto Portfolio → Transactions**

- Vue complète de vos achats/ventes
- Métriques:
  - Total investi
  - Valeur actuelle
  - ROI global
  - Meilleur/pire trade
- Filtrage par crypto
- Tri par date/montant

**Ajouter une transaction:**
1. Bouton "➕ Nouvelle Transaction"
2. Type: Achat ou Vente
3. Sélectionnez la crypto
4. Quantité et prix unitaire
5. Date et notes (optionnel)

##### 4. Alertes de Prix
Menu: **Crypto Portfolio → Alertes**

**Créer une alerte:**
1. Bouton "➕ Créer Alerte"
2. Sélectionnez la crypto
3. Prix cible (USD)
4. Condition: "Au-dessus de" ou "En-dessous de"
5. Validez

**Notifications:**
- Permission demandée au premier accès
- Notification navigateur quand l'alerte se déclenche
- L'alerte passe en statut "Déclenchée"

**Gestion:**
- Activer/Désactiver une alerte
- Supprimer une alerte
- Voir toutes les alertes actives et historique

---

## 🎨 Interface Utilisateur

### Thème
- Design moderne avec dégradés bleu/violet
- Cards avec ombre et hover effects
- Responsive (mobile, tablette, desktop)

### Composants Clés

**CryptoCard:**
- Logo et nom de la crypto
- Prix en USD, EUR, MGA
- Badge variation 24h (vert/rouge)
- Market cap
- Bouton "Voir détails"

**Graphique Prix:**
- Bibliothèque Recharts
- Ligne interactive
- Tooltip avec prix exact
- Sélecteur de période

**Portfolio Summary:**
- Valeur totale du portfolio
- Total investi
- P/L global (couleur verte/rouge)
- Nombre de holdings

### États de Chargement
- Spinners pour chargement initial
- Lazy loading des pages
- Messages d'erreur clairs
- Boutons "Réessayer" en cas d'échec

---

## 🔒 Sécurité & Confidentialité

### Authentification
- **JWT Tokens** (JSON Web Tokens)
- Access token: 1 heure de validité
- Refresh token: 30 jours
- Mots de passe hashés avec bcrypt

### Stockage des Données
- **Backend:** SQLite (portfolio, transactions, alertes liés à l'utilisateur)
- **Tokens:** localStorage (auto-suppression à la déconnexion)
- Pas de partage de données avec des tiers

### Bonnes Pratiques
- Validation des inputs côté client ET serveur
- Protection CORS configurée
- Rate limiting API pour éviter abus
- XSS protection (sanitization)

---

## 🌐 APIs Utilisées

### CoinGecko API (Free Tier)
- **Prix crypto en temps réel**
- **Market data** (cap, volume, ATH/ATL)
- **Historique prix** (jusqu'à 1 an)
- **Limite:** ~10-50 appels/minute (rate limiting géré automatiquement)

### Fixer API
- **Taux de change** pour devises fiat
- Base EUR avec conversion vers USD, GBP, JPY, CNY, etc.

---

## ❓ FAQ

### Comment accéder aux 50 cryptos ?
Créez un compte gratuit via "Se connecter → S'inscrire". L'accès aux 50 cryptos est immédiat après connexion.

### Les données sont-elles sauvegardées ?
Oui, votre portfolio, transactions et alertes sont sauvegardés dans la base de données backend et liés à votre compte.

### Puis-je utiliser l'app hors connexion ?
Non, ProCrypto nécessite une connexion internet pour récupérer les prix en temps réel.

### Les prix sont-ils vraiment en temps réel ?
Les prix sont rafraîchis automatiquement toutes les 60 secondes. Vous pouvez forcer un refresh manuel.

### Pourquoi "Limite d'API atteinte" ?
CoinGecko (version gratuite) limite les appels. Attendez 10-20 secondes puis réessayez. Le système gère automatiquement le rate limiting.

### Comment recevoir les notifications d'alertes ?
Autorisez les notifications dans votre navigateur quand demandé. Les alertes fonctionnent même si l'onglet est en arrière-plan.

### Puis-je exporter mes données ?
Actuellement, pas d'export automatique. Feature prévue dans une prochaine version (JSON/CSV).

### L'application est-elle gratuite ?
Oui, ProCrypto est 100% gratuit. Le modèle freemium donne accès limité sans compte, et accès complet avec un compte gratuit.

---

## 🐛 Résolution de Problèmes

### "Erreur de connexion à l'API"
- Vérifiez que le backend tourne sur port 5000
- Vérifiez votre connexion internet
- Redémarrez backend et frontend

### "CORS Policy Error"
- Le frontend et backend doivent tourner sur les ports configurés
- Vérifiez `.env.local` dans frontend

### "Graphiques ne chargent pas"
- Erreur rate limiting CoinGecko possible
- Attendez 10-20 secondes
- Cliquez sur "Réessayer"

### "Notifications ne fonctionnent pas"
- Vérifiez les permissions navigateur (Paramètres → Notifications)
- Chrome, Firefox, Edge: ✅ Support complet
- Safari: ⚠️ Support limité

### "Mot de passe oublié"
Actuellement pas de système de récupération. Créez un nouveau compte si nécessaire.

---

## 🚀 Déploiement Production

### Backend (Render)
1. Push code sur GitHub
2. Créez un Web Service sur Render
3. Configurez variables d'environnement:
   - `JWT_SECRET_KEY`
   - `ALLOWED_ORIGINS`
4. Déploiement automatique

### Frontend (Vercel)
1. Push code sur GitHub
2. Importez le projet sur Vercel
3. Configurez:
   - Root Directory: `frontend`
   - `VITE_API_URL`: URL backend Render
4. Déploiement automatique

**Voir:** `DEPLOYMENT.md` et `CI-CD.md` pour détails complets

---

## 🤝 Support & Contribution

### Rapporter un Bug
Ouvrez une issue sur GitHub avec:
- Description du problème
- Steps to reproduce
- Screenshots si applicable
- Console errors (F12)

### Suggestions de Features
- Issues GitHub avec label "enhancement"
- Décrivez le cas d'usage

### Contributions
Pull requests bienvenues! Consultez le code existant pour le style.

---

## 📜 Licence

MIT License - Libre d'utilisation, modification et distribution.

---

## 🙏 Remerciements

- **CoinGecko** pour l'API crypto gratuite
- **Fixer.io** pour les taux de change
- **React** et **Flask** communities
- **Recharts** pour les graphiques

---

**Version:** 1.0.0
**Dernière mise à jour:** 2026-01-05

Bon trading! 🚀📈
