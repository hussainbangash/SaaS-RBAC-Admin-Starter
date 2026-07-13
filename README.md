# SaaS RBAC Starter

[![CI](https://github.com/hussainbangash/SaaS-RBAC-Admin-Starter/actions/workflows/ci.yml/badge.svg)](https://github.com/hussainbangash/SaaS-RBAC-Admin-Starter/actions/workflows/ci.yml)

A reusable Next.js SaaS template with credentials authentication, PostgreSQL,
Prisma, and server-side role-based access control.

Use it as a GitHub template when you want a project where auth, dashboard
routing, seeded users, and protected admin actions are already wired.

## Stack

- Next.js 16 App Router
- React 19
- NextAuth v5 credentials provider
- Prisma 7 with PostgreSQL
- Tailwind CSS 4
- Zod validation

## What Is Included

- Login page with seeded demo accounts.
- JWT sessions with role data attached to the session.
- Admin, Manager, and User roles.
- Server-side route guards for protected pages.
- Admin-only user management.
- Admin/Manager reports page.
- Profile page for authenticated users.
- Prisma schema, migration, and seed data.
- RBAC documentation and template setup checklist.

## Quick Start

```bash
npm install
copy .env.example .env
npx prisma generate
npx prisma migrate dev
npm run seed
npm run dev
```

Open `http://localhost:3000`.

Demo accounts after seeding:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@demo.com` | `password123` |
| Manager | `manager@demo.com` | `password123` |
| User | `user@demo.com` | `password123` |

## Environment

Required variables:

```text
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
AUTH_SECRET="replace-with-a-long-random-secret"
AUTH_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"
```

Generate a local auth secret with:

```bash
npx auth secret
```

## Common Commands

```bash
npm run dev          # Start the local app
npm run build        # Production build
npm run lint         # ESLint
npm test             # RBAC unit tests
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run local migrations
npm run db:deploy    # Apply migrations in deploy environments
npm run seed         # Seed demo users and data
```

## RBAC Model

The core access map lives in `src/lib/permissions/access.ts`.

Authentication-aware guards live in `src/lib/permissions/roles.ts`:

- `requireUser()` redirects anonymous users to `/login`.
- `requireRole([...])` redirects authenticated users without the required role
  to `/unauthorized`.

Route access:

| Route | Roles |
| --- | --- |
| `/dashboard` | Admin, Manager, User |
| `/dashboard/users` | Admin |
| `/dashboard/reports` | Admin, Manager |
| `/dashboard/profile` | Admin, Manager, User |

See `docs/RBAC.md` for customization steps.

## Making This A GitHub Template

Push the repository to GitHub, then enable:

```text
Settings -> General -> Template repository
```

People copying the repo should create their own `.env`, run migrations, seed or
create users, and then build feature pages behind `requireUser()` or
`requireRole()`.

## Security

Built into the template:

- **Server-side enforcement** — every protected page and mutation calls
  `requireUser()` / `requireRole()`; UI filtering is only cosmetic.
- **Live role/deletion checks** — `requireUser()` re-reads the user from the
  database on every request, and the JWT callback refreshes the role, so role
  changes and account deletions take effect immediately instead of when the
  token expires. Sessions also cap at 24h.
- **Login rate limiting** — `src/lib/rate-limit.ts` throttles sign-in attempts
  per IP + email (in-memory; swap for Upstash Redis for multi-instance).
- **User-enumeration mitigation** — sign-in runs a constant-time bcrypt compare
  whether or not the email exists.
- **bcrypt cost 12** for password hashing.
- **Security headers** — HSTS, `X-Frame-Options`, `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy` (see `next.config.ts`; add a tuned CSP).
- **Seed guard** — `prisma/seed.ts` refuses to run against `NODE_ENV=production`
  unless `ALLOW_PROD_SEED=1`, since it wipes tables and creates demo accounts.
- **CI** — GitHub Actions runs typecheck, lint, tests, and build on every push/PR.

Still recommended before shipping a real product: password reset + email
verification flows, an invite flow, a stronger password policy (breach check),
multi-tenancy (an `Organization` model with per-org roles) if you need tenant
isolation, and any OAuth/SAML providers your product requires.
