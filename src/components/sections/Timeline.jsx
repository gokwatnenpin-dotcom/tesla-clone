import React from 'react';

const Timeline = () => {
  const timelineItems = [
    {
      year: 'Phase 01 · 2026–2028',
      title: 'Autonomy at Scale',
      description:
        'Unsupervised self-driving rolls out across major metros. The fleet becomes a revenue-generating network. Robotaxi services launch in select cities.',
      delay: 0,
    },
    {
      year: 'Phase 02 · 2028–2030',
      title: 'Energy Becomes the Engine',
      description:
        'Storage deployments compound. Grid operators sign multi-decade contracts. Energy margins exceed automotive.',
      delay: 400,
    },
    {
      year: 'Phase 03 · 2030–2033',
      title: 'Optimus Enters the Workforce',
      description:
        'Humanoid robots move from pilot lines to general-purpose deployment, opening a market measured in billions of units.',
      delay: 800,
    },
    {
      year: 'Phase 04 · 2033–2036',
      title: 'The Compounding Decade',
      description:
        'Three exponential curves — energy, autonomy, robotics — compound on a single manufacturing base. Negative FCF turns positive as CapEx cycle normalizes.',
      delay: 1200,
    },
  ];

  return (
    <section className="section" id="roadmap">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">// Trajectory</span>
          <h2>The next<br /><span className="dim">ten years.</span></h2>
          <p className="sub">Illustrative milestones. Not company guidance.</p>
        </div>
        <div className="timeline">
          {timelineItems.map((item, index) => (
            <div key={index} className={`tl-item reveal d${index}`} style={{ transitionDelay: `${item.delay / 1000}s` }}>
              <div className="tl-year">{item.year}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Timeline;