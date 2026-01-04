# Backend Python - Convertisseur de Devises

Backend API Flask pour le convertisseur de devises multi-monnaies.

## 📁 Fichiers

- **api.py** - API Flask REST (port 5000)
- **convertisseur.py** - Convertisseur CLI en ligne de commande
- **Prix.py** - Exemple simple de calcul de prix
- **requirements.txt** - Dépendances Python
- **test_api.py** - Tests de base des APIs externes
- **test_all_currencies.py** - Tests complets de toutes les devises
- **test_backend_api.py** - Tests de l'API Flask backend

## 🚀 Installation

```bash
cd backend
pip install -r requirements.txt
```

## 🔧 Lancer l'API Backend

```bash
cd backend
python api.py
```

L'API sera disponible sur: **http://localhost:5000**

## 🧪 Tester l'API

### Tests complets

```bash
cd backend
python test_backend_api.py
```

### Tests des APIs externes

```bash
cd backend
python test_all_currencies.py
```

### Test de santé de l'API

```bash
curl http://localhost:5000/api/health
```

## 📡 Endpoints de l'API

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/health` | État de l'API |
| GET | `/api/currencies` | Liste des devises |
| GET | `/api/rates` | Tous les taux de change |
| POST | `/api/rates/refresh` | Rafraîchir les taux |
| POST | `/api/convert` | Convertir un montant |
| POST | `/api/convert/all` | Convertir vers toutes les devises |

## 💱 Utiliser le convertisseur CLI

```bash
cd backend
python convertisseur.py
```

Interface interactive en ligne de commande.

## 🔐 Sécurité

- CORS activé pour le frontend React (localhost:3000)
- APIs externes publiques et gratuites
- Pas de stockage de données sensibles

## 🐍 Technologies

- Python 3.7+
- Flask 3.0+
- Flask-CORS 4.0+
- Requests 2.31+

## 📊 Devises supportées

11 devises: USD, EUR, GBP, JPY, CNY, CAD, AUD, INR, AED, SAR, MGA
