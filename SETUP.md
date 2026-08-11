# Setup Guide

This site is a Next.js app. It's fully built and runs locally already — this
guide covers the accounts you need to create yourself to send real emails,
take real payments, store gallery photos, and deploy it live. I can't create
these accounts for you, but every step below is quick.

## 1. Local development

Already working. To run it yourself:

```bash
npm install
npm run dev
```

Open http://localhost:3000. The local database is a throwaway Postgres
instance started with:

```bash
npx prisma dev --name lacrosse -d
```

(This was already started once — it keeps running in the background. If it's
ever stopped, just run that command again and it'll pick up where it left
off, since data is persisted to disk.)

Your admin login: whatever `ADMIN_EMAIL` / `ADMIN_PASSWORD` are set to in
`.env`, applied by running:

```bash
npm run create-admin
```

Re-run that anytime you change the password in `.env`.

## 2. Accounts to create before going live

### Stripe (payments)

1. Create an account at stripe.com.
2. In the Stripe dashboard, toggle to **Test mode** first and grab your test
   keys from **Developers → API keys**.
3. Put them in `.env`:
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
4. For webhooks locally, install the [Stripe CLI](https://stripe.com/docs/stripe-cli)
   and run:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   It prints a webhook signing secret starting with `whsec_` — put that in
   `STRIPE_WEBHOOK_SECRET`.
5. When you're ready to take real payments, switch to **Live mode** in
   Stripe, grab the live keys, and set up a webhook endpoint in the dashboard
   pointing at `https://nhlacrosse.com/api/webhooks/stripe` for the
   `checkout.session.completed` event — copy its signing secret into your
   production environment variables.

### Resend (email)

1. Create an account at resend.com (free tier covers this easily).
2. Verify a sending domain (or use their shared `onboarding@resend.dev` for
   testing — that's already the default).
3. Create an API key and put it in `.env` as `RESEND_API_KEY`.
4. Set `EMAIL_FROM` to an address on your verified domain once you have one,
   e.g. `stringing@nhlacrosse.com`.

### Vercel Blob (gallery photo storage)

1. Once your project is on Vercel (next section), go to your project's
   **Storage** tab and create a Blob store.
2. Vercel automatically injects `BLOB_READ_WRITE_TOKEN` into your deployed
   environment — nothing to copy manually there.
3. For local development, pull it with `vercel env pull .env.local` after
   linking the project (see below), or copy the token from the Vercel
   dashboard into `.env`.

### Shopify (merch) — whenever you're ready, no rush

The `/merch` page already knows how to talk to Shopify — it's just not
configured yet. Right now it shows "Coming soon"; the moment you add the two
env vars below, it automatically switches to pulling and displaying your
real products. No code changes needed on my end.

1. Create a Shopify account and store at shopify.com when you're ready to
   sell merch (this is a paid plan — Shopify doesn't have a permanent free
   tier, just a trial).
2. In the Shopify admin, go to **Settings → Apps and sales channels →
   Develop apps** (you may need to enable custom app development first).
3. Create a custom app, and under **Storefront API**, grant access to
   `unauthenticated_read_product_listings` (and `unauthenticated_read_product_inventory`
   if you want stock info later). Install the app to get a **Storefront API
   access token**.
4. Set in `.env` (and in Vercel's environment variables for production):
   - `SHOPIFY_STORE_DOMAIN` — looks like `your-store.myshopify.com`
   - `SHOPIFY_STOREFRONT_ACCESS_TOKEN` — the token from step 3
5. Add products in Shopify and publish them to your **Online Store** sales
   channel — that's what makes them visible to the Storefront API.
6. Reload `/merch` — your products should appear in a grid, each linking out
   to Shopify's own checkout for that product. Cart/checkout itself is
   entirely handled by Shopify; this site only displays the catalog.

Since I don't have real Shopify credentials to test against, treat this as
unverified until you connect a real store — the code follows Shopify's
documented Storefront API, but I haven't been able to confirm it against a
live account.

### A real Postgres database

The local `prisma dev` database is dev-only. For production:

1. Easiest option: [Neon](https://neon.tech) (free tier). Create a project,
   copy the connection string.
2. Or use Vercel Postgres directly from your project's Storage tab.
3. Set `DATABASE_URL` in your production environment to that connection
   string, then run migrations against it once:
   ```bash
   DATABASE_URL="your-production-url" npx prisma migrate deploy
   ```

### Domain + hosting (Vercel)

1. Create a Vercel account, install the CLI (`npm i -g vercel`), and from
   this folder run `vercel` to link and deploy.
2. In the Vercel project settings, add all the environment variables from
   `.env` (except point `DATABASE_URL` at your real Postgres, not the local
   dev one).
3. Set `NEXT_PUBLIC_SITE_URL` to `https://nhlacrosse.com` — it's used in
   email links.
4. Buy **nhlacrosse.com** (Vercel can sell it to you directly, or use any
   registrar) and attach it in **Settings → Domains**.
5. Run the admin user creation script once against production (or just reuse
   `npm run create-admin` with production `DATABASE_URL` set locally).

## 3. Before you launch

- Update `STRINGER_SHIP_TO` in [`src/lib/constants.ts`](src/lib/constants.ts)
  with your real shipping address — that's what goes out in the
  payment-received email telling athletes where to send their head.
- Swap `SITE_NAME` in the same file if you want a different business name
  than "NH Lacrosse".
- Add real photos via `/admin/gallery` once Blob storage is configured.
- Switch Stripe to Live mode and update the webhook + keys in production.
