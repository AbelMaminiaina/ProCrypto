# Convertisseur de Devises Multi-Monnaies 💱

Convertisseur de devises professionnel avec **backend Python** et **frontend React TypeScript**, supportant **11 devises internationales** avec taux de change en temps réel.

## 🎯 Architecture

- **Backend**: API Flask (Python) avec conversion en temps réel
- **Frontend**: React TypeScript + TailwindCSS
- **APIs**: Frankfurter API + Currency API (gratuites)

## 💱 Devises Supportées

✅ **USD** - Dollar américain / US Dollar
✅ **EUR** - Euro
✅ **GBP** - Livre sterling / British Pound
✅ **JPY** - Yen japonais / Japanese Yen
✅ **CNY** - Yuan chinois / Chinese Yuan
✅ **CAD** - Dollar canadien / Canadian Dollar
✅ **AUD** - Dollar australien / Australian Dollar
✅ **INR** - Roupie indienne / Indian Rupee
✅ **AED** - Dirham des Émirats / UAE Dirham
✅ **SAR** - Riyal saoudien / Saudi Riyal
✅ **MGA** - Ariary malgache / Malagasy Ariary

## 🚀 Installation et Démarrage

### Prérequis

- Python 3.7+
- Node.js 16+ et npm
- Git

### 1️⃣ Installation du Backend Python

```bash
# Installer les dépendances Python
cd ProCrytpo/backend
pip install -r requirements.txt
```

### 2️⃣ Installation du Frontend React

```bash
# Aller dans le dossier frontend
cd frontend

# Installer les dépendances npm
npm install
```

### 3️⃣ Lancer l'application

Vous devez lancer **2 serveurs** en parallèle:

#### Terminal 1 - Backend Python API (Port 5000)

```bash
# Depuis la racine du projet
cd backend
python api.py
```

Vous devriez voir:
```
======================================================================
🚀 API Convertisseur de Devises / Currency Converter API
======================================================================
🌐 Serveur démarré sur http://localhost:5000
```

#### Terminal 2 - Frontend React (Port 3000)

```bash
# Dans le dossier frontend
cd frontend
npm run dev
```

Vous devriez voir:
```
VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
```

### 4️⃣ Accéder à l'application

Ouvrez votre navigateur et allez sur:

**http://localhost:3000**

## 📸 Fonctionnalités

### Interface Web (React + TailwindCSS)

- ✨ Design moderne et responsive
- 💱 Conversion entre toutes les paires de devises
- 📊 Vue de toutes les conversions en un clic
- 🔄 Actualisation des taux en temps réel
- 📱 Compatible mobile et desktop
- ⚡ Indicateur de statut de l'API
- 🕐 Affichage de la dernière mise à jour des taux

### API Backend (Python Flask)

#### Endpoints disponibles:

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/currencies` | Liste des devises |
| GET | `/api/rates` | Tous les taux de change |
| POST | `/api/rates/refresh` | Rafraîchir les taux |
| POST | `/api/convert` | Convertir un montant |
| POST | `/api/convert/all` | Convertir vers toutes les devises |
| GET | `/api/health` | État de l'API |

#### Exemple d'utilisation de l'API:

```bash
# Conversion simple
curl -X POST http://localhost:5000/api/convert \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "from": "EUR", "to": "USD"}'

# Conversion vers toutes les devises
curl -X POST http://localhost:5000/api/convert/all \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "from": "EUR"}'
```

## 📁 Structure du Projet

```
ProCrytpo/
├── backend/                   # Backend Python
│   ├── api.py                # API Flask REST
│   ├── convertisseur.py      # Convertisseur CLI
│   ├── Prix.py               # Exemple de calcul simple
│   ├── requirements.txt      # Dépendances Python
│   ├── test_api.py          # Tests APIs externes
│   ├── test_all_currencies.py # Tests toutes devises
│   ├── test_backend_api.py  # Tests de l'API Flask
│   └── README.md            # Documentation backend
│
├── frontend/                  # Application React
│   ├── src/
│   │   ├── App.tsx           # Composant principal
│   │   ├── main.tsx          # Point d'entrée React
│   │   ├── index.css         # Styles Tailwind
│   │   ├── types/
│   │   │   └── currency.ts   # Types TypeScript
│   │   └── services/
│   │       └── currencyService.ts  # Client API
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── README.md                  # Documentation principale
└── START.md                   # Guide de démarrage rapide
```

## 🔧 Technologies Utilisées

### Backend
- **Python 3**: Langage backend
- **Flask**: Framework web
- **Flask-CORS**: Support CORS pour React
- **Requests**: Appels API externes

### Frontend
- **React 18**: Bibliothèque UI
- **TypeScript**: Typage statique
- **TailwindCSS**: Framework CSS
- **Vite**: Build tool
- **Axios**: Client HTTP

### APIs Externes
- **Frankfurter API**: Taux EUR/USD/GBP/JPY/CNY/CAD/AUD/INR
- **Currency API**: Taux MGA/AED/SAR

## 📊 Taux de Change

Les taux sont récupérés en temps réel depuis:
- **Frankfurter API**: Données de la Banque Centrale Européenne
- **Currency API**: Données open source

Mise à jour:
- Cache: 1 heure
- Rafraîchissement manuel disponible

## 🧪 Tests

### Tester l'API Python

```bash
# Test complet de l'API Flask backend
cd backend
python test_backend_api.py

# Test des APIs externes
cd backend
python test_all_currencies.py
```

### Tester le frontend

Ouvrez http://localhost:3000 dans votre navigateur et testez:
- Conversion simple
- Conversion vers toutes les devises
- Rafraîchissement des taux
- Responsive design (redimensionnez la fenêtre)

## 🐛 Dépannage

### Le backend ne démarre pas

```bash
# Vérifier que Flask est installé
pip list | grep -i flask

# Réinstaller les dépendances
pip install --upgrade -r requirements.txt
```

### Le frontend ne se connecte pas au backend

1. Vérifier que le backend tourne sur http://localhost:5000
2. Vérifier la console du navigateur pour les erreurs CORS
3. Vérifier que `flask-cors` est installé

### Erreur CORS

Si vous voyez des erreurs CORS dans la console:
```bash
# Réinstaller flask-cors
pip install --upgrade flask-cors
```

## 🔐 Sécurité

- Les APIs utilisées sont publiques et gratuites
- Pas de clé API nécessaire
- Mode lecture seule (pas d'écriture de données)
- CORS configuré pour localhost uniquement

## 📝 Licence

Libre d'utilisation pour projets personnels et éducatifs.

## 👨‍💻 Développement

### Ajouter une nouvelle devise

1. Vérifier la disponibilité dans les APIs:
   - Frankfurter: https://www.frankfurter.app/currencies
   - Currency API: https://github.com/fawazahmed0/currency-api

2. Ajouter dans `api.py`:
```python
CURRENCIES = {
    # ...
    'NEW': 'Nom de la devise / Currency Name',
}
```

3. Le frontend se mettra à jour automatiquement!

### Build pour production

```bash
# Frontend
cd frontend
npm run build
# Les fichiers sont dans frontend/dist/

# Backend
# Utiliser gunicorn pour la production
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 api:app
```

## 🎉 Auteurs

Projet de convertisseur de devises avec Python + React

---

**Note**: Les taux de change sont fournis à titre informatif. Pour des transactions financières, consultez toujours votre institution financière.
