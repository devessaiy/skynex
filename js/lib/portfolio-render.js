// ==========================================
// PORTFOLIO RENDERING (shared by the public pages and the staff preview)
// ==========================================
// Every value is escaped; descriptions are plain text (blank line = new paragraph), never raw HTML.
// External links must be https:// and open with rel="noopener noreferrer".
const PortfolioView = {
  BUCKET: 'portfolio-media',
  esc: (v) => UI.esc(v),

  mediaUrl(path) {
    if (!path) return null;
    if (/^blob:/.test(path)) return path;            // staff preview of a not-yet-uploaded image
    const safe = String(path).split('/').map(encodeURIComponent).join('/');
    return `${AppConfig.supabase.url}/storage/v1/object/public/${PortfolioView.BUCKET}/${safe}`;
  },

  // Returns the URL only if it is a well-formed https:// URL, otherwise null.
  safeUrl(u) {
    try { const x = new URL(String(u || '')); return x.protocol === 'https:' ? x.href : null; } catch (e) { return null; }
  },

  monthYear: (d) => d ? new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : '',

  slugify: (s) => String(s || '').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80),

  href: (p) => '/portfolio/' + encodeURIComponent(p.slug),

  card(p, level = 3) {  // level: 2 on pages whose only parent heading is the page title (h1), 3 under a section heading
    const img = PortfolioView.mediaUrl(p.featured_image_path);
    const E = PortfolioView.esc;
    return /*html*/`
      <a href="${E(PortfolioView.href(p))}" class="group block">
        <div class="aspect-[16/10] w-full overflow-hidden bg-skynex-gray dark:bg-neutral-800 rounded-2xl">
          ${img
            ? `<img src="${E(img)}" alt="${E(p.title)}" loading="lazy" decoding="async" width="1600" height="1000" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" onerror="this.remove()">`
            : `<div class="w-full h-full flex items-center justify-center text-slate-600 dark:text-slate-400 text-sm">${E(p.title)}</div>`}
        </div>
        <div class="pt-5">
          <div class="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">
            ${p.category ? `<span>${E(p.category)}</span>` : ''}
            ${p.is_featured ? '<span class="text-skynex-bluetext dark:text-skynex-bluelight">Featured</span>' : ''}
          </div>
          <h${level} class="mt-2 text-2xl font-bold tracking-tight text-skynex-dark dark:text-white group-hover:underline underline-offset-4">${E(p.title)}</h${level}>
          <p class="mt-2 text-slate-600 dark:text-slate-400 font-light leading-relaxed">${E(p.short_description)}</p>
        </div>
      </a>`;
  },

  detail(p) {
    const E = PortfolioView.esc;
    const hero = PortfolioView.mediaUrl(p.featured_image_path);
    const live = PortfolioView.safeUrl(p.live_url);
    const paras = String(p.description || '').split(/\n\s*\n/).map(s => s.trim()).filter(Boolean)
      .map(s => `<p class="text-lg text-slate-600 dark:text-slate-300 font-light leading-relaxed">${E(s).replace(/\n/g, '<br>')}</p>`).join('');
    const meta = [
      ['Category', p.category], ['Client', p.client_name], ['Completed', PortfolioView.monthYear(p.completed_on)]
    ].filter(([, v]) => v).map(([k, v]) => `<div><dt class="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">${k}</dt><dd class="mt-1 text-skynex-dark dark:text-white">${E(v)}</dd></div>`).join('');
    const tech = (p.technologies || []).length
      ? `<div class="mt-8"><p class="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-3">Technologies</p><ul class="flex flex-wrap gap-2">${p.technologies.map(t => `<li class="px-3 py-1 text-sm rounded-full border border-skynex-border dark:border-neutral-700 text-skynex-dark dark:text-white">${E(t)}</li>`).join('')}</ul></div>` : '';
    const gallery = (p.gallery_paths || []).map(g => PortfolioView.mediaUrl(g)).filter(Boolean)
      .map(u => `<img src="${E(u)}" alt="${E(p.title)} screenshot" loading="lazy" decoding="async" class="w-full h-auto rounded-2xl bg-skynex-gray dark:bg-neutral-800" onerror="this.remove()">`).join('');
    return /*html*/`
      <article>
        <p class="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">${p.category ? E(p.category) : 'Project'}</p>
        <h1 class="mt-3 text-4xl md:text-6xl font-bold tracking-tighter text-skynex-dark dark:text-white">${E(p.title)}</h1>
        <p class="mt-5 text-xl text-slate-600 dark:text-slate-400 font-light max-w-3xl">${E(p.short_description)}</p>
        ${hero ? `<img src="${E(hero)}" alt="${E(p.title)}" decoding="async" fetchpriority="high" class="mt-10 w-full h-auto rounded-2xl bg-skynex-gray dark:bg-neutral-800" onerror="this.remove()">` : ''}
        <div class="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div class="lg:col-span-8 space-y-6">${paras}${tech}</div>
          <aside class="lg:col-span-4">
            ${meta ? `<dl class="space-y-5 pb-6 mb-6 border-b border-skynex-border dark:border-neutral-800">${meta}</dl>` : ''}
            ${live ? `<a href="${E(live)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-skynex-dark text-white text-sm font-bold hover:bg-slate-800 transition-colors">Visit live project<span class="sr-only"> (opens in a new tab)</span> <i class="fa-solid fa-arrow-up-right-from-square text-xs" aria-hidden="true"></i></a>` : ''}
          </aside>
        </div>
        ${gallery ? `<div class="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">${gallery}</div>` : ''}
      </article>`;
  }
};
