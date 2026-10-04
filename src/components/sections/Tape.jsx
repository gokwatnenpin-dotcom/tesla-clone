import React from 'react';

const Tape = () => {
  // In a real app, these would come from a market data context
  const tapeData = [
    { symbol: 'TSLA', price: '$365.44', change: '▲ 0.52%', isUp: true },
    { symbol: 'NASDAQ', price: '16,742.10', change: '▲ 0.62%', isUp: true },
    { symbol: 'S&P 500', price: '5,284.44', change: '▲ 0.38%', isUp: true },
    { symbol: 'VOLUME', price: '30.2M', change: '', isUp: false },
    { symbol: 'MARKET CAP', price: '$1.44T', change: '', isUp: false },
    { symbol: 'P/E', price: '338.37', change: '', isUp: false },
  ];

  // Duplicate the data for seamless looping
  const renderGroup = (offset) => (
    <div className="tape-group" key={offset}>
      {tapeData.map((item, index) => (
        <span key={index} className="tape-item">
          {item.symbol} <b>{item.price}</b> {item.change && <span className={item.isUp ? 'up' : 'down'}>{item.change}</span>}
        </span>
      ))}
    </div>
  );

  return (
    <div className="tape" aria-hidden="true">
      <div className="tape-track">
        {renderGroup(0)}
        {renderGroup(1)}
      </div>
    </div>
  );
};

export default Tape;