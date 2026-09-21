# Helmi Travel

Plateforme de réservation touristique React + Express + MySQL.

## Démarrage

```bash
npm install
npm run install:all
copy backend/.env.example backend/.env
npm run db:setup --prefix backend
npm run dev
```

Frontend : http://localhost:5173 — API : http://localhost:5000/api

Le frontend contient des données de démonstration et fonctionne même sans API. Pour activer MySQL, créez la base `helmi_travel`, configurez `backend/.env`, puis lancez le backend.

Commandes de base de données réexécutables :

```bash
npm run db:migrate --prefix backend
npm run db:seed --prefix backend
```

## Production

Consultez [DEPLOYMENT.md](./DEPLOYMENT.md) pour Vercel, Render, MySQL, HTTPS, domaine et sauvegardes. Les comptes de démonstration doivent être supprimés avant toute ouverture publique.
