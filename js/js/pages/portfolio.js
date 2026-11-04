// Portfolio list. Only rows with status = 'published' are returned (enforced by RLS, not just this query).
(async () => {
  const grid = document.getElementById('portfolio-grid');
  const filters = document.getElementById('portfolio-filters');
  grid.innerHTML = Array.from({ length: 3 }, () => '<div class="animate-pulse"><div class="aspect-[16/10] bg-skynex-border/60 rounded-2xl"></div><div class="pt-5 space-y-3"><div class="h-4 w-1/3 bg-skynex-border/60"></div><div class="h-6 w-2/3 bg-skynex-border/60"></div></div></div>').join('');
  let rows;
  try {
    rows = await PublicAPI.select('portfolio_projects',
      'select=id,title,slug,short_description,category,featured_image_path,is_featured,completed_on&status=eq.published&order=is_featured.desc,display_order.asc,completed_on.desc.nullslast');
  } catch (e) {
    console.error('Portfolio load failed:', e);
    grid.className = 'max-w-3xl';
    grid.innerHTML = '<p class="text-slate-500 dark:text-slate-400 font-light py-12">We could not load our projects right now. Please refresh in a moment.</p>';
    return;
  }
  if (!rows.length) {
    grid.className = 'max-w-3xl';
    grid.innerHTML = '<p class="text-slate-500 dark:text-slate-400 font-light py-12">Our project showcase will be published here soon.</p>';
    return;
  }
  const cats = [...new Set(rows.map(r => r.category).filter(Boolean))].sort();
  let active = 'All';
  const draw = () => {
    const list = active === 'All' ? rows : rows.filter(r => r.category === active);
    grid.innerHTML = list.map(PortfolioView.card).join('');
    filters.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cat === active)));
  };
  if (cats.length > 1) {
    filters.innerHTML = ['All', ...cats].map(c => `<button type="button" data-cat="${UI.esc(c)}" aria-pressed="false" class="px-4 py-2 rounded-full text-sm border border-skynex-border dark:border-neutral-700 text-skynex-dark dark:text-white aria-pressed:bg-skynex-dark aria-pressed:text-white aria-pressed:border-skynex-dark transition-colors">${UI.esc(c)}</button>`).join('');
    filters.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { active = b.dataset.cat; draw(); } });
  }
  draw();
})();
