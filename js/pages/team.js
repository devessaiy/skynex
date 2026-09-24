// Leadership page: reads the team from the database (table: leadership_members).
// Visitors only ever see rows where is_active = true (enforced by RLS, not just this query).
(async () => {
  const grid = document.getElementById('team-grid');
  if (!grid) return;

  const skeleton = Array.from({ length: 3 }, () => /*html*/`
    <div class="pb-12 sm:pb-0 sm:px-8 md:px-10 first:pl-0 last:pr-0 animate-pulse">
      <div class="aspect-[4/5] w-full bg-skynex-border/60"></div>
      <div class="pt-6 space-y-3"><div class="h-4 w-2/3 bg-skynex-border/60"></div><div class="h-3 w-1/2 bg-skynex-border/60"></div></div>
    </div>`).join('');
  grid.innerHTML = skeleton;

  try {
    const rows = await PublicAPI.select('leadership_members',
      'select=id,full_name,position_title,bio,photo_path,linkedin_url,instagram_url&is_active=eq.true&order=display_order.asc,created_at.asc');

    if (!rows.length) {
      grid.className = 'max-w-6xl mx-auto';
      grid.innerHTML = '<p class="text-center text-slate-500 font-light py-16">Our leadership profiles will be published here soon.</p>';
      return;
    }
    grid.innerHTML = rows.map(m => UI.TeamCard({
      name: m.full_name,
      role: m.position_title,
      description: m.bio,
      photo: PublicAPI.mediaUrl('team-photos', m.photo_path),
      linkedin: m.linkedin_url,
      instagram: m.instagram_url
    })).join('');
  } catch (err) {
    console.error('Leadership load failed:', err);
    grid.className = 'max-w-6xl mx-auto';
    grid.innerHTML = '<p class="text-center text-slate-500 font-light py-16">We could not load our leadership team right now. Please refresh in a moment.</p>';
  }
})();
