// Staff -> Messages: visitor/contact submissions. Reading requires view_contact_submissions;
// changing status requires manage_contact_submissions (both already exist in role_permissions).
(async () => {
  const ctx = await Staff.init({ active: 'messages', permission: 'view_contact_submissions' });
  if (!ctx) return;
  const { main, perms, db } = ctx;
  const canManage = perms.has('manage_contact_submissions');

  let filter = 'all';
  let rows = [];

  main.innerHTML = Staff.pageHeader('Messages', 'Enquiries submitted through the website\u2019s Contact form.');
  const tabsWrap = document.createElement('div');
  tabsWrap.className = 'flex gap-2 mb-6 overflow-x-auto pb-1';
  main.appendChild(tabsWrap);
  const listEl = document.createElement('div');
  listEl.className = 'space-y-3';
  main.appendChild(listEl);

  const TABS = [['all', 'All'], ['new', 'New'], ['reviewed', 'Reviewed'], ['resolved', 'Resolved']];
  function renderTabs() {
    tabsWrap.innerHTML = TABS.map(([key, label]) => {
      const count = key === 'all' ? rows.length : rows.filter(r => r.status === key).length;
      return `<button data-tab="${key}" class="shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${filter === key ? 'bg-skynex-dark text-white' : 'bg-white dark:bg-neutral-900 border border-skynex-border dark:border-neutral-800 text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:border-skynex-dark'}">${label} (${count})</button>`;
    }).join('');
    tabsWrap.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => { filter = b.dataset.tab; renderTabs(); renderList(); }));
  }

  function renderList() {
    const shown = filter === 'all' ? rows : rows.filter(r => r.status === filter);
    if (!shown.length) { listEl.innerHTML = `<p class="text-center text-slate-400 dark:text-slate-500 font-light py-16">No messages here.</p>`; return; }
    listEl.innerHTML = shown.map(r => /*html*/`
      <button data-open="${r.id}" class="w-full text-left bg-white dark:bg-neutral-900 border border-skynex-border dark:border-neutral-800 rounded-2xl p-5 hover:border-skynex-dark transition-colors flex items-start justify-between gap-4">
        <div class="min-w-0">
          <div class="flex items-center gap-2 mb-1 flex-wrap">
            <p class="font-bold text-skynex-dark dark:text-white truncate">${Staff.esc(r.name)}</p>
            ${Staff.statusBadge(r.status)}
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 truncate">${Staff.esc(r.email)}${r.company_name ? ' · ' + Staff.esc(r.company_name) : ''}</p>
          <p class="text-sm text-slate-400 dark:text-slate-500 font-light truncate mt-1">${Staff.esc(r.message)}</p>
        </div>
        <p class="shrink-0 text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">${Staff.esc(Staff.formatDate(r.created_at))}</p>
      </button>`).join('');
    listEl.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => openMessage(b.dataset.open)));
  }

  function openMessage(id) {
    const r = rows.find(x => x.id === id);
    if (!r) return;
    const replySubject = encodeURIComponent(`Re: Your enquiry to Skynex Solutions${r.service_needed ? ' — ' + r.service_needed : ''}`);
    const replyBody = encodeURIComponent(`Hi ${r.name},\n\nThank you for reaching out to Skynex Solutions Limited.\n\n`);
    const mailto = `mailto:${encodeURIComponent(r.email)}?subject=${replySubject}&body=${replyBody}`;

    const { body, close } = Staff.drawer({ title: r.name, html: /*html*/`
      <div class="space-y-6">
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div><p class="${Staff.labelCls}">Email</p><p class="text-skynex-dark dark:text-white break-all">${Staff.esc(r.email)}</p></div>
          <div><p class="${Staff.labelCls}">Company</p><p class="text-skynex-dark dark:text-white">${Staff.esc(r.company_name || '\u2014')}</p></div>
          <div><p class="${Staff.labelCls}">Service requested</p><p class="text-skynex-dark dark:text-white">${Staff.esc(r.service_needed || '\u2014')}</p></div>
          <div><p class="${Staff.labelCls}">Budget</p><p class="text-skynex-dark dark:text-white">${Staff.esc(r.budget_range || '\u2014')}</p></div>
          <div class="col-span-2"><p class="${Staff.labelCls}">Submitted</p><p class="text-skynex-dark dark:text-white">${Staff.esc(Staff.formatDateTime(r.created_at))}</p></div>
        </div>
        <div>
          <p class="${Staff.labelCls}">Message</p>
          <p class="text-skynex-dark dark:text-white font-light leading-relaxed whitespace-pre-wrap">${Staff.esc(r.message)}</p>
        </div>
        <a href="${mailto}" class="${Staff.primaryBtn} w-full"><i class="fa-solid fa-reply"></i> Reply via Email</a>
        ${canManage ? /*html*/`
        <div>
          <p class="${Staff.labelCls}">Status</p>
          <div class="flex gap-2" data-status-group>
            ${['new', 'reviewed', 'resolved'].map(s => `<button data-set-status="${s}" class="flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest border transition-colors ${r.status === s ? 'bg-skynex-dark text-white border-skynex-dark' : 'border-skynex-border dark:border-neutral-800 text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:border-skynex-dark'}">${s}</button>`).join('')}
          </div>
        </div>` : ''}
      </div>` });

    if (canManage) {
      body.querySelectorAll('[data-set-status]').forEach(btn => btn.addEventListener('click', async () => {
        const status = btn.dataset.setStatus;
        if (status === r.status) return;
        btn.closest('[data-status-group]').querySelectorAll('button').forEach(b => b.disabled = true);
        const { error } = await db.from('contact_submissions').update({ status }).eq('id', r.id);
        if (error) { Staff.toast('Could not update status.', 'error'); btn.closest('[data-status-group]').querySelectorAll('button').forEach(b => b.disabled = false); return; }
        r.status = status;
        Staff.toast('Status updated.');
        close(); renderTabs(); renderList();
      }));
    }
  }

  const { data, error } = await db.from('contact_submissions').select('*').order('created_at', { ascending: false });
  if (error) { main.insertAdjacentHTML('beforeend', `<p class="text-center text-red-600 py-16">Could not load messages.</p>`); return; }
  rows = data;
  renderTabs(); renderList();
})();
