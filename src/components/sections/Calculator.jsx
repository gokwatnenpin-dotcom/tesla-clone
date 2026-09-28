import React, { useState, useRef, useEffect } from 'react';

const Calculator = () => {
  const [amount, setAmount] = useState(10000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(18);
  const [displayed, setDisplayed] = useState(0);
  const animFrameRef = useRef(null);

  const amountOut = `$${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  const yearsOut = `${years} ${years === 1 ? 'year' : 'years'}`;
  const rateOut = `${rate}%`;

  // Calculate future value
  const future = amount * Math.pow(1 + rate / 100, years);
  const gain = future - amount;
  const multiple = future / amount;

  // Animation for future value
  useEffect(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    const start = performance.now();
    const from = displayed;
    const to = future;
    const dur = 500;
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = from + (to - from) * eased;
      setDisplayed(value);
      if (p < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        setDisplayed(to);
      }
    };
    animFrameRef.current = requestAnimationFrame(step);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [amount, years, rate, displayed]);

  return (
    <section className="section" id="calculator">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">// Projection Engine</span>
          <h2>Run the numbers.<br /><span className="dim">Then run them again.</span></h2>
        </div>
        <div className="calc reveal d1">
          <div className="calc-inputs">
            <div className="field">
              <div className="field-head">
                <label htmlFor="amount">Initial investment</label>
                <span className="readout" id="amountOut">{amountOut}</span>
              </div>
              <input
                type="range"
                id="amount"
                min="500"
                max="250000"
                step="500"
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value))}
              />
            </div>
            <div className="field">
              <div className="field-head">
                <label htmlFor="years">Time horizon</label>
                <span className="readout" id="yearsOut">{yearsOut}</span>
              </div>
              <input
                type="range"
                id="years"
                min="1"
                max="30"
                step="1"
                value={years}
                onChange={(e) => setYears(parseInt(e.target.value))}
              />
            </div>
            <div className="field">
              <div className="field-head">
                <label htmlFor="rate">Assumed annual return</label>
                <span className="readout" id="rateOut">{rateOut}</span>
              </div>
              <input
                type="range"
                id="rate"
                min="1"
                max="40"
                step="0.5"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
              />
            </div>
          </div>
          <div className="calc-output">
            <div className="out-label">Projected Value</div>
            <div className="out-value" id="futureValue">
              ${displayed.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <div className="out-gain" id="gainPill">
              ▲ +${gain.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} profit  ·  ${multiple.toFixed(2)}×
            </div>
            <p className="out-note">
              Compound growth only. Does not include dividends, fees, taxes or volatility.
              <strong style={{ color: 'var(--txt-muted)' }}>
                This is a hypothetical illustration, not a forecast or guarantee.
              </strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Calculator;