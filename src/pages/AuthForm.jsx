import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const GoogleButton = ({ onCredential }) => {
  const divRef = useRef(null);
  const cbRef = useRef(onCredential);
  cbRef.current = onCredential;
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !window.google) return;
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (resp) => cbRef.current(resp.credential),
    });
    window.google.accounts.id.renderButton(divRef.current, { theme: 'filled_black', size: 'large' });
  }, []);
  if (!GOOGLE_CLIENT_ID) return null;
  return <div ref={divRef} style={{ marginTop: 18 }} />;
};

// Dev-only fallback so Google sign-in is testable without a real client ID
const GoogleDevButton = ({ onSuccess }) => {
  if (GOOGLE_CLIENT_ID) return null;
  const handle = async () => {
    const email = window.prompt('Dev Google sign-in — enter your email:');
    if (!email) return;
    const name = window.prompt('Name (optional):') || email.split('@')[0];
    const res = await fetch('/api/auth/google-dev', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name }),
    });
    const data = await res.json();
    if (!res.ok) { alert(data.error || 'Dev login failed'); return; }
    onSuccess(data);
  };
  return (
    <button
      type="button"
      className="btn btn-ghost btn-block"
      style={{ marginTop: 18 }}
      onClick={handle}
    >
      Continue with Google (dev)
    </button>
  );
};

const AuthForm = ({ mode }) => {
  const isLogin = mode === 'login';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    const url = isLogin ? '/api/auth/login' : '/api/auth/register';
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isLogin ? { email, password } : { name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setMsg('// ERROR: ' + (data.error || 'failed')); return; }
      login(data.token, data.user);
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch {
      setMsg('// ERROR: could not reach the server');
    }
  };

  const google = async (credential) => {
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential }),
    });
    const data = await res.json();
    if (!res.ok) { setMsg('// ERROR: ' + (data.error || 'Google login failed')); return; }
    login(data.token, data.user);
    navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
  };

  return (
    <section className="section">
      <div className="container">
        <div className="auth-card reveal in">
          <span className="eyebrow">{isLogin ? '// Sign In' : '// Create Account'}</span>
          <h2 style={{ fontSize: 26, marginBottom: 24 }}>{isLogin ? 'Welcome back.' : 'Join TSLA Invest.'}</h2>
          <form onSubmit={submit} noValidate>
            {!isLogin && (
              <input className="order-input" style={{ marginBottom: 14 }} placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
            )}
            <input className="order-input" style={{ marginBottom: 14 }} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="order-input" style={{ marginBottom: 18 }} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="btn btn-primary btn-block" type="submit">{isLogin ? 'Sign In' : 'Register'}</button>
          </form>
          <GoogleButton onCredential={google} />
          <GoogleDevButton
            onSuccess={(data) => {
              login(data.token, data.user);
              navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
            }}
          />
          <div className={`form-msg ${msg.startsWith('// ERROR') ? 'err' : ''}`} style={{ marginTop: 14 }}>{msg}</div>
          <p style={{ marginTop: 18, fontSize: 13, color: 'var(--txt-muted)' }}>
            {isLogin ? <>No account? <Link to="/register" style={{ color: 'var(--red-bright)' }}>Register</Link></> : <>Have an account? <Link to="/login" style={{ color: 'var(--red-bright)' }}>Sign in</Link></>}
          </p>
        </div>
      </div>
    </section>
  );
};

export default AuthForm;
