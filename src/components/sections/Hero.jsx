import React from 'react';

const Hero = () => {
  return (
    <section className="hero" id="top">
      <div className="hero-grid"></div>
      <div className="hero-glow"></div>
      <div className="container">
        <div className="pill reveal">
          <span className="dot"></span> NASDAQ: TSLA · Market Open · Sep 14, 2026
        </div>
        <h1 className="reveal d1">
          Own a piece of<br /><span className="grad">the future.</span>
        </h1>
        <p className="lede reveal d2">
          Tesla isn't a car company. It's an <strong>energy</strong> company,
          an <strong>autonomy</strong> company, and a <strong>robotics</strong>
          company — three exponential curves stacked on one balance sheet.
          $1.44T market cap. $103.62B revenue. Negative free cash flow as it
          bets big on AI, robotaxi, and Optimus[reference:2][reference:3].
        </p>
        <div className="hero-cta reveal d3">
          <a href="#access" className="btn btn-primary btn-lg">
            Start Investing →
          </a>
          <a href="#terminal" className="btn btn-ghost btn-lg">
            View Live Terminal
          </a>
        </div>
        <div className="hero-stats reveal d4">
          <div className="hstat">
            <div className="label">Last Price</div>
            <div className="value" id="heroPrice">
              $365.44
            </div>
          </div>
          <div className="hstat">
            <div className="label">Today</div>
            <div className="value up" id="heroChange">
              +0.52%
            </div>
          </div>
          <div className="hstat">
            <div className="label">Market Cap</div>
            <div className="value">$1.44T</div>
          </div>
          <div className="hstat">
            <div className="label">52W Range</div>
            <div className="value" style={{ fontSize: '14px' }}>
              $297 – $499
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;