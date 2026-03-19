# Seed data

This folder contains JSON seed data and scripts for Prisma and PostgreSQL.

## Files

| File | Description |
|------|-------------|
| `Category.json` | Category records |
| `Profile.json` | Profile records (with userId) |
| `Service.json` | Service records (categoryId, profileId) |
| `Facility.json` | Facility records (profileId) |
| `Media.json` | Media records (profileId, serviceId) |
| **`prisma-seed.json`** | **Single bundle of all five tables for Prisma** |
| **`seed-from-json.js`** | **Prisma seed script — run from backend to migrate DB** |
| `build-prisma-seed.js` | Rebuilds `prisma-seed.json` from the 5 JSON files |
| `import_facility_media_service.py` | Imports Facility, Service, Media into PostgreSQL (skips Profile/Category) |
| `public.sql` | Reference schema (PostgreSQL) |

## Prisma seed (recommended for devs)

Use **`seed-from-json.js`** to seed your database from the JSON bundle. Existing records are skipped (upsert by id).

### 1. Regenerate the bundle (if you changed any JSON)

```bash
cd seed
node build-prisma-seed.js
```

### 2. Run the seed from your backend

From **allspaces-backend** (or any app with the same Prisma schema):

```bash
cd allspaces-backend
npm run seed:json
```

Or directly:

```bash
cd allspaces-backend
node ../seed/seed-from-json.js
```

Ensure `DATABASE_URL` is set (e.g. in `.env`). The script will:

1. Seed **Category**
2. Create **User** for each unique `Profile.userId` if missing (placeholder email/password)
3. Seed **Profile**
4. Seed **Facility** (only for profiles that were seeded)
5. Seed **Service**
6. Seed **Media** (if your schema has a Media model)

### 3. Add to another backend

In your backend’s `package.json`:

```json
"scripts": {
  "seed:json": "node ../seed/seed-from-json.js"
}
```

Run from the backend directory: `npm run seed:json`.

## Python import (Facility, Service, Media only)

When Profile and Category are already in the DB and you only want to add Facility, Service, Media:

```bash
cd seed
pip install -r requirements.txt
python import_facility_media_service.py
```
