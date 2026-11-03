// Hero dot-matrix: the Skynex mark rendered as a halftone field on a <canvas>.
// - The mark is the site's own /skynex-offline.svg, sampled on a grid; each dot's size follows how much
//   of its cell the mark covers. A few sparse stray dots surround it (fixed pattern, not random per load).
// - One reveal sweep on load, then static. No continuous animation, so no ongoing CPU/battery cost.
// - prefers-reduced-motion: drawn instantly. If the SVG or canvas fails, the plain <img> fallback in the
//   markup stays visible. Colours follow the OS light/dark setting via the --sx-dot CSS variable.
const HeroField = (() => {
  const SRC = { x: 30, y: 145, w: 452, h: 222 };          // crop around the mark inside the 512x512 viewBox
  const ASPECT = SRC.w / SRC.h;
  let img = null;

  const load = () => new Promise((resolve, reject) => {
    if (img) return resolve(img);
    const i = new Image();
    i.onload = () => { img = i; resolve(i); };
    i.onerror = reject;
    i.src = '/skynex-offline.svg';
  });

  // Small deterministic generator so the stray dots are identical on every load.
  const rng = (seed) => () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;

  function draw(box, canvas, image, progress) {
    const cssW = box.clientWidth, cssH = box.clientHeight;
    if (!cssW || !cssH) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(cssW * dpr); canvas.height = Math.round(cssH * dpr);
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, cssW, cssH);

    const step = Math.max(4.5, Math.min(8, cssW / 150));            // grid pitch in CSS px
    const cols = Math.floor(cssW / step), rows = Math.floor(cssH / step);
    // Fit the mark inside the box, centred.
    let mw = cssW * .86, mh = mw / ASPECT;
    if (mh > cssH * .92) { mh = cssH * .92; mw = mh * ASPECT; }
    const mx = (cssW - mw) / 2, my = (cssH - mh) / 2;

    // Coverage grid: draw the mark into a tiny offscreen canvas, 1 pixel per cell... at 4x for smooth alpha.
    const S = 4, off = document.createElement('canvas');
    off.width = cols * S; off.height = rows * S;
    const o = off.getContext('2d', { willReadFrequently: true });
    o.drawImage(image, SRC.x, SRC.y, SRC.w, SRC.h, (mx / step) * S, (my / step) * S, (mw / step) * S, (mh / step) * S);
    const data = o.getImageData(0, 0, off.width, off.height).data;

    const color = getComputedStyle(document.documentElement).getPropertyValue('--sx-dot').trim() || '17,17,19';
    const rand = rng(7);
    const revealX = progress * (cols + 8) - 4;                     // sweep front, in columns
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (c > revealX) continue;
        let a = 0;
        for (let sy = 0; sy < S; sy++) for (let sx = 0; sx < S; sx++) a += data[(((r * S + sy) * off.width) + (c * S + sx)) * 4 + 3];
        a /= 255 * S * S;
        let rad, alpha;
        if (a > .04) { rad = step * .5 * Math.sqrt(a) * .95; alpha = .35 + .5 * a; }
        else if (rand() < .012) { rad = step * .16; alpha = .35; }  // sparse stray dots, like the reference
        else { rand(); continue; }
        const fade = Math.min(1, (revealX - c) / 6);               // soft leading edge
        ctx.fillStyle = `rgba(${color},${(alpha * fade).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(c * step + step / 2, r * step + step / 2, rad, 0, 6.2832); ctx.fill();
      }
    }
  }

  async function init() {
    const box = document.querySelector('.hero__field');
    const canvas = box && box.querySelector('canvas');
    if (!canvas || !canvas.getContext) return;
    let image;
    try { image = await load(); } catch (e) { return; }           // keep the <img> fallback
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const paint = (p) => draw(box, canvas, image, p);
    try { paint(reduce ? 1 : 0); } catch (e) { console.warn('Hero field unavailable:', e); return; }
    box.classList.add('is-ready');

    if (reduce) { paint(1); }
    else {
      const t0 = performance.now(), DUR = 1400;
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / DUR);
        paint(1 - Math.pow(1 - p, 3));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
    let rt; const redraw = () => { clearTimeout(rt); rt = setTimeout(() => paint(1), 120); };
    if ('ResizeObserver' in window) new ResizeObserver(redraw).observe(box); else window.addEventListener('resize', redraw);
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', redraw);
  }
  return { init };
})();
document.addEventListener('DOMContentLoaded', HeroField.init);
