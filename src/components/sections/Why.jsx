import React from 'react';

const Why = () => {
  const cards = [
    {
      num: '01',
      icon: /* SVG */ `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/>
        </svg>
      `,
      title: 'Energy Storage',
      description: 'Grid-scale batteries and residential storage scaling faster than vehicles. Revenue reached $103.62B trailing twelve months[reference:4].',
      delay: 0,
    },
    {
      num: '02',
      icon: /* SVG */ `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
        </svg>
      `,
      title: 'Full Self-Driving',
      description: 'A software product with near-zero marginal cost. Every mile driven trains the fleet — a data moat no competitor can replicate.',
      delay: 100,
    },
    {
      num: '03',
      icon: /* SVG */ `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="5" y="7" width="14" height="12" rx="2"/><path d="M12 3v4M9 12h.01M15 12h.01M9 16h6"/>
        </svg>
      `,
      title: 'Optimus Robotics',
      description: 'A general-purpose humanoid at scale could be the largest product category in history. Tesla is already deploying pilots.',
      delay: 200,
    },
    {
      num: '04',
      icon: /* SVG */ `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 21V8l6-4 6 4v13M9 21v-6h6v6M15 21V10l6 3v8"/>
        </svg>
      `,
      title: 'Manufacturing Moat',
      description: 'Vertical integration from cell chemistry to castings. Gigafactories are the product — the cars are just the output.',
      delay: 300,
    },
    {
      num: '05',
      icon: /* SVG */ `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 17l6-6 4 4 8-8"/><path d="M21 7v5h-5"/>
        </svg>
      `,
      title: 'Operating Leverage',
      description: 'Fixed costs largely built. Every incremental unit drops through to gross margin. Q2 2026 revenue hit $28.24B[reference:5].',
      delay: 400,
    },
    {
      num: '06',
      icon: /* SVG */ `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="9"/><path d="M3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 0 1 0 18"/>
        </svg>
      `,
      title: 'The Mission',
      description: "Accelerating the world's transition to sustainable energy. Missions that matter attract talent, capital and patience.",
      delay: 500,
    },
  ];

  return (
    <section className="section" id="why">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">// The Thesis</span>
          <h2>Six reasons the<br /><span className="dim">curve bends upward.</span></h2>
        </div>
        <div className="cards">
          {cards.map((card, index) => (
            <article
              key={index}
              className={`card reveal d${index}`}
              style={{ transitionDelay: `${card.delay / 1000}s` }}
            >
              <span className="num">{card.num}</span>
              <div className="card-icon" dangerouslySetInnerHTML={{ __html: card.icon }}></div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Why;