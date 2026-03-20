# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

**Automation Station** — A subscription-based web app for PC automation scripts. Users sign in via Replit Auth, subscribe via Stripe ($5/mo Basic for browsing/downloading, $10/mo Pro for AI script generation), and access scripts synced from GitHub.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Frontend**: React + Vite (wouter routing, TanStack Query, Tailwind CSS, Framer Motion)
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: Replit Auth (OIDC with PKCE) via `@workspace/replit-auth-web`
- **Payments**: Stripe via Replit integration + `stripe-replit-sync`
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server (auth, scripts, subscription, Stripe webhooks, GitHub sync)
│   └── automation-station/ # React+Vite frontend (home, pricing, library, AI generator, account)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   ├── db/                 # Drizzle ORM schema + DB connection
│   └── replit-auth-web/    # Replit Auth React hook
├── scripts/                # Utility scripts
│   └── src/
│       ├── hello.ts
│       └── seed-products.ts  # Seeds Stripe products (Basic $5, Pro $10)
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Key Architecture

### Authentication
- Replit Auth via OIDC/PKCE — no custom login forms
- Frontend uses `useAuth()` from `@workspace/replit-auth-web`
- Backend auth middleware in `api-server/src/middlewares/authMiddleware.ts`
- Sessions stored in `sessions` table, users in `users` table

### Stripe Payments
- Integration via Replit connector (no manual API keys)
- `stripeClient.ts` fetches credentials from Replit connectors API
- `stripe-replit-sync` manages webhook + data sync to `stripe.*` schema
- Webhook route registered BEFORE `express.json()` middleware in `app.ts`
- Products: Basic Plan ($5/mo), Pro Plan ($10/mo) — seeded via `scripts/src/seed-products.ts`
- `webhookHandlers.ts` processes `checkout.session.completed` to update user subscription tier

### GitHub Script Sync
- `githubSync.ts` syncs scripts from `shotgunsensei/AutomationPacks` on server startup
- Detects format from file extension (.ps1→PowerShell, .bat/.cmd→Batch, .py→Python)
- Scripts stored in `scripts` table with name, description, content, format, category, source

### Frontend Routes
- `/` — Home (public)
- `/pricing` — Subscription plans (public)
- `/library` — Script browsing/download (requires auth + subscription)
- `/scripts/:id` — Script detail/download (requires auth + subscription)
- `/generate` — AI script generator (requires auth + Pro subscription)
- `/account` — Profile + billing management (requires auth)
- `/checkout/success`, `/checkout/cancel` — Stripe checkout redirects

### Database Schema
- `users` — id, email, firstName, lastName, profileImageUrl, stripeCustomerId, stripeSubscriptionId, subscriptionTier
- `sessions` — sid, sess, expire
- `scripts` — id, name, description, content, format, category, source, githubPath, downloadCount, timestamps
- `stripe.*` — managed by stripe-replit-sync (products, prices, customers, subscriptions, etc.)

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

- **Always typecheck from the root** — `pnpm run typecheck`
- **`emitDeclarationOnly`** — only `.d.ts` files emitted during typecheck
- **Project references** — when package A depends on B, A's `tsconfig.json` must list B in `references`

## Root Scripts

- `pnpm run build` — typecheck + build all packages
- `pnpm run typecheck` — `tsc --build --emitDeclarationOnly`

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server with auth, Stripe payments, GitHub sync, and script management.

- Entry: `src/index.ts` — initializes Stripe, starts server, triggers GitHub sync
- App: `src/app.ts` — webhook route (raw body), CORS, auth middleware, routes at `/api`
- Routes: `src/routes/` — auth.ts, scripts.ts, subscription.ts, health.ts
- Services: `stripeClient.ts`, `stripeService.ts`, `webhookHandlers.ts`, `githubSync.ts`, `storage.ts`

### `artifacts/automation-station` (`@workspace/automation-station`)

React+Vite frontend with dark theme, glassmorphism design, neon accents.

- Uses `@workspace/replit-auth-web` for auth, `@workspace/api-client-react` for API hooks
- Protected routes via `ProtectedRoute` component (supports `requireSubscription` and `requirePro`)
- Styling: Tailwind CSS + custom glass effects + Framer Motion animations

### `lib/db` (`@workspace/db`)

Database layer with Drizzle ORM. Schema in `src/schema/auth.ts` (users, sessions, scripts tables).

### `lib/api-spec` (`@workspace/api-spec`)

OpenAPI 3.1 spec + Orval codegen config. Run: `pnpm --filter @workspace/api-spec run codegen`

### `lib/replit-auth-web` (`@workspace/replit-auth-web`)

React hook for Replit Auth (OIDC). Provides `useAuth()` with `user`, `isAuthenticated`, `login`, `logout`.

### `scripts` (`@workspace/scripts`)

Utility scripts. Run via `pnpm --filter @workspace/scripts run <script>`.
- `seed-products` — Creates Basic/Pro Stripe products and prices
