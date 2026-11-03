// /search?q=... results page. Static results appear instantly; live news/leadership are added when
// they arrive. If the live part fails, the static results still show with a short notice.
(async () => {
  const q = (new URLSearchParams(location.search).get('q') || '').trim().slice(0, 100);
  const out = document.getElementById('search-results');
  const input = document.getElementById('search-q');
  input.value = q;
  document.getElementById('search-title').textContent = q ? `Results for “${q}”` : 'Search';
  if (q) document.title = `Search: ${q} | Skynex Solutions Limited`;
  if (!q) { out.innerHTML = '<p class="search-msg">Search products, services, news and more. Try “Trideta”, “web”, or “careers”.</p>'; return; }

  const ORDER = ['Product', 'Capability', 'News', 'Leadership', 'Company', 'Legal'];
  const draw = (live, failed) => {
    const hits = SiteSearch.search(q, live);
    if (!hits.length) {
      out.innerHTML = `<p class="search-msg">Nothing matched “${UI.esc(q)}”. Check the spelling, try a shorter word, or <a href="/sitemap" style="text-decoration:underline">browse the sitemap</a>.</p>${failed ? '<p class="search-msg" style="padding-top:0">News and leadership results could not be loaded just now.</p>' : ''}`;
      return;
    }
    const groups = ORDER.map(c => [c, hits.filter(h => h.category === c)]).filter(([, g]) => g.length);
    out.innerHTML = `<p class="sr-only" role="status">${hits.length} result${hits.length > 1 ? 's' : ''}</p>` + groups.map(([c, g]) => `
      <section class="search-group" aria-label="${UI.esc(c)}">
        <h2>${UI.esc(c)} (${g.length})</h2>
        ${g.map(h => `<a class="search-result" href="${UI.esc(h.url)}"${h.external ? ' target="_blank" rel="noopener noreferrer"' : ''}>
          <span class="search-result__title">${SiteSearch.highlight(h.title, q)}</span>
          ${h.desc ? `<p class="search-result__desc">${SiteSearch.highlight(SiteSearch.snippet(h.desc, 200), q)}</p>` : ''}
          <p class="search-result__url">${UI.esc(h.external ? h.url.replace(/^https?:\/\//, '') : h.url)}</p></a>`).join('')}
      </section>`).join('') + (failed ? '<p class="search-msg">News and leadership results could not be loaded just now.</p>' : '');
  };

  out.innerHTML = '<p class="search-msg" role="status">Searching…</p>';
  if (SiteSearch.search(q, []).length) draw([], false);
  const r = await SiteSearch.loadLive();
  draw(r.entries, r.failed);
})();
