import React, { useEffect, useState } from 'react';
import './Header.css'; // We'll create a CSS file for Header specific styles if needed, but we can rely on globals.

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
        <a href="#top" className="brand">
          <span className="brand-mark">T</span>
          <span className="brand-text">TSLA<em>INVEST</em></span>
        </a>
        <nav className="nav-links" id="navLinks">
          <a href="#terminal" onClick={closeNav}>Terminal</a>
          <a href="#portfolio" onClick={closeNav}>Portfolio</a>
          <a href="#calculator" onClick={closeNav}>Calculator</a>
          <a href="#why" onClick={closeNav}>Thesis</a>
          <a href="#news" onClick={closeNav}>News</a>
        </nav>
        <div className="nav-cta">
          <a href="#access" className="btn btn-primary btn-sm">Open Account</a>
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