import React, { createContext, useContext, useState, useEffect } from 'react';

const MarketContext = createContext();

export const MarketProvider = ({ children }) => {
  const [market, setMarket] = useState({
    price: 365.44,
    prevClose: 363.56,
    open: 363.56,
    high: 368.66,
    low: 358.77,
    cash: 12450.00,
    shares: 100,
    avgCost: 328.90,
  });

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

  // Helper functions for buying and selling
  const buyShares = (shares) => {
    setMarket(prev => {
      const cost = shares * prev.price;
      if (cost > prev.cash) {
        alert('Insufficient cash. Available: $' + prev.cash.toLocaleString());
        return prev;
      }
      const totalCost = prev.avgCost * prev.shares + cost;
      const newShares = prev.shares + shares;
      return {
        ...prev,
        shares: newShares,
        avgCost: totalCost / newShares,
        cash: prev.cash - cost,
      };
    });
  };

  const sellShares = (shares) => {
    setMarket(prev => {
      if (shares > prev.shares) {
        alert('Insufficient shares. You hold ' + prev.shares + '.');
        return prev;
      }
      const newShares = prev.shares - shares;
      const newCash = prev.cash + shares * prev.price;
      // avgCost remains the same when selling
      return {
        ...prev,
        shares: newShares,
        cash: newCash,
      };
    });
  };

  const updateOrderShares = (shares) => {
    // This is just for the order input, we don't update market state here
    // We'll handle it in the OrderPanel component
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
    // We'll also need a function to update the order shares (local to order panel)
    // but we can just pass down a setter for the order shares state.
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