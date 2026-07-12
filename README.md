# MediaMonitor

A media monitoring platform: search global media coverage by keyword, place,
language, media type, and time — and subscribe to keywords (alone or
bundled as a saved search) to get alerted by email when new matching
coverage appears.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- PostgreSQL via Prisma
- Auth.js (NextAuth v5) with email/password credentials
- Nodemailer for outgoing alert email (falls back to an in-app email log
  when SMTP isn't configured, so the whole pipeline works with zero
  external credentials)

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Point `DATABASE_URL` in `.env` at a Postgres database, then run migrations:

   ```bash
   npx prisma migrate dev
   ```

3. Seed sample sources, articles, and a demo account:

   ```bash
   npx prisma db seed
   ```

   This creates `demo@example.com` / `password123` with two example
   subscriptions.

4. Start the dev server:

   ```bash
   npm run dev
   ```

   Open http://localhost:3000.

## How monitoring works

- `/` is the search engine: filter the article archive by keyword bundle
  (any/all), place, language, media type, and date range.
- Signed-in users can save any search as a subscription (`/subscriptions`),
  set a match mode, and choose a notification frequency.
- `POST /api/subscriptions/run` matches a signed-in user's active
  subscriptions against the archive on demand — there's a "Check for new
  matches now" button on `/alerts` for this.
- `GET /api/cron/run-alerts` does the same for every active subscription
  and is meant to be hit by a scheduler (see `vercel.json` for a Vercel
  Cron example). It requires `Authorization: Bearer $CRON_SECRET`.
- New matches are recorded as `Alert` rows and trigger an email via
  `src/lib/email.ts`. Without `SMTP_HOST` configured, emails are written to
  the `EmailLog` table and visible in the "Email log" section of
  `/alerts` instead of actually being sent.

## Environment variables

See `.env` for the full list (`DATABASE_URL`, `AUTH_SECRET`, optional
`SMTP_*`, `EMAIL_FROM`, `CRON_SECRET`).
 
