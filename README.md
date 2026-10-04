# Tesla Invest — full stack demo

## Setup

1. `npm install`
2. Create a Postgres database and copy `.env.example` to `.env`, setting `DATABASE_URL` and secrets.
3. Build the frontend: `npm run build`
4. Start the server: `npm start` → API + static site on http://localhost:3001

For development:
- `npm run dev` — Vite dev server on http://localhost:5173 (proxies /api → :3001)
- `npm run server` — API server on :3001

## What you get

- **Auth**: email/password register & login (JWT), Google sign-in (needs `VITE_GOOGLE_CLIENT_ID`), per-user accounts, switch-account, role-based admin.
- **Payments**: crypto deposits (address + tx hash, stored as `pending`), gift-card deposits with front/back photo uploads — all persisted in Postgres.
- **Dashboard**: logged-in users see their cash, shares, orders, and payments.
- **Admin panel** (`/admin`, login as the seeded admin): view every user's crypto tx hashes and gift-card images, approve/reject, see all orders.
- **Trading**: buy/sell TSLA persists per user in `user_portfolio`; every order is stored server-side.

The database schema lives in `server/schema.sql` and is applied on server start (`users`, `user_portfolio`, `orders`, `payments`, `waitlist`).

## Free hosting (Render + Neon)

1. Create a free Postgres database at https://neon.tech (free tier, no expiry) and copy the connection string.
2. Push this repo to GitHub.
3. On https://render.com create a **Web Service** from the repo (or use the included `render.yaml` with the Blueprint flow):
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
4. Add environment variables in Render (they are also available at build time, which the `VITE_*` ones need):
   - `DATABASE_URL` = your Neon connection string
   - `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
   - `VITE_GOOGLE_CLIENT_ID` (optional), `VITE_CRYPTO_ADDRESS` (set your real address)
5. Deploy — Render gives you a free `https://<name>.onrender.com` URL that serves both the API and the built frontend.

Alternatives with free tiers: Koyeb (free web service) or Fly.io (tiny shared VMs). Stick to Render/Neon if you want zero cost without a credit card.

