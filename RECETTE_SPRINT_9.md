# Sprint 9 — Rapport de recette

Date de l'audit : 3 août 2026

## Verdict

**Non prêt pour une livraison publique.** Le build et le schéma MySQL sont valides, mais les tests fonctionnels automatisés, les essais de paiement/e-mail, les mesures de performance, la matrice responsive/navigateurs, la sauvegarde restaurée et le déploiement réel restent à valider.

## Contrôles exécutés

| Contrôle | Résultat | Preuve / remarque |
|---|---|---|
| Build frontend de production | ✅ Réussi | Vite : 1 697 modules, build en 2,76 s |
| Syntaxe JavaScript backend | ✅ Réussie | 0 fichier en erreur |
| Connexion et structure MySQL | ✅ Réussies | 28 tables, 289 colonnes, 74 index, 27 clés étrangères |
| Migrations | ✅ Réussies | 001 à 011 déjà appliquées |
| Helmet, CORS, rate limiting | ✅ Présents | Configurés dans `backend/server.js` |
| Limites JSON et upload | ✅ Présentes | JSON 200 Ko ; types et taille contrôlés par Multer |
| Configuration de production | ✅ Garde-fous présents | Secrets longs, HTTPS et base exigés en production |
| Identifiants de démonstration dans le login | ✅ Corrigé | Champs de connexion désormais vides |
| URL de photo liée à localhost | ✅ Corrigée | Origine dérivée de `VITE_API_URL` |
| Audit de vulnérabilités npm | ⚠️ Non exécuté | Accès au registre externe non autorisé |
| Tests automatisés | ❌ Absents | Aucun script `test` dans les packages |
| Secret JWT local | ⚠️ À remplacer | Valeur factice détectée ; `JWT_REFRESH_SECRET` absent du `.env` local |
| Poids du logo | ⚠️ À optimiser | Environ 964 Ko dans le build |

Les avertissements Vite relatifs aux directives `use client` des dépendances sont non bloquants.

## Checklist de livraison

| Élément | Statut |
|---|---|
| Authentification | 🟡 Implémentée, tests E2E requis |
| Gestion des utilisateurs | 🟡 Implémentée, CRUD à tester |
| Voyages | 🟡 Implémentés, CRUD à tester |
| Hôtels | 🟡 Implémentés, CRUD à tester |
| Location de voitures | 🟡 Implémentée, parcours à tester |
| Réservations | 🟡 Implémentées, scénarios complets à tester |
| Paiements | 🔴 Sandbox Stripe/PayPal à valider |
| Emails | 🔴 SMTP réel et délivrabilité à valider |
| Factures PDF | 🟡 Implémentées, contenu et téléchargement à valider |
| Dashboard Client | 🟡 À tester avec plusieurs comptes |
| Dashboard Admin | 🟡 À tester par rôle et sur tous les CRUD |
| Responsive | 🔴 Matrice appareils non exécutée |
| Sécurité | 🟡 Protections présentes, tests offensifs et audit npm requis |
| Performance | 🔴 Lighthouse et mesures API non exécutés |
| Sauvegardes | 🟡 Scripts présents, restauration réelle non prouvée |
| Documentation | 🟡 README et déploiement présents, manuels utilisateur/admin manquants |
| Déploiement | 🔴 Environnement public non vérifié |
| Tests finaux | 🔴 Bloqués par l'absence de suite automatisée et d'environnement de recette |

## Critères de validation restants

1. Créer un environnement de recette avec une copie anonymisée de la base et des comptes dédiés Admin, Agent et Client.
2. Ajouter des tests API et E2E couvrant authentification, rôles, CRUD, réservation, annulation, paiement sandbox et PDF.
3. Exécuter l'audit npm après autorisation explicite de transmettre la liste des dépendances au registre npm.
4. Mesurer avec Lighthouse et un outil de charge : accueil inférieur à 2 s et API moyenne inférieure à 500 ms.
5. Tester les largeurs 1920, 1600, 1366, tablette et mobile dans Chrome, Edge, Firefox, Safari et Opera.
6. Effectuer puis restaurer une sauvegarde SQL ; sauvegarder séparément les uploads et PDF. Ne jamais sauvegarder les secrets en clair dans le dépôt.
7. Remplacer les secrets, supprimer les comptes de démonstration, optimiser le logo et valider SMTP/Stripe/PayPal en sandbox.
8. Vérifier le domaine, HTTPS, pages légales, favicon, liens sociaux et politiques de sauvegarde/monitoring.

La livraison officielle ne doit être cochée qu'après conservation des preuves (captures, rapports de test, résultats Lighthouse, logs de paiement sandbox et test de restauration).
