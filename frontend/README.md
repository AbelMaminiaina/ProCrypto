# Frontend React - Convertisseur de Devises

Interface web moderne pour le convertisseur de devises multi-monnaies.

## 🛠️ Technologies

- React 18
- TypeScript
- TailwindCSS
- Vite
- Axios

## 🚀 Développement Local

```bash
# Installation
npm install

# Lancer le serveur de développement
npm run dev

# Ouvrir http://localhost:3000
```

## 🌐 Configuration

### Variables d'environnement

Créez un fichier `.env.local`:

```env
VITE_API_URL=http://localhost:5000/api
```

Pour la production, configurez sur Vercel:
```env
VITE_API_URL=https://votre-backend.onrender.com/api
```

## 📦 Build pour Production

```bash
npm run build
```

Les fichiers de production seront dans `dist/`

## 🚀 Déploiement sur Vercel

### Via l'interface Vercel

1. Importez le projet GitHub
2. Root Directory: `frontend`
3. Framework: `Vite`
4. Ajoutez la variable `VITE_API_URL`
5. Déployez!

### Via CLI Vercel

```bash
npm install -g vercel
vercel --prod
```

## 🎨 Fonctionnalités

- ✨ Interface moderne et responsive
- 💱 Conversion entre 11 devises
- 📊 Vue de toutes les conversions
- 🔄 Rafraîchissement des taux
- 📱 Compatible mobile
- ⚡ Indicateur de statut API
- 🌐 Bilingue (FR/EN)

## 🔧 Structure

```
src/
├── App.tsx              # Composant principal
├── main.tsx             # Point d'entrée
├── index.css            # Styles Tailwind
├── types/
│   └── currency.ts      # Types TypeScript
└── services/
    └── currencyService.ts  # Client API
```

## 📝 Scripts

- `npm run dev` - Serveur de développement
- `npm run build` - Build production
- `npm run preview` - Prévisualiser le build

## 🐛 Dépannage

### Le frontend ne se connecte pas au backend

1. Vérifiez `VITE_API_URL` dans `.env.local`
2. Vérifiez que le backend tourne sur le port 5000
3. Vérifiez la console du navigateur (F12)

### Erreur au build

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📚 Documentation

Voir [DEPLOYMENT.md](../DEPLOYMENT.md) pour le guide de déploiement complet.
