import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool, query, ensureSchema } from './db.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'tesla-invest-dev-secret';

app.use(cors());
app.use(express.json({ limit: '15mb' }));

let dbReady = false;
ensureSchema()
  .then(async () => {
    dbReady = true;
    console.log('✓ Postgres connected, schema ready');
    // seed admin account
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@tesla.com').toLowerCase();
    const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
    const { rows } = await query('SELECT id FROM users WHERE email=$1', [adminEmail]);
    if (!rows.length) {
      const hash = await bcrypt.hash(adminPass, 10);
      const r = await query("INSERT INTO users (email,name,password_hash,provider,role) VALUES ($1,'Admin',$2,'local','admin') RETURNING id", [adminEmail, hash]);
      await query('INSERT INTO user_portfolio (user_id, cash, shares, avg_cost) VALUES ($1,0,0,0)', [r.rows[0].id]);
      console.log(`✓ Admin seeded: ${adminEmail} / ${adminPass}`);
    }
  })
  .catch((err) => console.error('✗ Postgres unavailable:', err.message));

const requireDb = (req, res, next) => {
  if (!dbReady) return res.status(503).json({ error: 'Database unavailable.' });
  next();
};

const signToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

const requireAdmin = (req, res, next) => {
  requireAuth(req, res, () => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admins only' });
    next();
  });
};

app.get('/api/health', async (req, res) => {
  try { await query('SELECT 1'); res.json({ ok: true, db: 'up' }); }
  catch { res.json({ ok: true, db: 'down' }); }
});

/* ---------- Auth ---------- */
app.post('/api/auth/register', requireDb, async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const name = String(req.body.name || '').trim();
  const password = String(req.body.password || '');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return res.status(400).json({ error: 'Invalid email' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
  try {
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await query("INSERT INTO users (email,name,password_hash,provider) VALUES ($1,$2,$3,'local') RETURNING id,email,name,role", [email, name, hash]);
    await query('INSERT INTO user_portfolio (user_id) VALUES ($1)', [rows[0].id]);
    res.json({ token: signToken(rows[0]), user: rows[0] });
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'Email already registered' });
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/auth/login', requireDb, async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const { rows } = await query('SELECT * FROM users WHERE email=$1', [email]);
  if (!rows.length || !rows[0].password_hash) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, rows[0].password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const u = rows[0];
  res.json({ token: signToken(u), user: { id: u.id, email: u.email, name: u.name, role: u.role } });
});

// Google sign-in: client sends the Google ID token (credential)
app.post('/api/auth/google', requireDb, async (req, res) => {
  const credential = req.body.credential;
  if (!credential) return res.status(400).json({ error: 'Missing Google credential' });
  try {
    const r = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
    const info = await r.json();
    if (!r.ok || !info.email) return res.status(401).json({ error: 'Invalid Google token' });
    const email = info.email.toLowerCase();
    let { rows } = await query('SELECT * FROM users WHERE email=$1', [email]);
    let user;
    if (rows.length) {
      user = rows[0];
      if (!user.google_id) await query('UPDATE users SET google_id=$1, provider=$2 WHERE id=$3', [info.sub, 'google', user.id]);
    } else {
      const ins = await query("INSERT INTO users (email,name,provider,google_id) VALUES ($1,$2,'google',$3) RETURNING *", [email, info.name || email.split('@')[0], info.sub]);
      await query('INSERT INTO user_portfolio (user_id) VALUES ($1)', [ins.rows[0].id]);
      user = ins.rows[0];
    }
    res.json({ token: signToken(user), user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Dev-only: simulates a Google account to test the flow without a client ID
app.post('/api/auth/google-dev', requireDb, async (req, res) => {
  if (process.env.ALLOW_DEV_GOOGLE === 'false') return res.status(403).json({ error: 'Dev Google login disabled' });
  const email = String(req.body.email || '').trim().toLowerCase();
  const name = String(req.body.name || email.split('@')[0]).trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return res.status(400).json({ error: 'Invalid email' });
  try {
    let { rows } = await query('SELECT * FROM users WHERE email=$1', [email]);
    let user;
    if (rows.length) {
      user = rows[0];
      if (user.provider !== 'google') await query("UPDATE users SET provider='google' WHERE id=$1", [user.id]);
    } else {
      const ins = await query("INSERT INTO users (email,name,provider) VALUES ($1,$2,'google') RETURNING *", [email, name]);
      await query('INSERT INTO user_portfolio (user_id) VALUES ($1)', [ins.rows[0].id]);
      user = ins.rows[0];
    }
    res.json({ token: signToken(user), user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

/* ---------- Portfolio ---------- */
app.get('/api/portfolio', requireDb, requireAuth, async (req, res) => {
  const { rows } = await query('SELECT cash::float, shares, avg_cost::float AS "avgCost" FROM user_portfolio WHERE user_id=$1', [req.user.id]);
  res.json(rows[0] || { cash: 0, shares: 0, avgCost: 0 });
});

app.post('/api/portfolio/buy', requireDb, requireAuth, async (req, res) => {
  const shares = parseInt(req.body.shares, 10);
  const price = parseFloat(req.body.price);
  if (!(shares > 0) || !(price > 0)) return res.status(400).json({ error: 'Invalid shares or price' });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query('SELECT cash, shares, avg_cost FROM user_portfolio WHERE user_id=$1 FOR UPDATE', [req.user.id]);
    const p = rows[0];
    const cost = shares * price;
    if (cost > Number(p.cash)) { await client.query('ROLLBACK'); return res.status(400).json({ error: `Insufficient cash. Available: $${Number(p.cash).toFixed(2)}` }); }
    const newShares = p.shares + shares;
    const newAvg = (Number(p.avg_cost) * p.shares + cost) / newShares;
    const newCash = Number(p.cash) - cost;
    await client.query('UPDATE user_portfolio SET cash=$1, shares=$2, avg_cost=$3 WHERE user_id=$4', [newCash, newShares, newAvg, req.user.id]);
    await client.query('INSERT INTO orders (user_id, side, shares, price) VALUES ($1,$2,$3,$4)', [req.user.id, 'BUY', shares, price]);
    await client.query('COMMIT');
    res.json({ cash: newCash, shares: newShares, avgCost: newAvg });
  } catch (e) { await client.query('ROLLBACK'); res.status(500).json({ error: e.message }); }
  finally { client.release(); }
});

app.post('/api/portfolio/sell', requireDb, requireAuth, async (req, res) => {
  const shares = parseInt(req.body.shares, 10);
  const price = parseFloat(req.body.price);
  if (!(shares > 0) || !(price > 0)) return res.status(400).json({ error: 'Invalid shares or price' });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query('SELECT cash, shares, avg_cost FROM user_portfolio WHERE user_id=$1 FOR UPDATE', [req.user.id]);
    const p = rows[0];
    if (shares > p.shares) { await client.query('ROLLBACK'); return res.status(400).json({ error: `Insufficient shares. You hold ${p.shares}.` }); }
    const newShares = p.shares - shares;
    const newCash = Number(p.cash) + shares * price;
    await client.query('UPDATE user_portfolio SET cash=$1, shares=$2 WHERE user_id=$3', [newCash, newShares, req.user.id]);
    await client.query('INSERT INTO orders (user_id, side, shares, price) VALUES ($1,$2,$3,$4)', [req.user.id, 'SELL', shares, price]);
    await client.query('COMMIT');
    res.json({ cash: newCash, shares: newShares, avgCost: Number(p.avg_cost) });
  } catch (e) { await client.query('ROLLBACK'); res.status(500).json({ error: e.message }); }
  finally { client.release(); }
});

app.get('/api/orders', requireDb, requireAuth, async (req, res) => {
  const { rows } = await query('SELECT id, side, shares, price::float FROM orders WHERE user_id=$1 ORDER BY id DESC LIMIT 50', [req.user.id]);
  res.json(rows);
});

/* ---------- Deposits / Payments ---------- */
app.post('/api/payments/crypto', requireDb, requireAuth, async (req, res) => {
  const { amount, coin, txHash } = req.body;
  const amt = parseFloat(amount);
  if (!(amt > 0) || !coin || !txHash || String(txHash).length < 6) {
    return res.status(400).json({ error: 'Amount, coin and transaction hash required' });
  }
  const { rows } = await query(
    "INSERT INTO payments (user_id, method, amount, coin, tx_hash, status) VALUES ($1,'crypto',$2,$3,$4,'pending') RETURNING id, status",
    [req.user.id, amt, coin.toUpperCase(), String(txHash)]
  );
  res.json({ ...rows[0], message: 'Crypto payment submitted — pending review' });
});

app.post('/api/payments/giftcard', requireDb, requireAuth, async (req, res) => {
  const { amount, cardholder, last4, front, back } = req.body;
  const amt = parseFloat(amount);
  if (!(amt > 0) || !front || !back) {
    return res.status(400).json({ error: 'Amount and both card photos required' });
  }
  const { rows } = await query(
    "INSERT INTO payments (user_id, method, amount, cardholder, last4, gc_front, gc_back, status) VALUES ($1,'giftcard',$2,$3,$4,$5,$6,'pending') RETURNING id, status",
    [req.user.id, amt, cardholder || '', last4 || '', front, back]
  );
  res.json({ ...rows[0], message: 'Gift card submitted — pending review' });
});

app.get('/api/payments', requireDb, requireAuth, async (req, res) => {
  const { rows } = await query('SELECT id, method, amount::float, coin, tx_hash, status FROM payments WHERE user_id=$1 ORDER BY id DESC LIMIT 50', [req.user.id]);
  res.json(rows);
});

/* ---------- Admin ---------- */
app.get('/api/admin/payments', requireDb, requireAdmin, async (req, res) => {
  const { rows } = await query(
    `SELECT p.id, p.method, p.amount::float, p.coin, p.tx_hash, p.cardholder, p.last4,
            p.gc_front, p.gc_back, p.status, u.email AS user_email, u.name AS user_name
     FROM payments p JOIN users u ON u.id = p.user_id ORDER BY p.id DESC LIMIT 200`
  );
  res.json(rows);
});

app.get('/api/admin/orders', requireDb, requireAdmin, async (req, res) => {
  const { rows } = await query(
    `SELECT o.id, o.side, o.shares, o.price::float, u.email AS user_email FROM orders o JOIN users u ON u.id=o.user_id ORDER BY o.id DESC LIMIT 200`
  );
  res.json(rows);
});

app.patch('/api/admin/payments/:id/status', requireDb, requireAdmin, async (req, res) => {
  const status = req.body.status;
  if (!['pending', 'approved', 'rejected'].includes(status)) return res.status(400).json({ error: 'Bad status' });
  await query('UPDATE payments SET status=$1 WHERE id=$2', [status, req.params.id]);
  res.json({ ok: true });
});

/* ---------- Waitlist ---------- */
app.post('/api/waitlist', requireDb, async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return res.status(400).json({ error: 'Invalid email format' });
  try { await query('INSERT INTO waitlist (email) VALUES ($1)', [email]); res.json({ message: 'ACCESS REQUESTED — we will be in touch.' }); }
  catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'This email is already on the waitlist.' });
    res.status(500).json({ error: e.message });
  }
});

/* ---------- Static frontend ---------- */
const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get(/^\/(?!api).*/, (req, res) => res.sendFile(path.join(distDir, 'index.html')));
}

app.listen(PORT, () => console.log(`API server on http://localhost:${PORT}`));
