# 🚀 Guide de Démarrage Rapide

## Installation (à faire une seule fois)

### 1. Installer les dépendances Python

```bash
cd backend
pip install -r requirements.txt
cd ..
```

### 2. Installer les dépendances React

```bash
cd frontend
npm install
cd ..
```

## Lancer l'application (à chaque utilisation)

### Option 1: Deux terminaux séparés

#### Terminal 1 - Backend Python
```bash
cd backend
python api.py
```
✅ Backend prêt quand vous voyez: `🌐 Serveur démarré sur http://localhost:5000`

#### Terminal 2 - Frontend React
```bash
cd frontend
npm run dev
```
✅ Frontend prêt quand vous voyez: `Local: http://localhost:3000/`

### Option 2: Script automatique (si disponible)

**Windows (PowerShell):**
```powershell
# Créer un fichier start.ps1
Write-Host "Démarrage du backend..."
Start-Process python -ArgumentList "backend/api.py"
Start-Sleep -Seconds 3
Write-Host "Démarrage du frontend..."
cd frontend
npm run dev
```

**Linux/Mac (Bash):**
```bash
# Créer un fichier start.sh
#!/bin/bash
cd backend && python api.py &
cd ../frontend && npm run dev
```

## Accéder à l'application

Une fois les deux serveurs lancés:

🌐 **Ouvrir le navigateur**: http://localhost:3000

## Vérifier que tout fonctionne

1. ✅ Le backend tourne sur le port 5000
2. ✅ Le frontend tourne sur le port 3000
3. ✅ L'indicateur "API Status" est vert (Connected)
4. ✅ Les devises se chargent dans les menus déroulants

## Arrêter l'application

- **Backend**: `Ctrl+C` dans le terminal du backend
- **Frontend**: `Ctrl+C` dans le terminal du frontend

## Problèmes courants

### Erreur "Port already in use"

```bash
# Windows - Tuer le processus sur le port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac - Tuer le processus sur le port 5000
lsof -ti:5000 | xargs kill -9
```

### Erreur "Module not found"

```bash
# Réinstaller les dépendances Python
cd backend
pip install --upgrade -r requirements.txt

# Réinstaller les dépendances npm
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### L'API Status est rouge (Disconnected)

1. Vérifier que le backend Python tourne
2. Vérifier l'URL dans la console du navigateur (F12)
3. Vérifier que flask-cors est installé: `pip list | grep flask-cors`

## Commandes utiles

```bash
# Tester l'API backend
curl http://localhost:5000/api/health

# Voir les logs du frontend
cd frontend && npm run dev

# Build pour production
cd frontend && npm run build
```

Bon développement! 🎉
