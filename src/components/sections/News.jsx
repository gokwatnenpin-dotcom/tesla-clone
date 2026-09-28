import React from 'react';

const News = () => {
  const newsItems = [
    {
      date: 'Sep 14, 2026',
      title: 'Tesla regains US EV market share despite broader sector slowdown',
      source: 'GuruFocus',
    },
    {
      date: 'Sep 06, 2026',
      title: 'Q2 2026 earnings: revenue beats at $28.24B, EPS misses at $0.33 vs $0.50 est.',
      source: 'TipRanks',
    },
    {
      date: 'Jul 23, 2026',
      title: 'CapEx to exceed $25B for 2026 as robotaxi, Optimus, AI compute accelerate',
      source: 'NASDAQ',
    },
    {
      date: 'Jul 23, 2026',
      title: 'Free cash flow turns negative as Tesla pivots from autos to AI infrastructure',
      source: 'Trefis',
    },
    {
      date: 'Apr 22, 2026',
      title: 'Q1 2026 earnings top estimates as AI and robotaxi investments accelerate',
      source: 'Anadolu Agency',
    },
  ];

  return (
    <section className="section" id="news">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">// Market Intelligence</span>
          <h2>What the tape<br /><span className="dim">is telling you.</span></h2>
        </div>
        <div className="news-list reveal d1">
          {newsItems.map((item, index) => (
            <div key={index} className="news-item">
              <div className="news-date">{item.date}</div>
              <div className="news-title">{item.title}</div>
              <div className="news-source">{item.source}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default News;