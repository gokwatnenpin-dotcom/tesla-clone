import React, { createContext, useContext, useState, useEffect } from 'react';
import { authFetch, useAuth } from './AuthContext';

const MarketContext = createContext();

export const MarketProvider = ({ children }) => {
  const [market, setMarket] = useState({
    price: 365.44,
    prevClose: 363.56,
    open: 363.56,
    high: 368.66,
    low: 358.77,
    cash: 0,
    shares: 0,
    avgCost: 0,
  });
  const { user } = useAuth();

  useEffect(() => {
    const tick = () => {
      setMarket(prev => {
        const shock = (Math.random() - 0.5) * 0.004;
        const drift = 0.00002;
        const newPrice = Math.max(1, prev.price * (1 + shock + drift));
        const newHigh = Math.max(prev.high, newPrice);
        const newLow = Math.min(prev.low, newPrice);
        return {
          ...prev,
          price: newPrice,
          high: newHigh,
          low: newLow,
        };
      });
    };

    const interval = setInterval(tick, 3000);
    return () => clearInterval(interval);
  }, []);

  // Load persisted portfolio state from the backend
  useEffect(() => {
    authFetch('/api/portfolio')
      .then((r) => (r.ok ? r.json() : null))
      .then((p) => {
        if (p) {
          setMarket((prev) => ({
            ...prev,
            cash: Number(p.cash),
            shares: p.shares,
            avgCost: Number(p.avgCost),
          }));
        }
      })
      .catch(() => {});
  }, [user]);

  // Helper functions for buying and selling — persisted on the server
  const buyShares = async (shares) => {
    try {
      const res = await authFetch('/api/portfolio/buy', {
        method: 'POST',
        body: JSON.stringify({ shares, price: market.price }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { alert(data.error || 'Please log in to trade'); return; }
      setMarket((prev) => ({ ...prev, cash: data.cash, shares: data.shares, avgCost: data.avgCost }));
    } catch {
      alert('Could not reach the server.');
    }
  };

  const sellShares = async (shares) => {
    try {
      const res = await authFetch('/api/portfolio/sell', {
        method: 'POST',
        body: JSON.stringify({ shares, price: market.price }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { alert(data.error || 'Please log in to trade'); return; }
      setMarket((prev) => ({ ...prev, cash: data.cash, shares: data.shares, avgCost: data.avgCost }));
    } catch {
      alert('Could not reach the server.');
    }
  };

  const marketValue = market.shares * market.price;
  const totalValue = marketValue + market.cash;
  const costBasis = market.shares * market.avgCost;
  const unrealizedPnL = marketValue - costBasis;
  const returnPct = costBasis > 0 ? (unrealizedPnL / costBasis) * 100 : 0;

  const contextValue = {
    price: market.price,
    prevClose: market.prevClose,
    open: market.open,
    high: market.high,
    low: market.low,
    cash: market.cash,
    shares: market.shares,
    avgCost: market.avgCost,
    marketValue,
    totalValue,
    costBasis,
    unrealizedPnL,
    returnPct,
    buyShares,
    sellShares,
  };

  return (
    <MarketContext.Provider value={contextValue}>
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
};