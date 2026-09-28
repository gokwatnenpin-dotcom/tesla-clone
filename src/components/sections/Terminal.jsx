import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import Chart from '../ui/Chart';

const Terminal = () => {
  const market = useMarket();
  const { price, prevClose, open, high, low, buyShares, sellShares } = market;

  const [range, setRange] = useState('1D');
  const [side, setSide] = useState('BUY'); // BUY or SELL
  const [orderShares, setOrderShares] = useState(1);

  const change = price - prevClose;
  const pctChange = (change / prevClose) * 100;
  const isUp = change >= 0;

  const handleBuyClick = () => setSide('BUY');
  const handleSellClick = () => setSide('SELL');

  const handlePlaceOrder = () => {
    const shares = orderShares;
    if (shares <= 0) return;
    if (side === 'BUY') {
      buyShares(shares);
    } else {
      sellShares(shares);
    }
    // Reset shares to 1 after order
    setOrderShares(1);
  };

  const handleSharesChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setOrderShares(value);
  };

  return (
    <section className="section" id="terminal">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">// Trading Terminal</span>
          <h2>Live data.<br /><span className="dim">Real decisions.</span></h2>
          <p className="sub">
            Real-time TSLA charting across five timeframes. Hover the chart to inspect any point.
            Place simulated buy/sell orders below.
          </p>
        </div>

        <div className="terminal reveal d1">
          <div className="terminal-top">
            <div>
              <div className="t-symbol">NASDAQ · TSLA · USD</div>
              <div className={`t-price ${isUp ? 'flash-up' : 'flash-down'}`}>
                ${price.toFixed(2)}
              </div>
              <div className={`t-change ${!isUp ? 'neg' : ''}`}>
                {isUp ? '▲ +' : '▼ '}${change.toFixed(2)} (${isUp ? '+' : ''}${pctChange.toFixed(2)}%)
              </div>
            </div>
            <div className="t-ranges" id="ranges">
              <button
                data-range="1D"
                className={range === '1D' ? 'active' : ''}
                onClick={() => setRange('1D')}
              >
                1D
              </button>
              <button
                data-range="1W"
                className={range === '1W' ? 'active' : ''}
                onClick={() => setRange('1W')}
              >
                1W
              </button>
              <button
                data-range="1M"
                className={range === '1M' ? 'active' : ''}
                onClick={() => setRange('1M')}
              >
                1M
              </button>
              <button
                data-range="1Y"
                className={range === '1Y' ? 'active' : ''}
                onClick={() => setRange('1Y')}
              >
                1Y
              </button>
              <button
                data-range="ALL"
                className={range === 'ALL' ? 'active' : ''}
                onClick={() => setRange('ALL')}
              >
                ALL
              </button>
            </div>
          </div>

          <div className="chart-wrap">
            <Chart range={range} />
          </div>

          <div className="terminal-bottom">
            <div className="tstat">
              <div className="k">Open</div>
              <div className="v">${open.toFixed(2)}</div>
            </div>
            <div className="tstat">
              <div className="k">High</div>
              <div className="v">${high.toFixed(2)}</div>
            </div>
            <div className="tstat">
              <div className="k">Low</div>
              <div className="v">${low.toFixed(2)}</div>
            </div>
            <div className="tstat">
              <div className="k">Volume</div>
              <div className="v">30.2M</div>
            </div>
            <div className="tstat">
              <div className="k">P/E</div>
              <div className="v">338.37</div>
            </div>
            <div className="tstat">
              <div className="k">Beta</div>
              <div className="v">1.85</div>
            </div>
          </div>
        </div>

        {/* Order Panel */}
        <div className="order-panel reveal d2">
          <div className="order-box">
            <h3>Place Order</h3>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <button
                className={side === 'BUY' ? 'btn btn-buy btn-sm' : 'btn btn-ghost btn-sm'}
                onClick={handleBuyClick}
              >
                BUY
              </button>
              <button
                className={side === 'SELL' ? 'btn btn-sell btn-sm' : 'btn btn-ghost btn-sm'}
                onClick={handleSellClick}
              >
                SELL
              </button>
            </div>
            <div className="order-row">
              <span className="lbl">Order Type</span>
              <span className="val">Market</span>
            </div>
            <div className="order-row">
              <span className="lbl">Limit Price</span>
              <span className="val" id="limitPriceDisplay">
                ${price.toFixed(2)}
              </span>
            </div>
            <div style={{ margin: '16px 0' }}>
              <label style={{ fontSize: '12px', color: 'var(--txt-dim)', display: 'block', marginBottom: '8px' }}>
                Shares
              </label>
              <input
                type="number"
                className="order-input"
                id="orderShares"
                value={orderShares}
                onChange={handleSharesChange}
                min="1"
                step="1"
              />
            </div>
            <div className="order-row">
              <span className="lbl">Estimated Cost</span>
              <span className="val" id="orderCost">
                ${(price * orderShares).toFixed(2)}
              </span>
            </div>
            <div className="order-row">
              <span className="lbl">Commission</span>
              <span className="val" style={{ color: 'var(--green)' }}>
                $0.00
              </span>
            </div>
            <div className="order-actions">
              <button
                className={side === 'BUY' ? 'btn btn-buy btn-block' : 'btn btn-sell btn-block'}
                onClick={handlePlaceOrder}
              >
                {side === 'BUY' ? 'BUY TSLA' : 'SELL TSLA'}
              </button>
            </div>
          </div>
          <div className="order-box">
            <h3>Order Book — Simulated</h3>
            <div className="order-row">
              <span className="lbl">Bid 1</span>
              <span className="val" style={{ color: 'var(--green)' }}>
                ${(price - 0.02).toFixed(2)} × 1,200
              </span>
            </div>
            <div className="order-row">
              <span className="lbl">Bid 2</span>
              <span className="val" style={{ color: 'var(--green)' }}>
                ${(price - 0.06).toFixed(2)} × 3,400
              </span>
            </div>
            <div className="order-row">
              <span className="lbl">Bid 3</span>
              <span className="val" style={{ color: 'var(--green)' }}>
                ${(price - 0.13).toFixed(2)} × 800
              </span>
            </div>
            <div style={{ height: '1px', background: 'var(--border)', margin: '10px 0' }}></div>
            <div className="order-row">
              <span className="lbl">Ask 1</span>
              <span className="val" style={{ color: 'var(--red-bright)' }}>
                ${(price + 0.04).toFixed(2)} × 900
              </span>
            </div>
            <div className="order-row">
              <span className="lbl">Ask 2</span>
              <span className="val" style={{ color: 'var(--red-bright)' }}>
                ${(price + 0.08).toFixed(2)} × 2,100
              </span>
            </div>
            <div className="order-row">
              <span className="lbl">Ask 3</span>
              <span className="val" style={{ color: 'var(--red-bright)' }}>
                ${(price + 0.16).toFixed(2)} × 1,500
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Terminal;