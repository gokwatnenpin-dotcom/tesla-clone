import React from 'react';
import { useMarket } from '../../context/MarketContext';

const Portfolio = () => {
  const market = useMarket();
  const { shares, price, avgCost, cash, marketValue, totalValue, costBasis, unrealizedPnL, returnPct } = market;

  // Holdings data (simplified for now)
  const holdings = [
    { symbol: 'TSLA', shares, avgCost, price, marketValue, pnl: unrealizedPnL },
  ];

  return (
    <section className="section" id="portfolio">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">// Your Portfolio</span>
          <h2>Real profit.<br /><span className="dim">Real loss. In real time.</span></h2>
          <p className="sub">Positions update with the live price. P&L recalculates every tick.</p>
        </div>

        <div className="portfolio reveal d1">
          <div className="portfolio-main">
            <div className="pf-header">
              <div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '10.5px', letterSpacing: '.14em', color: 'var(--txt-dim)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Total Portfolio Value
                </div>
                <div className="pf-total" id="pfTotal">
                  ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className={`pf-pnl ${unrealizedPnL >= 0 ? '' : 'neg'}`} id="pfPnl">
                  {unrealizedPnL >= 0 ? '▲ +' : '▼ -'}${Math.abs(unrealizedPnL).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({returnPct >= 0 ? '+' : ''}{returnPct.toFixed(2)}%)
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '10.5px', letterSpacing: '.14em', color: 'var(--txt-dim)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Cash Available
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '20px', fontWeight: '600' }}>
                  ${cash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            <div className="pf-metrics">
              <div className="pf-metric">
                <div className="k">Cost Basis</div>
                <div className="v" id="pfCost">
                  ${costBasis.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div className="pf-metric">
                <div className="k">Unrealized P&L</div>
                <div className={`v ${unrealizedPnL >= 0 ? 'up' : 'down'}`} id="pfUnrealized">
                  {unrealizedPnL >= 0 ? '+' : ''}${Math.abs(unrealizedPnL).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div className="pf-metric">
                <div className="k">Return</div>
                <div className={`v ${returnPct >= 0 ? 'up' : 'down'}`} id="pfReturn">
                  {returnPct >= 0 ? '+' : ''}{returnPct.toFixed(2)}%
                </div>
              </div>
              <div className="pf-metric">
                <div className="k">Shares Held</div>
                <div className="v" id="pfShares">
                  {shares}
                </div>
              </div>
            </div>

            <table className="holdings-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Shares</th>
                  <th>Avg Cost</th>
                  <th>Market Price</th>
                  <th>Market Value</th>
                  <th>P&L</th>
                </tr>
              </thead>
              <tbody id="holdingsBody">
                {holdings.map((h, index) => (
                  <tr key={index}>
                    <td className="sym">{h.symbol}</td>
                    <td>{h.shares}</td>
                    <td>${h.avgCost.toFixed(2)}</td>
                    <td>${h.price.toFixed(2)}</td>
                    <td>${h.marketValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className={h.pnl >= 0 ? 'gain' : 'loss'}>
                      {h.pnl >= 0 ? '+' : ''}${Math.abs(h.pnl).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pf-side">
            <div>
              <h3>Allocation</h3>
              <p style={{ fontSize: '12.5px', color: 'var(--txt-dim)', marginTop: '4px' }}>
                100% TSLA — concentrated bet on one thesis.
              </p>
            </div>
            <div className="allocation-bar">
              <span style={{ width: '100%', background: 'var(--red)' }}></span>
            </div>
            <div className="allocation-legend">
              <div className="item">
                <span className="lbl">
                  <span className="swatch" style={{ background: 'var(--red)' }}></span>
                  Tesla, Inc.
                </span>
                <span className="pct">100%</span>
              </div>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '18px' }}>
              <h3 style={{ marginBottom: '10px' }}>Risk Metrics</h3>
              <div className="order-row">
                <span className="lbl">Beta (5Y)</span>
                <span className="val">1.85</span>
              </div>
              <div className="order-row">
                <span className="lbl">Volatility (Ann.)</span>
                <span className="val">52.4%</span>
              </div>
              <div className="order-row">
                <span className="lbl">Max Drawdown</span>
                <span className="val" style={{ color: 'var(--red-bright)' }}>-40.4%</span>
              </div>
              <div className="order-row">
                <span className="lbl">Sharpe Ratio</span>
                <span className="val">0.42</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;