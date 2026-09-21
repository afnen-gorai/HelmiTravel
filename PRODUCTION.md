# Guide Go-Live — Helmi Travel

## 1. Environnements

Utiliser trois environnements séparés : développement, préproduction et production. Les bases, clés JWT, comptes SMTP et clés de paiement ne doivent jamais être partagés. Le fichier `.env` n'est ni versionné ni inclus en clair dans une sauvegarde.

Déploiement recommandé : Vercel pour `helmitravel.tn`, Render pour `api.helmitravel.tn`, MySQL managé avec TLS et stockage persistant pour `uploads`. Le détail initial est dans `DEPLOYMENT.md`.

## 2. Variables obligatoires

- API : `NODE_ENV=production`, `FRONTEND_URL`, `CORS_ORIGINS`, `TRUST_PROXY`, variables MySQL/TLS, secrets JWT distincts d'au moins 32 caractères.
- Services : SMTP, Stripe et PayPal. Commencer en sandbox, puis remplacer les clés uniquement après validation des scénarios métier.
- Frontend : `VITE_API_URL`, puis `VITE_GTM_ID` ou `VITE_GA_MEASUREMENT_ID`. `VITE_META_PIXEL_ID` est optionnel.

La configuration analytics n'est chargée qu'après consentement. Ajouter la propriété GA4 à Search Console, publier le conteneur GTM et vérifier le domaine avec les valeurs données par Google.

## 3. Super administrateur

Définir temporairement `SUPER_ADMIN_EMAIL` et `SUPER_ADMIN_PASSWORD`, puis exécuter :

```bash
npm run admin:create-super --prefix backend
```

Le mot de passe doit compter 14 caractères minimum avec majuscule, minuscule, chiffre et symbole. Supprimer ces deux variables immédiatement après exécution. Ne pas utiliser les comptes créés par le seed en production.

## 4. Monitoring et alertes

L'API produit des logs JSON sur stdout avec `request_id`, statut et durée ; ne jamais journaliser les mots de passe, jetons ou cookies. Centraliser stdout/stderr avec Render Logs ou un collecteur compatible (Grafana Loki, Datadog, Better Stack).

Surveiller :

- `GET /api/health/live` toutes les minutes pour le processus ;
- `GET /api/health` toutes les 5 minutes pour MySQL ;
- CPU, RAM, disque uploads, connexions MySQL, taux de réponses 5xx et latence p95 ;
- la route protégée `GET /api/health/metrics` pour le diagnostic Admin.

Créer une alerte e-mail si deux contrôles successifs échouent, si les 5xx dépassent 2 % sur cinq minutes, si la latence p95 dépasse 1 s ou si CPU/RAM dépassent 85 % pendant dix minutes. Les erreurs non gérées sont émises comme événements JSON `unhandled_rejection` ou `uncaught_exception`.

## 5. Sauvegardes

Planifier `backend/scripts/backup-db.sh` chaque nuit, puis copier `.sql.gz`, somme SHA-256, `uploads` et documents persistants vers un stockage externe chiffré. Rétention conseillée : 7 quotidiennes, 4 hebdomadaires, 12 mensuelles.

Chaque trimestre, restaurer la dernière sauvegarde dans une base isolée, lancer migrations, `db:audit` et smoke tests. Une sauvegarde jamais restaurée n'est pas validée.

## 6. Tests avant version

```bash
npm test --prefix backend
npm run build
npm run db:audit --prefix backend
npm run test:smoke --prefix backend
```

Effectuer en préproduction les scénarios : réservation et paiement client, validation Agent, statistiques Admin, facture, annulation et remboursement. Conserver références, captures et logs fournisseurs. Exécuter Lighthouse sur accueil/recherche/détail et mesurer l'API sous charge. Tester Chrome, Edge, Firefox, Safari et Opera aux largeurs définies dans le Sprint 9.

## 7. Procédure de mise en production

1. Geler les changements, faire réussir tests/build et noter la version candidate.
2. Créer et vérifier un backup complet ; relever le point de restauration.
3. Déployer les migrations, l'API, puis le frontend.
4. Vérifier HTTPS/HSTS/CSP, CORS, sitemap, robots, pages légales et consentement.
5. Exécuter les smoke tests sur les URL publiques et un paiement réel de faible montant si autorisé.
6. Publier le tag `v1.0.0` uniquement si tous les critères sont verts.
7. Surveiller logs, erreurs, ressources et transactions pendant 48 heures ; prévoir un responsable et une procédure de retour à la version précédente.

## 8. Manuels condensés

Utilisateur : créer et vérifier le compte, rechercher une prestation, ouvrir sa fiche, réserver, payer, suivre le dossier dans « Mes réservations », puis télécharger confirmation et facture. Toute annulation passe par les conditions affichées et l'agence.

Administrateur : se connecter avec MFA fournisseur si disponible, gérer catalogue/promotions/utilisateurs, valider les dossiers, contrôler paiements/remboursements, consulter statistiques et audit, puis vérifier chaque jour alertes et sauvegardes. Les secrets SMTP/JWT/paiement restent dans le gestionnaire de secrets de l'hébergeur, jamais dans les paramètres du site.

## 9. Conditions bloquantes

Ne pas ouvrir au public si un secret est factice, si les paiements/webhooks ou e-mails ne sont pas validés, si aucune restauration n'a réussi, si les tests métier échouent, si le domaine n'est pas entièrement en HTTPS ou si les informations légales encore marquées « à compléter » ne sont pas renseignées par Helmi Travel et validées juridiquement.
