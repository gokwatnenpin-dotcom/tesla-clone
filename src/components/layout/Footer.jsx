import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <a href="#top" className="brand" style={{ marginBottom: '14px' }}>
              <span className="brand-mark">T</span>
              <span className="brand-text">TSLA<em>INVEST</em></span>
            </a>
            <p style={{ color: 'var(--txt-dim)', fontSize: '12.5px', maxWidth: '34ch', marginTop: '12px' }}>
              A demo investment experience. Built with React, Vite and Tailwind.
            </p>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <h4>Product</h4>
              <a href="#terminal">Trading Terminal</a>
              <a href="#portfolio">Portfolio</a>
              <a href="#calculator">Calculator</a>
              <a href="#news">News</a>
              <a href="#payment">Payment Gateway</a>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <a href="#top">About</a>
              <a href="#access">Careers</a>
              <a href="#access">Press</a>
              <a href="#access">Contact</a>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <a href="#top">Terms of Use</a>
              <a href="#top">Privacy Policy</a>
              <a href="#top">Risk Disclosure</a>
              <a href="#top">Cookies</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© TSLA INVEST — DEMO PROJECT</span>
          <span>SIMULATED DATA · NOT INVESTMENT ADVICE</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;