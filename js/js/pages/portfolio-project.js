
// Keep canonical/Open Graph tags in step with the content that was loaded (crawlers that run JavaScript read these).
const setMeta = (sel, attr, val) => { let el = document.head.querySelector(sel); if (!el) { el = document.createElement(sel.startsWith('link') ? 'link' : 'meta'); const m = sel.match(/\[(\w+(?::\w+)?)="([^"]+)"\]/); if (m) el.setAttribute(m[1], m[2]); document.head.appendChild(el); } el.setAttribute(attr, val); };
// Project detail. URL is /portfolio/<slug> (Firebase rewrite) or /portfolio-project?slug=<slug>.
(async () => {
  const root = document.getElementById('project-root');
  const fromPath = location.pathname.match(/^\/portfolio\/([^/]+)\/?$/);
  const slug = decodeURIComponent((fromPath && fromPath[1]) || new URLSearchParams(location.search).get('slug') || '').toLowerCase();

  const notFound = (msg) => {
    const m = document.createElement('meta'); m.name = 'robots'; m.content = 'noindex'; document.head.appendChild(m);
    document.title = 'Project not found | Skynex Solutions Limited';
    root.innerHTML = `<div class="py-16 max-w-xl"><h1 class="text-3xl font-bold tracking-tighter text-skynex-dark dark:text-white mb-4">Project not available</h1><p class="text-slate-500 dark:text-slate-400 font-light mb-8">${UI.esc(msg)}</p><a href="/portfolio" class="inline-block px-6 py-3 rounded-full bg-skynex-dark text-white text-sm font-bold">See all projects</a></div>`;
  };

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) return notFound('We could not find that project.');
  try {
    const rows = await PublicAPI.select('portfolio_projects',
      `select=title,slug,short_description,description,category,technologies,completed_on,client_name,live_url,featured_image_path,gallery_paths,is_featured&status=eq.published&slug=eq.${encodeURIComponent(slug)}&limit=1`);
    if (!rows.length) return notFound('This project may have been moved or removed.');
    const p = rows[0];
    document.title = `${p.title} | Skynex Solutions Limited`;
    const d = document.querySelector('meta[name="description"]'); if (d) d.content = p.short_description;
    root.innerHTML = PortfolioView.detail(p);
    const url = `${AppConfig.siteUrl}/portfolio/${encodeURIComponent(p.slug)}`;
    setMeta('link[rel="canonical"]', 'href', url); setMeta('meta[property="og:url"]', 'content', url);
    setMeta('meta[property="og:title"]', 'content', p.title); setMeta('meta[property="og:description"]', 'content', p.short_description);
    setMeta('meta[name="twitter:title"]', 'content', p.title); setMeta('meta[name="twitter:description"]', 'content', p.short_description);
  } catch (e) {
    console.error('Project load failed:', e);
    root.innerHTML = '<p class="text-slate-500 dark:text-slate-400 font-light py-16">We could not load this project right now. Please refresh in a moment.</p>';
  }
})();
