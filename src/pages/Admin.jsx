import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, authFetch } from '../context/AuthContext';

const Admin = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('payments');

  const load = () => {
    authFetch('/api/admin/payments').then((r) => r.ok && r.json()).then((d) => d && setPayments(d));
    authFetch('/api/admin/orders').then((r) => r.ok && r.json()).then((d) => d && setOrders(d));
  };
  useEffect(load, []);

  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" />;

  const setStatus = async (id, status) => {
    await authFetch(`/api/admin/payments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
    load();
  };

  return (
    <section className="section">
      <div className="container">
        <div className="section-head reveal in">
          <span className="eyebrow">// Admin</span>
          <h2>All user payments.</h2>
        </div>
        <div className="tabs">
          <button className={`tab ${tab === 'payments' ? 'active' : ''}`} onClick={() => setTab('payments')}>Payments</button>
          <button className={`tab ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>Orders</button>
        </div>

        {tab === 'payments' ? (
          <div className="order-box">
            <table className="holdings-table">
              <thead>
                <tr><th>User</th><th>Method</th><th>Amount</th><th>Details</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td>{p.user_email}</td>
                    <td>{p.method}</td>
                    <td>${p.amount.toFixed(2)}</td>
                    <td>
                      {p.method === 'crypto' ? (
                        <span>{p.coin} · {p.tx_hash}</span>
                      ) : (
                        <span>
                          {p.cardholder} •••• {p.last4}<br />
                          <img src={p.gc_front} alt="front" style={{ maxWidth: 140, marginTop: 6, borderRadius: 6 }} />{' '}
                          <img src={p.gc_back} alt="back" style={{ maxWidth: 140, marginTop: 6, borderRadius: 6 }} />
                        </span>
                      )}
                    </td>
                    <td>{p.status}</td>
                    <td>
                      <button className="btn btn-buy btn-sm" style={{ marginRight: 6 }} onClick={() => setStatus(p.id, 'approved')}>Approve</button>
                      <button className="btn btn-sell btn-sm" onClick={() => setStatus(p.id, 'rejected')}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {payments.length === 0 && <p style={{ color: 'var(--txt-dim)', fontSize: 13 }}>No payments yet.</p>}
          </div>
        ) : (
          <div className="order-box">
            <table className="holdings-table">
              <thead><tr><th>User</th><th>Side</th><th>Shares</th><th>Price</th></tr></thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}><td>{o.user_email}</td><td className={o.side === 'BUY' ? 'gain' : 'loss'}>{o.side}</td><td>{o.shares}</td><td>${o.price.toFixed(2)}</td></tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && <p style={{ color: 'var(--txt-dim)', fontSize: 13 }}>No orders yet.</p>}
          </div>
        )}
      </div>
    </section>
  );
};

export default Admin;
