# 🔄 CI/CD Pipeline Documentation

## Vue d'ensemble

Ce projet utilise **GitHub Actions** pour l'intégration et le déploiement continus (CI/CD).

## 🚀 Workflows Automatisés

### 1. Frontend CI/CD (`frontend-ci.yml`)

**Déclenché sur:**
- Push sur `main` ou `develop` (uniquement si fichiers frontend modifiés)
- Pull Request vers `main`

**Étapes:**
1. ✅ Checkout du code
2. ✅ Setup Node.js 18
3. ✅ Installation des dépendances (`npm ci`)
4. ✅ Vérification du code (lint)
5. ✅ Build de l'application
6. ✅ Notification de déploiement Vercel

**Résultat:** Si le build réussit, Vercel déploie automatiquement.

---

### 2. Backend CI/CD (`backend-ci.yml`)

**Déclenché sur:**
- Push sur `main` ou `develop` (uniquement si fichiers backend modifiés)
- Pull Request vers `main`

**Étapes:**
1. ✅ Checkout du code
2. ✅ Setup Python (3.9, 3.10, 3.11)
3. ✅ Installation des dépendances
4. ✅ Lint avec flake8
5. ✅ Exécution des tests
6. ✅ Notification de déploiement Render

**Résultat:** Si les tests passent, Render déploie automatiquement.

---

### 3. Full CI Pipeline (`full-ci.yml`)

**Déclenché sur:**
- Tous les push sur `main`
- Toutes les Pull Request vers `main`

**Jobs parallèles:**
1. 🎨 **Frontend**: Type check + Build
2. 🐍 **Backend**: Lint + Tests
3. 🚀 **Deploy Status**: Notification si tout passe

**Résultat:** Statut global de santé du projet.

---

## 📊 Status Badges

Ajoutez ces badges dans votre README.md:

```markdown
![Frontend CI](https://github.com/VOTRE_USERNAME/ProCrytpo/workflows/Frontend%20CI/CD/badge.svg)
![Backend CI](https://github.com/VOTRE_USERNAME/ProCrytpo/workflows/Backend%20CI/CD/badge.svg)
![Full CI](https://github.com/VOTRE_USERNAME/ProCrytpo/workflows/Full%20CI/CD%20Pipeline/badge.svg)
```

---

## 🔧 Configuration Locale

### Tester le build localement

#### Frontend
```bash
cd frontend
npm run type-check  # Vérification TypeScript
npm run build       # Build production
```

#### Backend
```bash
cd backend
flake8 .           # Lint Python
python test_all_currencies.py  # Tests
```

---

## 🚨 Que faire si le CI échoue?

### Frontend Build Failed

1. **Erreur TypeScript:**
   ```bash
   cd frontend
   npm run type-check
   ```
   Corrigez les erreurs TypeScript affichées.

2. **Erreur de Build:**
   ```bash
   cd frontend
   npm run build
   ```
   Vérifiez les imports et dépendances.

### Backend Tests Failed

1. **Lint Failed:**
   ```bash
   cd backend
   flake8 . --show-source
   ```
   Corrigez les erreurs de syntaxe.

2. **Tests Failed:**
   ```bash
   cd backend
   python test_all_currencies.py
   ```
   Vérifiez la connexion aux APIs.

---

## 🔐 Secrets GitHub

### Secrets requis (optionnel)

Pour des configurations avancées, ajoutez dans **Settings → Secrets**:

| Secret | Description |
|--------|-------------|
| `VITE_API_URL` | URL de l'API backend en production |

---

## 📋 Checklist avant Push

- [ ] Code formaté et sans erreurs TypeScript
- [ ] Backend lint passe (`flake8`)
- [ ] Build local réussit (`npm run build`)
- [ ] Tests backend passent
- [ ] Commit message clair

---

## 🎯 Workflow de Développement

### 1. Créer une branche

```bash
git checkout -b feature/ma-nouvelle-fonctionnalite
```

### 2. Développer et tester localement

```bash
# Frontend
cd frontend
npm run dev
npm run build  # Tester le build

# Backend
cd backend
python api.py
python test_all_currencies.py
```

### 3. Commit et Push

```bash
git add .
git commit -m "feat: ajouter nouvelle fonctionnalité"
git push origin feature/ma-nouvelle-fonctionnalite
```

### 4. Créer une Pull Request

- Le CI s'exécute automatiquement
- Vérifiez que tous les checks passent ✅
- Mergez dans `main`

### 5. Déploiement Automatique

- Vercel déploie le frontend
- Render déploie le backend
- ✅ En production en quelques minutes!

---

## 📈 Métriques CI/CD

### Temps d'exécution moyen

| Workflow | Durée |
|----------|-------|
| Frontend CI | ~2 min |
| Backend CI | ~3 min |
| Full CI | ~4 min |

### Taux de succès

Objectif: **> 95%** de builds réussis

---

## 🔄 Auto-Déploiement

### Vercel (Frontend)

- ✅ Auto-déploie sur chaque push vers `main`
- ✅ Déploiements preview sur chaque PR
- ✅ HTTPS automatique
- ✅ Cache CDN global

### Render (Backend)

- ✅ Auto-déploie sur chaque push vers `main`
- ✅ Health checks automatiques
- ✅ Rollback en cas d'erreur
- ✅ HTTPS automatique

---

## 💡 Bonnes Pratiques

1. **Toujours tester localement** avant de push
2. **Petits commits fréquents** plutôt que gros commits
3. **Messages de commit clairs**:
   - `feat:` pour nouvelles fonctionnalités
   - `fix:` pour corrections de bugs
   - `docs:` pour documentation
   - `refactor:` pour refactoring
4. **Une Pull Request = Une fonctionnalité**
5. **Vérifier le CI avant de merger**

---

## 📚 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Deployment](https://vercel.com/docs)
- [Render Deployment](https://render.com/docs)

---

## 🐛 Troubleshooting

### Le workflow ne se déclenche pas

1. Vérifiez que les fichiers sont dans le bon path
2. Vérifiez la branche (`main` vs `master`)
3. Vérifiez les permissions GitHub Actions

### Build réussit localement mais échoue dans CI

1. Vérifiez les versions Node/Python
2. Vérifiez les variables d'environnement
3. Regardez les logs détaillés dans Actions

### Déploiement échoue malgré CI vert

1. Vérifiez les logs Vercel/Render
2. Vérifiez les variables d'environnement
3. Vérifiez les secrets configurés

---

Bon développement! 🚀
