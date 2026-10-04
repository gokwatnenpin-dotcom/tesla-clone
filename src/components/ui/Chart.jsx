import React, { useEffect, useRef } from 'react';

const Chart = ({ range }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const tip = document.getElementById('chartTip');
    const wrap = canvas.parentElement;
    let W = 0, H = 0, dpr = 1, data = [], hoverIndex = -1, currentRange = range;

    const RANGES = {
      '1D': { points: 78, start: 363.56, vol: 1.2, drift: 0.08, label: 'Today' },
      '1W': { points: 96, start: 355.20, vol: 2.0, drift: 0.10, label: 'This Week' },
      '1M': { points: 120, start: 342.80, vol: 2.8, drift: 0.14, label: 'This Month' },
      '1Y': { points: 150, start: 310.50, vol: 4.2, drift: 0.20, label: 'This Year' },
      'ALL': { points: 190, start: 180.00, vol: 6.0, drift: 0.30, label: 'All Time' }
    };

    function makeRandom(seed) {
      let s = seed;
      return () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
    }

    function generate(cfg, seed) {
      const rand = makeRandom(seed);
      const out = [];
      let v = cfg.start;
      for (let i = 0; i < cfg.points; i++) {
        const wave = Math.sin(i / 7) * cfg.drift * 1.5;
        const shock = (rand() - 0.47) * cfg.vol;
        v = Math.max(1, v + shock + wave + cfg.drift * 0.6);
        out.push(v);
      }
      return out;
    }

    function resize() {
      const rect = wrap.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(rect.width - 16, 100);
      H = Math.max(rect.height, 100);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }

    const PAD = { t: 20, b: 26, l: 0, r: 0 };
    const bounds = () => { const mn = Math.min(...data), mx = Math.max(...data); return { min: mn, max: mx, span: mx - mn || 1 }; };
    const xAt = i => PAD.l + (i / (data.length - 1)) * (W - PAD.l - PAD.r);
    const yAt = (v, b) => PAD.t + (1 - (v - b.min) / b.span) * (H - PAD.t - PAD.b);

    function draw() {
      if (!data.length || !W || !H) return;
      ctx.clearRect(0, 0, W, H);
      const b = bounds();

      // Grid
      ctx.strokeStyle = 'rgba(255,255,255,.04)'; ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) { const y = PAD.t + (i / 4) * (H - PAD.t - PAD.b); ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      for (let i = 0; i <= 6; i++) { const x = (i / 6) * W; ctx.beginPath(); ctx.moveTo(x, PAD.t); ctx.lineTo(x, H - PAD.b); ctx.stroke(); }

      // Labels
      ctx.font = '500 9.5px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.textAlign = 'right';
      ctx.fillText('$' + b.max.toFixed(2), W - 4, PAD.t - 6);
      ctx.fillText('$' + b.min.toFixed(2), W - 4, H - PAD.b + 14);

      // Area
      const g = ctx.createLinearGradient(0, PAD.t, 0, H - PAD.b);
      g.addColorStop(0, 'rgba(232,33,39,.28)');
      g.addColorStop(.6, 'rgba(232,33,39,.05)');
      g.addColorStop(1, 'rgba(232,33,39,0)');
      ctx.beginPath(); ctx.moveTo(xAt(0), yAt(data[0], b));
      for (let i = 1; i < data.length; i++) ctx.lineTo(xAt(i), yAt(data[i], b));
      ctx.lineTo(xAt(data.length - 1), H - PAD.b); ctx.lineTo(xAt(0), H - PAD.b); ctx.closePath();
      ctx.fillStyle = g; ctx.fill();

      // Line
      ctx.beginPath(); ctx.moveTo(xAt(0), yAt(data[0], b));
      for (let i = 1; i < data.length; i++) ctx.lineTo(xAt(i), yAt(data[i], b));
      ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.lineWidth = 1.8;
      ctx.strokeStyle = '#ff3b30';
      ctx.shadowColor = 'rgba(255,59,48,.6)'; ctx.shadowBlur = 12;
      ctx.stroke(); ctx.shadowBlur = 0;

      // Last dot
      const lx = xAt(data.length - 1), ly = yAt(data[data.length - 1], b);
      ctx.beginPath(); ctx.arc(lx, ly, 4, 0, Math.PI * 2); ctx.fillStyle = '#ff3b30'; ctx.fill();
      ctx.beginPath(); ctx.arc(lx, ly, 7.5, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(255,59,48,.3)'; ctx.lineWidth = 1.2; ctx.stroke();

      // Hover
      if (hoverIndex >= 0 && hoverIndex < data.length) {
        const hx = xAt(hoverIndex), hy = yAt(data[hoverIndex], b);
        ctx.beginPath(); ctx.setLineDash([3, 4]); ctx.moveTo(hx, PAD.t); ctx.lineTo(hx, H - PAD.b);
        ctx.strokeStyle = 'rgba(255,255,255,.2)'; ctx.lineWidth = 1; ctx.stroke(); ctx.setLineDash([]);
        ctx.beginPath(); ctx.arc(hx, hy, 4.5, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
        ctx.beginPath(); ctx.arc(hx, hy, 8, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(255,255,255,.4)'; ctx.lineWidth = 1; ctx.stroke();
      }
    }

    function onMove(e) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      hoverIndex = Math.round(clamp(x / W, 0, 1) * (data.length - 1));
      const value = data[hoverIndex], px = xAt(hoverIndex);
      tip.style.left = px + 'px';
      tip.innerHTML = `<span class="p">$${value.toFixed(2)}</span><span class="t">${RANGES[currentRange].label} · PT ${hoverIndex + 1}/${data.length}</span>`;
      tip.classList.add('show');
      draw();
    }
    function onLeave() { hoverIndex = -1; tip.classList.remove('show'); draw(); }
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);

    function setRange(range) {
      currentRange = range;
      const cfg = RANGES[range];
      const seed = range.split('').reduce((a, c) => a + c.charCodeAt(0), 7) * 977;
      data = generate(cfg, seed);
      hoverIndex = -1; tip.classList.remove('show'); draw();
    }

    function clamp(v, a, b) { return Math.min(Math.max(v, a), b); }

    window.addEventListener('resize', resize);
    setRange(range);
    resize();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, [range]);

  return (
    <div className="chart-wrap">
      <canvas ref={canvasRef} id="chart"></canvas>
      <div className="chart-tip" id="chartTip"></div>
    </div>
  );
};

export default Chart;