import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, logout, switchAccount } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial check
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleNav = () => setOpen(!open);
  const closeNav = () => setOpen(false);

  return (
    <header className={`nav ${scrolled ? 'scrolled' : ''} ${open ? 'open' : ''}`} id="nav">
      <div className="nav-inner">
        <Link to="/" className="brand" onClick={closeNav}>
          <span className="brand-mark">T</span>
          <span className="brand-text">TSLA<em>INVEST</em></span>
        </Link>
        <nav className="nav-links" id="navLinks">
          <a href="/#terminal" onClick={closeNav}>Terminal</a>
          <a href="/#portfolio" onClick={closeNav}>Portfolio</a>
          <a href="/#calculator" onClick={closeNav}>Calculator</a>
          <a href="/#why" onClick={closeNav}>Thesis</a>
          <a href="/#news" onClick={closeNav}>News</a>
          {user && <Link to="/dashboard" onClick={closeNav}>Dashboard</Link>}
          {user && <Link to="/pay" onClick={closeNav}>Pay</Link>}
          {user && user.role === 'admin' && <Link to="/admin" onClick={closeNav}>Admin</Link>}
        </nav>
        <div className="nav-cta">
          {user ? (
            <>
              <span style={{ fontSize: 12.5, color: 'var(--txt-muted)' }}>{user.email}</span>
              <button className="btn btn-ghost btn-sm" onClick={switchAccount}>Switch</button>
              <button className="btn btn-primary btn-sm" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
          <button className="burger" id="burger" aria-label="Toggle menu" onClick={toggleNav}>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;