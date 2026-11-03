// Homepage "Selected work": shows up to 3 published projects marked as featured. The whole section stays
// hidden if there are none (or if loading fails), so an empty portfolio never leaves a blank block.
(async () => {
  const sec = document.getElementById('featured-work');
  if (!sec) return;
  try {
    const rows = await PublicAPI.select('portfolio_projects',
      'select=id,title,slug,short_description,category,featured_image_path,is_featured&status=eq.published&is_featured=eq.true&order=display_order.asc,completed_on.desc.nullslast&limit=3');
    if (!rows.length) return;
    document.getElementById('featured-work-grid').innerHTML = rows.map(PortfolioView.card).join('');
    sec.hidden = false;
  } catch (e) { console.error('Featured work failed to load:', e); }
})();
