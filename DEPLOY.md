# Deploying to Vercel + Neon (free tier)

A step-by-step guide to put this template live on **Vercel** (Next.js host) with a
**Neon** serverless PostgreSQL database. Both have free tiers that are enough for a demo.

## 1. Create the database (Neon)

1. In the [Neon console](https://console.neon.tech), create a new **Project** (any region).
2. Open **Dashboard → Connect** and copy two connection strings:
   - the **Pooled** connection string (host contains `-pooler`) → used at runtime
   - the **Direct** connection string (pooling toggled off) → used for migrations

## 2. Create the schema + demo users (once, from your machine)

Run these locally with the **direct** URL so the migration's locks work correctly:

```powershell
cd path\to\RBAC-Starter
npm install

# use the DIRECT Neon URL here
$env:DATABASE_URL = "postgresql://USER:PASSWORD@ep-xxx.neon.tech/neondb?sslmode=require"

npx prisma generate         # build the Prisma client (gitignored, so a fresh clone needs this)
npx prisma migrate deploy   # creates the tables
npm run seed                # creates admin/manager/user demo accounts
```

## 3. Deploy the app (Vercel)

1. In [Vercel](https://vercel.com/new), **Import** this GitHub repository.
2. Framework preset auto-detects **Next.js**. Leave the build settings as-is
   (`vercel.json` already sets `prisma generate && next build`).
3. Add **Environment Variables** (Production):

   | Name | Value |
   |---|---|
   | `DATABASE_URL` | the **Pooled** Neon URL (host has `-pooler`) |
   | `AUTH_SECRET` | a long random string — generate with `npx auth secret` |
   | `AUTH_URL` | leave blank for now (set in step 5) |

4. Click **Deploy**.

## 4. First sign-in

Once the build finishes, open the deployment URL and sign in with a seeded account:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@demo.com` | `password123` |

## 5. Lock the auth URL to your domain

1. Copy your production URL (e.g. `https://your-app.vercel.app`).
2. In Vercel → **Settings → Environment Variables**, set:
   - `AUTH_URL` = `https://your-app.vercel.app`
   - `NEXTAUTH_URL` = `https://your-app.vercel.app`
3. **Redeploy** (Deployments → ⋯ → Redeploy) so the new values take effect.

## Notes

- **Free-tier scope:** Vercel's Hobby plan is for non-commercial use — fine for a demo/template.
- **Connection pooling:** the app connects with the Neon **pooled** URL at runtime so
  serverless functions don't exhaust connections; migrations use the **direct** URL.
- **Change the demo passwords** before sharing the link widely — `npm run seed` sets a
  known password. For a public demo that's fine; for anything real, reseed with your own.
