// Staff dashboard overview: a few live counts, scoped to what this role can see.
(async () => {
  const ctx = await Staff.init({ active: 'overview' });
  if (!ctx) return;
  const { main, perms, roleName, displayName, db } = ctx;

  main.innerHTML = Staff.pageHeader(`Welcome back, ${Staff.esc(displayName.split(' ')[0])}.`, `Signed in as ${Staff.esc(roleName)}.`);

  const cards = document.createElement('div');
  cards.className = 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4';
  main.appendChild(cards);

  const card = (label, value, href, icon) => /*html*/`
    <a href="${href}" class="block bg-white dark:bg-neutral-900 border border-skynex-border dark:border-neutral-800 rounded-2xl p-6 hover:border-skynex-dark transition-colors">
      <div class="flex items-center justify-between mb-4">
        <i class="fa-solid ${icon} text-skynex-blue text-lg"></i>
      </div>
      <p class="text-3xl font-bold text-skynex-dark dark:text-white tracking-tighter mb-1">${value}</p>
      <p class="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 dark:text-slate-500">${Staff.esc(label)}</p>
    </a>`;

  const jobs = [];
  if (perms.has('view_contact_submissions')) {
    jobs.push(db.from('contact_submissions').select('id', { count: 'exact', head: true }).eq('status', 'new')
      .then(r => cards.insertAdjacentHTML('beforeend', card('New messages', r.count ?? 0, '/staff/messages', 'fa-envelope'))));
  }
  if (perms.has('manage_news')) {
    jobs.push(db.from('news_posts').select('id', { count: 'exact', head: true }).gt('expires_at', new Date().toISOString())
      .then(r => cards.insertAdjacentHTML('beforeend', card('Live news posts', r.count ?? 0, '/staff/news', 'fa-newspaper'))));
  }
  if (perms.has('manage_leadership')) {
    jobs.push(db.from('leadership_members').select('id', { count: 'exact', head: true }).eq('is_active', true)
      .then(r => cards.insertAdjacentHTML('beforeend', card('Leadership members', r.count ?? 0, '/staff/leadership', 'fa-users'))));
  }
  cards.insertAdjacentHTML('beforeend', card('Your account', roleName, '/staff/account', 'fa-user-gear'));
  await Promise.all(jobs);
  if (!cards.children.length) cards.remove();
})();
