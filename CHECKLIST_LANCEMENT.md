# ✅ Checklist de Lancement - ProCrypto

## 🎯 Guide complet pour mettre en production votre site en toute légalité

**Dernière mise à jour** : 5 Janvier 2026
**Temps estimé total** : 2-12 semaines selon le niveau de conformité choisi

---

## 📊 Trois niveaux de conformité

### 🟡 Niveau 1 : Lancement Rapide (1-2 semaines)
**Risque** : Moyen - Protection minimale
**Coût** : Gratuit
**Recommandé pour** : Test initial, MVP, audience limitée

### 🟠 Niveau 2 : Conformité Standard (4-6 semaines)
**Risque** : Faible - Protection correcte
**Coût** : 200,000 - 500,000 Ar
**Recommandé pour** : Lancement public, croissance modérée

### 🟢 Niveau 3 : Conformité Complète (8-12 semaines)
**Risque** : Très faible - Protection maximale
**Coût** : 1,000,000 - 3,000,000 Ar
**Recommandé pour** : Service professionnel, monétisation future

---

## 🟡 NIVEAU 1 : LANCEMENT RAPIDE

### Phase A : Configuration technique (2-3 jours)

#### 1. Informations légales obligatoires
- [ ] **Compléter `frontend/src/pages/LegalNoticePage.tsx`**
  - [ ] Remplacer `[À COMPLÉTER - Votre nom/entreprise]`
  - [ ] Remplacer `[À COMPLÉTER - Votre adresse]`
  - [ ] Remplacer `[À COMPLÉTER - Votre email de contact]`
  - [ ] Remplacer `[À COMPLÉTER - Nom de votre hébergeur]`
  - [ ] Dater la dernière mise à jour

- [ ] **Créer un email de contact professionnel**
  - Format recommandé : contact@procrypto.mg ou support@procrypto.mg
  - Alternative : Gmail/Outlook dédié au projet
  - Vérifier régulièrement (obligation légale de répondre)

#### 2. Vérification des disclaimers
- [ ] **Page Taux de crédit** : Banner jaune visible ✅ (déjà fait)
- [ ] **Banner Beta** : Visible en haut de page ✅ (déjà fait)
- [ ] **Footer** : Avertissements présents ✅ (déjà fait)

#### 3. Sécurité de base
- [ ] **HTTPS activé** (SSL/TLS)
  - Si Vercel/Netlify : Automatique ✅
  - Si hébergeur perso : Installer Let's Encrypt

- [ ] **Mots de passe chiffrés**
  - Vérifier que bcrypt/argon2 est utilisé
  - Ne JAMAIS stocker en clair

- [ ] **Variables d'environnement sécurisées**
  - Clés API dans .env (pas dans le code)
  - .env dans .gitignore ✅

#### 4. Tests fonctionnels
- [ ] Tester toutes les pages (pas d'erreurs)
- [ ] Vérifier responsive mobile
- [ ] Tester création de compte / connexion
- [ ] Vérifier que les simulations calculent correctement
- [ ] Tester tous les liens (pas de 404)

### Phase B : Lancement Beta (1 jour)

- [ ] **Activer le banner Beta** ✅ (déjà fait)
- [ ] **Limiter l'audience**
  - Partager uniquement avec amis/famille
  - Groupes fermés (éviter publicité massive)

- [ ] **Monitoring de base**
  - Google Analytics (optionnel)
  - Logs d'erreurs (Sentry, LogRocket)

### Phase C : Communication prudente

- [ ] **Message type à partager** :
  ```
  🚀 ProCrypto Beta - Outils financiers pour Madagascar

  En test : Calculateurs de salaire, comparateur de taux bancaires,
  simulateur de transport maritime et plus.

  ⚠️ Version Beta - Informations indicatives uniquement.
  Mise en conformité légale en cours.

  [VOTRE_URL]
  ```

- [ ] **NE PAS faire** :
  - ❌ Publicité payante (Facebook Ads, Google Ads)
  - ❌ Communiqués de presse
  - ❌ Partenariats avec banques
  - ❌ Collecter des demandes de crédit

**🎉 Vous pouvez lancer en Beta !**
**⏱️ Temps total : 1-2 semaines**

---

## 🟠 NIVEAU 2 : CONFORMITÉ STANDARD

### Tout le Niveau 1 + les étapes suivantes :

### Phase D : Démarches administratives (4-6 semaines)

#### 5. Lettre à la Banque Centrale de Madagascar
- [ ] **Remplir le modèle** `LETTRE_BCM_MODELE.md`
  - [ ] Compléter toutes les sections [EN MAJUSCULES]
  - [ ] Dater et signer
  - [ ] Préparer les annexes (captures d'écran, mentions légales)

- [ ] **Envoyer par recommandé avec AR**
  - Adresse : BCM, Avenue de l'Indépendance, Antananarivo
  - Conserver l'accusé de réception
  - Coût : ~5,000 Ar

- [ ] **Optionnel mais recommandé** : Email à info@banky-foiben.mg
  - Joindre la lettre en PDF
  - Demander confirmation de réception

- [ ] **Suivi**
  - Noter date d'envoi : _____/_____/_____
  - Numéro recommandé : ___________________
  - Relance si pas de réponse après 1 mois

#### 6. Déclaration CNIL Madagascar
- [ ] **Préparer le dossier** selon `GUIDE_DECLARATION_CNIL_MADAGASCAR.md`
  - [ ] Remplir formulaire de déclaration
  - [ ] Rassembler pièces justificatives :
    - [ ] Copie CIN/Passeport
    - [ ] NIF/STAT (si entreprise)
    - [ ] Politique de confidentialité imprimée
    - [ ] Captures d'écran mentions légales

- [ ] **Déposer la déclaration**
  - Option A : Dépôt physique au Ministère Communication
  - Option B : Envoi recommandé avec AR
  - Coût estimé : 50,000 - 200,000 Ar

- [ ] **Obtenir le récépissé**
  - Délai : 1-3 mois
  - Conserver précieusement
  - Numéro de déclaration : ___________________

- [ ] **Mettre à jour les mentions légales**
  - Ajouter : "Déclaration CNIL n°XXXXX du JJ/MM/AAAA"

#### 7. Vérification des sources bancaires
- [ ] **Documenter les sources** des taux affichés
  - [ ] BNI Madagascar : URL source _____________________
  - [ ] BOA Madagascar : URL source _____________________
  - [ ] BFV-SG : URL source _____________________
  - [ ] Accès Banque : URL source _____________________
  - [ ] BMOI : URL source _____________________
  - [ ] PAOSITRA MALAGASY : URL source _____________________

- [ ] **Prendre captures d'écran** des pages sources (preuve)
- [ ] **Dater les informations** : "Taux au JJ/MM/AAAA"
- [ ] **Planifier mise à jour** : Tous les 1-3 mois minimum

#### 8. Politique de confidentialité détaillée
- [ ] **Créer une page dédiée** `/privacy-policy`
- [ ] Détailler :
  - Quelles données collectées
  - Pourquoi (finalités)
  - Combien de temps conservées
  - Droits des utilisateurs (accès, rectification, suppression)
  - Comment exercer ces droits
  - Coordonnées du responsable de traitement

- [ ] **Lien visible** dans le footer et lors de l'inscription

### Phase E : Renforcement technique

#### 9. Sécurité renforcée
- [ ] **Authentification à deux facteurs** (optionnel mais recommandé)
- [ ] **Rate limiting** (limitation tentatives de connexion)
- [ ] **Protection CSRF**
- [ ] **Headers de sécurité** (CSP, X-Frame-Options, etc.)
- [ ] **Backups automatiques** (quotidiens)

#### 10. Monitoring et logs
- [ ] **Logs de sécurité**
  - Connexions/déconnexions
  - Tentatives échouées
  - Modifications de données

- [ ] **Alertes automatiques**
  - Erreurs serveur
  - Tentatives d'intrusion
  - Downtime

### Phase F : Consultation juridique

#### 11. Validation par un avocat
- [ ] **Trouver un avocat** spécialisé droit numérique/affaires
  - Ordre des Avocats d'Antananarivo : +261 20 22 207 25
  - Budget : 200,000 - 500,000 Ar pour consultation

- [ ] **Faire réviser** :
  - [ ] Mentions légales
  - [ ] Politique de confidentialité
  - [ ] Disclaimers
  - [ ] Lettre BCM
  - [ ] Déclaration CNIL

- [ ] **Obtenir avis écrit** (conservation 5 ans)

**🎉 Vous êtes conforme niveau standard !**
**⏱️ Temps total : 4-6 semaines**
**💰 Coût total : 200,000 - 700,000 Ar**

---

## 🟢 NIVEAU 3 : CONFORMITÉ COMPLÈTE

### Tout le Niveau 2 + les étapes suivantes :

### Phase G : Structure juridique professionnelle

#### 12. Création d'entreprise (si pas déjà fait)
- [ ] **Choix de la forme juridique**
  - SARL (Société à Responsabilité Limitée) - Recommandé
  - EURL (Entreprise Unipersonnelle à Responsabilité Limitée)
  - SA (Société Anonyme) - Si gros projet

- [ ] **Enregistrement EDBM**
  - Site : www.edbm.gov.mg
  - Délai : 2-4 semaines
  - Coût : 100,000 - 300,000 Ar

- [ ] **Obtention NIF, STAT, RCS**
  - NIF (Numéro d'Identification Fiscale)
  - STAT (Statistique)
  - RCS (Registre Commerce et Sociétés)

#### 13. Assurances professionnelles
- [ ] **RC Professionnelle** (Responsabilité Civile)
  - Couverture : Préjudices causés aux tiers
  - Coût annuel : 500,000 - 2,000,000 Ar
  - Compagnies : ARO, ALLIANZ Madagascar, HAVANA, etc.

- [ ] **Cyber-assurance** (optionnel)
  - Couverture : Violation de données, cyberattaques
  - Coût annuel : 1,000,000+ Ar

#### 14. Conformité fiscale
- [ ] **Déclaration d'existence** auprès des impôts
- [ ] **TVA** (si revenus futurs > seuil)
- [ ] **IR/IS** (Impôt sur Revenus/Sociétés)
- [ ] **Tenir une comptabilité** (obligatoire si entreprise)

### Phase H : Optimisation et automatisation

#### 15. Mise à jour automatique des données
- [ ] **API bancaires** (si disponibles)
- [ ] **Web scraping légal** (avec accord)
- [ ] **Notification d'obsolescence** (si données > 3 mois)

#### 16. Processus de traitement des demandes utilisateurs
- [ ] **Formulaire de contact** opérationnel
- [ ] **Procédure d'exercice des droits RGPD**
  - Délai de réponse : 30 jours max
  - Email dédié : dpo@procrypto.mg (Data Protection Officer)
  - Template de réponse

- [ ] **Registre des demandes** (obligation légale)

#### 17. Audits réguliers
- [ ] **Audit de sécurité** (tous les 6 mois)
  - Pentest (test d'intrusion)
  - Revue du code
  - Scan de vulnérabilités

- [ ] **Audit de conformité** (annuel)
  - Vérification CNIL
  - Mise à jour mentions légales
  - Revue des sources de données

### Phase I : Préparation à la croissance

#### 18. CGU (Conditions Générales d'Utilisation)
- [ ] Rédiger CGU complètes
- [ ] Validation avocat
- [ ] Acceptation obligatoire lors inscription

#### 19. Partenariats officiels (si souhaité)
- [ ] **Contacter l'APB** (Association Professionnelle des Banques)
  - Informer de l'existence du comparateur
  - Proposer partenariat gagnant-gagnant
  - Obtenir accord écrit

- [ ] **Contacter les banques individuellement**
  - Proposer référencement officiel
  - Vérifier autorisation utilisation logo
  - Accord de mise à jour des données

#### 20. Monétisation (si applicable)
- [ ] **Modèle économique défini**
  - Publicité (Google Ads) - Nécessite conformité fiscale
  - Abonnement Premium - Nécessite paiement en ligne sécurisé
  - Affiliation banques - Nécessite licence de courtier ⚠️

- [ ] **Déclaration fiscale** adaptée au modèle

**🏆 Vous êtes en conformité professionnelle complète !**
**⏱️ Temps total : 8-12 semaines**
**💰 Coût total : 1,000,000 - 3,000,000 Ar**

---

## 📅 Planning recommandé

### Semaine 1-2 : Niveau 1 (Lancement Beta)
- Jours 1-3 : Configuration technique
- Jours 4-5 : Tests
- Jours 6-7 : Lancement Beta restreint

### Semaine 3-6 : Niveau 2 (Conformité Standard)
- Semaine 3 : Préparation et envoi lettre BCM
- Semaine 4 : Préparation dossier CNIL
- Semaine 5 : Dépôt CNIL + Consultation avocat
- Semaine 6 : Corrections et finalisation

### Semaine 7-12 : Niveau 3 (Conformité Complète)
- Semaine 7-8 : Création entreprise
- Semaine 9 : Assurances
- Semaine 10-11 : Optimisations techniques
- Semaine 12 : Audits et lancement public

---

## 🚨 Points de vigilance CRITIQUE

### ❌ NE JAMAIS faire (risque juridique majeur)

1. **Collecter des demandes de crédit** sans agrément courtier
2. **Percevoir une commission** des banques sans licence
3. **Garantir l'obtention d'un crédit** ou d'un taux
4. **Stocker des données bancaires** (CB, comptes)
5. **Donner des conseils financiers personnalisés** sans habilitation
6. **Utiliser logos de banques** sans autorisation (si contesté, retirer immédiatement)
7. **Promettre des gains** en crypto
8. **Faciliter l'achat/vente** de crypto sans licence

### ⚠️ Zones grises à surveiller

1. **Affiliation bancaire** : Demander avis juridique avant
2. **Publicité ciblée** : Respecter consentement cookies
3. **Newsletter** : Opt-in obligatoire
4. **Données sensibles** : JAMAIS collecter religion, santé, opinions politiques

---

## 📞 Contacts d'urgence

### En cas de problème juridique
- **Avocat d'affaires** : [À COMPLÉTER - Votre avocat]
- **Ordre des Avocats Antananarivo** : +261 20 22 207 25

### En cas de violation de données
- **CNIL Madagascar** : Via Ministère Communication
- **Hébergeur** : [Contact support hébergeur]
- **Utilisateurs concernés** : Notification dans les 72h (OBLIGATOIRE)

### En cas de plainte utilisateur
1. Répondre dans les 48h (email)
2. Traiter le problème rapidement
3. Documenter l'échange
4. Escalader à l'avocat si nécessaire

---

## ✅ Checklist finale avant lancement public

### Documentation
- [ ] Mentions légales 100% complètes
- [ ] Politique de confidentialité publiée
- [ ] CGU disponibles
- [ ] Email de contact opérationnel
- [ ] Numéro de déclaration CNIL affiché (si obtenu)

### Technique
- [ ] HTTPS actif
- [ ] Backups configurés
- [ ] Monitoring en place
- [ ] Tests de charge effectués
- [ ] Mobile responsive

### Juridique
- [ ] Lettre BCM envoyée (AR conservé)
- [ ] Déclaration CNIL déposée (récépissé conservé)
- [ ] Avocat consulté (avis écrit conservé)
- [ ] Assurance RC Pro active (si Niveau 3)
- [ ] Entreprise enregistrée (si Niveau 3)

### Contenu
- [ ] Tous les taux vérifiés et sourcés
- [ ] Disclaimers visibles sur pages sensibles
- [ ] Banner Beta actif (si pas encore 100% conforme)
- [ ] Liens footer fonctionnels
- [ ] Pas d'erreurs 404

### Communication
- [ ] Message de lancement rédigé
- [ ] Plan de communication défini
- [ ] Réseaux sociaux créés (optionnel)
- [ ] Google Analytics configuré (optionnel)

---

## 🎯 Recommandation finale

**Pour la majorité des utilisateurs, nous recommandons :**

1. **Démarrer en Niveau 1 (Beta)** : 1-2 semaines
   - Tester le concept
   - Recueillir premiers retours
   - Coût : Gratuit

2. **Passer au Niveau 2 (Standard)** : Dès que possible
   - Conformité légale correcte
   - Protection juridique
   - Coût : 200,000 - 700,000 Ar

3. **Évoluer vers Niveau 3 (Complet)** : Si succès
   - Professionnalisation
   - Monétisation possible
   - Coût : 1,000,000 - 3,000,000 Ar

---

## 📊 Tableau récapitulatif

| Niveau | Délai | Coût | Risque | Recommandé pour |
|--------|-------|------|--------|-----------------|
| 🟡 **Niveau 1 Beta** | 1-2 sem. | Gratuit | Moyen | Test initial, MVP |
| 🟠 **Niveau 2 Standard** | 4-6 sem. | 200-700K Ar | Faible | Lancement public |
| 🟢 **Niveau 3 Complet** | 8-12 sem. | 1-3M Ar | Très faible | Service professionnel |

---

## 💡 Conseils d'expert

1. **Ne pas sous-estimer** les démarches administratives à Madagascar (délais longs)
2. **Documenter tout** : courriers, emails, récépissés (preuve en cas de litige)
3. **Consulter un avocat** dès que possible (économie sur le long terme)
4. **Être transparent** avec les utilisateurs (confiance = succès)
5. **Mettre à jour régulièrement** (données obsolètes = risque)
6. **Avoir un plan B** : Si BCM refuse le comparateur, prêt à retirer la fonctionnalité ?

---

**Bonne chance pour le lancement de ProCrypto ! 🚀**

Si vous avez des questions, référez-vous aux documents :
- `LEGAL_COMPLIANCE_MADAGASCAR.md` - Guide juridique complet
- `LETTRE_BCM_MODELE.md` - Modèle de lettre BCM
- `GUIDE_DECLARATION_CNIL_MADAGASCAR.md` - Procédure CNIL

**Document créé le** : 5 Janvier 2026
**Auteur** : ProCrypto Team
**Version** : 1.0
