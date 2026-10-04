-- reset legacy tables from the pre-auth schema
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS portfolio_state CASCADE;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password_hash TEXT,
  provider TEXT NOT NULL DEFAULT 'local',
  google_id TEXT,
  role TEXT NOT NULL DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS user_portfolio (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  cash NUMERIC(16, 2) NOT NULL DEFAULT 0,
  shares INTEGER NOT NULL DEFAULT 0,
  avg_cost NUMERIC(14, 2) NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  side TEXT NOT NULL CHECK (side IN ('BUY', 'SELL')),
  shares INTEGER NOT NULL CHECK (shares > 0),
  price NUMERIC(14, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  method TEXT NOT NULL CHECK (method IN ('crypto', 'giftcard')),
  amount NUMERIC(14, 2) NOT NULL,
  coin TEXT,
  tx_hash TEXT,
  cardholder TEXT,
  last4 CHAR(4),
  gc_front TEXT,
  gc_back TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS waitlist (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL
);
