import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authFetch } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, switchAccount } = useAuth();
  const [pf, setPf] = useState(null);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    authFetch('/api/portfolio').then((r) => r.ok && r.json()).then((d) => d && setPf(d));
    authFetch('/api/orders').then((r) => r.ok && r.json()).then((d) => d && setOrders(d));
    authFetch('/api/payments').then((r) => r.ok && r.json()).then((d) => d && setPayments(d));
  }, []);

  if (!user) return <Navigate to="/login" />;

  return (
    <section className="section">
      <div className="container">
        <div className="section-head reveal in">
          <span className="eyebrow">// Dashboard</span>
          <h2>Welcome, {user.name || user.email}.</h2>
          <p className="sub">Your account at a glance.</p>
        </div>

        <div className="pf-metrics" style={{ marginBottom: 20 }}>
          <div className="pf-metric"><div className="k">Cash</div><div className="v">${pf ? pf.cash.toFixed(2) : '…'}</div></div>
          <div className="pf-metric"><div className="k">Shares</div><div className="v">{pf ? pf.shares : '…'}</div></div>
          <div className="pf-metric"><div className="k">Avg Cost</div><div className="v">${pf ? pf.avgCost.toFixed(2) : '…'}</div></div>
          <div className="pf-metric"><div className="k">Role</div><div className="v">{user.role}</div></div>
        </div>

        <div className="order-panel" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="order-box">
            <h3 style={{ marginBottom: 12 }}>Your Orders</h3>
            {orders.length === 0 && <p style={{ color: 'var(--txt-dim)', fontSize: 13 }}>No orders yet.</p>}
            <table className="holdings-table">
              <thead><tr><th>Side</th><th>Shares</th><th>Price</th></tr></thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}><td className={o.side === 'BUY' ? 'gain' : 'loss'}>{o.side}</td><td>{o.shares}</td><td>${o.price.toFixed(2)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="order-box">
            <h3 style={{ marginBottom: 12 }}>Your Payments</h3>
            {payments.length === 0 && <p style={{ color: 'var(--txt-dim)', fontSize: 13 }}>No payments yet.</p>}
            <table className="holdings-table">
              <thead><tr><th>Method</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id}><td>{p.method}</td><td>${p.amount.toFixed(2)}</td><td>{p.status}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <button className="btn btn-ghost btn-sm" style={{ marginTop: 24 }} onClick={switchAccount}>Switch Account</button>
      </div>
    </section>
  );
};

export default Dashboard;
