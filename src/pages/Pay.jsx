import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, authFetch } from '../context/AuthContext';

const CRYPTO_ADDRESS = import.meta.env.VITE_CRYPTO_ADDRESS || 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const Pay = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('crypto');
  const [amount, setAmount] = useState('');
  const [coin, setCoin] = useState('BTC');
  const [txHash, setTxHash] = useState('');
  const [front, setFront] = useState(null);
  const [back, setBack] = useState(null);
  const [cardholder, setCardholder] = useState('');
  const [last4, setLast4] = useState('');
  const [msg, setMsg] = useState('');

  if (!user) return <Navigate to="/login" />;

  const submitCrypto = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await authFetch('/api/payments/crypto', {
        method: 'POST',
        body: JSON.stringify({ amount, coin, txHash }),
      });
      const data = await res.json();
      setMsg(res.ok ? `// SUCCESS: ${data.message} (ref #${data.id})` : `// ERROR: ${data.error}`);
    } catch { setMsg('// ERROR: could not reach the server'); }
  };

  const submitGiftCard = async (e) => {
    e.preventDefault();
    setMsg('');
    if (!front || !back) { setMsg('// ERROR: upload both front and back photos'); return; }
    try {
      const [frontB64, backB64] = await Promise.all([toBase64(front), toBase64(back)]);
      const res = await authFetch('/api/payments/giftcard', {
        method: 'POST',
        body: JSON.stringify({ amount, cardholder, last4, front: frontB64, back: backB64 }),
      });
      const data = await res.json();
      setMsg(res.ok ? `// SUCCESS: ${data.message} (ref #${data.id})` : `// ERROR: ${data.error}`);
    } catch { setMsg('// ERROR: could not reach the server'); }
  };

  return (
    <section className="section">
      <div className="container">
        <div className="section-head reveal in">
          <span className="eyebrow">// Payment Gateway</span>
          <h2>Fund your account.<br /><span className="dim">Crypto or gift card.</span></h2>
        </div>
        <div className="auth-card reveal in">
          <div className="tabs">
            <button className={`tab ${tab === 'crypto' ? 'active' : ''}`} onClick={() => setTab('crypto')}>Crypto</button>
            <button className={`tab ${tab === 'giftcard' ? 'active' : ''}`} onClick={() => setTab('giftcard')}>Gift Card</button>
          </div>

          {tab === 'crypto' ? (
            <form onSubmit={submitCrypto}>
              <p style={{ fontSize: 13, color: 'var(--txt-muted)', marginBottom: 16 }}>
                Send crypto to this address, then submit the transaction hash:
              </p>
              <div className="order-row" style={{ marginBottom: 18, background: 'var(--bg)', padding: '12px 14px', borderRadius: 8 }}>
                <span className="lbl">Address ({coin})</span>
                <span className="val" style={{ wordBreak: 'break-all' }}>{CRYPTO_ADDRESS}</span>
              </div>
              <select className="order-input" style={{ marginBottom: 14 }} value={coin} onChange={(e) => setCoin(e.target.value)}>
                <option>BTC</option><option>USDT</option><option>ETH</option>
              </select>
              <input className="order-input" style={{ marginBottom: 14 }} type="number" min="1" placeholder="Amount (USD equivalent)" value={amount} onChange={(e) => setAmount(e.target.value)} />
              <input className="order-input" style={{ marginBottom: 18 }} placeholder="Transaction hash" value={txHash} onChange={(e) => setTxHash(e.target.value)} />
              <button className="btn btn-primary btn-block" type="submit">Submit Crypto Payment</button>
            </form>
          ) : (
            <form onSubmit={submitGiftCard}>
              <input className="order-input" style={{ marginBottom: 14 }} type="number" min="1" placeholder="Card value (USD)" value={amount} onChange={(e) => setAmount(e.target.value)} />
              <input className="order-input" style={{ marginBottom: 14 }} placeholder="Name on card" value={cardholder} onChange={(e) => setCardholder(e.target.value)} />
              <input className="order-input" style={{ marginBottom: 14 }} placeholder="Last 4 digits" maxLength={4} value={last4} onChange={(e) => setLast4(e.target.value.replace(/\D/g, ''))} />
              <label style={{ fontSize: 12, color: 'var(--txt-dim)', display: 'block', marginBottom: 6 }}>Front photo</label>
              <input className="order-input" style={{ marginBottom: 14 }} type="file" accept="image/*" onChange={(e) => setFront(e.target.files[0])} />
              <label style={{ fontSize: 12, color: 'var(--txt-dim)', display: 'block', marginBottom: 6 }}>Back photo</label>
              <input className="order-input" style={{ marginBottom: 18 }} type="file" accept="image/*" onChange={(e) => setBack(e.target.files[0])} />
              <button className="btn btn-primary btn-block" type="submit">Upload Gift Card</button>
            </form>
          )}
          <div className={`form-msg ${msg.startsWith('// SUCCESS') ? 'ok' : msg.startsWith('// ERROR') ? 'err' : ''}`} style={{ marginTop: 14 }}>{msg}</div>
        </div>
      </div>
    </section>
  );
};

export default Pay;
