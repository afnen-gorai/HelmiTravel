# Déploiement Helmi Travel

## Architecture

- Frontend React/Vite : Vercel, domaine `helmitravel.tn`.
- API Express : Render, domaine `api.helmitravel.tn`.
- MySQL 8 : service MySQL privé Render avec disque ou fournisseur MySQL managé.
- Uploads : disque Render monté dans `backend/uploads`.

## 1. MySQL de production

Créer une base et un utilisateur dédiés. Ne jamais utiliser `root` :

```sql
CREATE DATABASE helmi_travel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'helmi_app'@'%' IDENTIFIED BY 'mot-de-passe-long-et-aleatoire';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, REFERENCES ON helmi_travel.* TO 'helmi_app'@'%';
FLUSH PRIVILEGES;
```

Limiter `%` au réseau privé ou aux adresses Render lorsque le fournisseur le permet. Activer TLS et renseigner `DB_SSL_CA` si une autorité privée est utilisée.

## 2. API sur Render

Créer un Blueprint depuis `render.yaml`, puis renseigner les variables marquées `sync: false`. Les migrations sont exécutées par `preDeployCommand` avant chaque version.

Variables minimales :

- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` ; ou `DATABASE_URL`.
- `JWT_SECRET` et `JWT_REFRESH_SECRET` générés et distincts.
- `FRONTEND_URL=https://helmitravel.tn`.
- SMTP, Stripe et PayPal selon les services activés.

Configurer les webhooks :

- Stripe : `https://api.helmitravel.tn/api/webhooks/stripe`.
- PayPal : URL correspondant à la route webhook PayPal configurée dans l’API.

Vérifier après déploiement : `https://api.helmitravel.tn/api/health` doit répondre avec `database: connected`.

## 3. Frontend sur Vercel

Importer le dépôt avec `frontend` comme Root Directory. Ajouter :

```text
VITE_API_URL=https://api.helmitravel.tn/api
```

La configuration `frontend/vercel.json` gère les liens directs React Router, le cache des assets et les en-têtes de sécurité.

## 4. Domaine et HTTPS

Dans le DNS du registrar :

- connecter `helmitravel.tn` et `www.helmitravel.tn` à Vercel selon les valeurs affichées par Vercel ;
- créer `api.helmitravel.tn` dans Render puis ajouter le CNAME demandé par Render ;
- attendre la validation DNS et l’émission automatique des certificats ;
- rediriger `www` vers le domaine principal ;
- ne passer Stripe/PayPal en production qu’après validation HTTPS.

## 5. Sauvegardes

Exécuter quotidiennement `backend/scripts/backup-db.sh` depuis un environnement disposant de `mysqldump`. Copier ensuite les fichiers `.sql.gz` et `.sha256` vers un stockage externe chiffré. Conserver par exemple 7 sauvegardes quotidiennes, 4 hebdomadaires et 12 mensuelles.

Tester une restauration au moins une fois par trimestre sur une base séparée :

```bash
./scripts/restore-db.sh ./backups/helmi_travel_YYYYMMDDTHHMMSSZ.sql.gz
```

Une sauvegarde non testée ne doit pas être considérée comme restaurable.

## 6. Vérifications avant ouverture

- Créer les vrais comptes Admin avec mots de passe uniques et supprimer les comptes de démonstration.
- Tester inscription, e-mail, réservation, paiement sandbox puis production.
- Tester les PDF et la persistance d’un upload après redéploiement.
- Vérifier CORS, rate limiting, logs Render et alertes de disponibilité.
- Vérifier `robots.txt`, `sitemap.xml` et les métadonnées sociales.
