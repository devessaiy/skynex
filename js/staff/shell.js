// ==========================================
// STAFF PORTAL SHELL
// ==========================================
// Shared frame for every /staff/* page except login: route guard, sidebar, mobile drawer, plus
// small UI helpers (toast, confirm, side drawer).
//
// This decides what to SHOW. It grants nothing: every read and write the pages make is checked
// again by Postgres RLS against the existing role_permissions table, so editing this file in
// devtools cannot unlock anything.
const Staff = {
  esc: (v) => UI.esc(v),

  NAV: [
    { key: 'overview',   href: '/staff/dashboard',  label: 'Overview',       icon: 'fa-gauge-high' },
    { key: 'messages',   href: '/staff/messages',   label: 'Messages',       icon: 'fa-envelope',   perm: 'view_contact_submissions' },
    { key: 'news',       href: '/staff/news',       label: 'News',           icon: 'fa-newspaper',  perm: 'manage_news' },
    { key: 'leadership', href: '/staff/leadership', label: 'Leadership',     icon: 'fa-users',      perm: 'manage_leadership' },
    { key: 'account',    href: '/staff/account',    label: 'My Account',     icon: 'fa-user-gear' }
  ],

  PERMISSION_LABELS: {
    view_contact_submissions: 'Read visitor messages',
    manage_contact_submissions: 'Update message status',
    manage_news: 'Publish and manage news',
    manage_leadership: 'Manage the Leadership team'
  },

  logoHtml: (cls = 'h-6 w-auto') => /*html*/`
    <img src="/skynex-online.svg" alt="Skynex" class="${cls}"
      onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'Skynex',className:'text-lg font-bold tracking-tighter text-skynex-dark dark:text-white'}))">`,

  initials(name) {
    return (String(name || '?').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('') || '?').toUpperCase();
  },

  // ---- boot ---------------------------------------------------------------------------
  async init({ active, permission = null } = {}) {
    const root = document.getElementById('staff-app');
    const here = window.location.pathname;

    let session = null;
    try { session = await Auth.getSession(); } catch (e) { console.error(e); }
    if (!session) { window.location.replace('/staff/login?redirect=' + encodeURIComponent(here)); return null; }

    const profile = await Auth.getProfile();
    if (!profile) {
      Staff.fatal(root, 'Could not load your profile', 'You are signed in, but your staff profile could not be loaded. Please try again, or contact an administrator.');
      return null;
    }
    if (!profile.role_code) {
      Staff.fatal(root, 'No role assigned yet', 'Your staff account is active, but no role has been assigned to it yet. Please contact an administrator.');
      return null;
    }

    const perms = await Auth.getPermissions();
    if (permission && !perms.has(permission)) { window.location.replace('/staff/dashboard'); return null; }

    const roleName = (profile.roles && profile.roles.name) || profile.role_code.toUpperCase();
    const displayName = profile.full_name || profile.email;
    Staff.renderFrame(root, { active, perms, profile, roleName, displayName });

    return { profile, perms, roleName, displayName, db: SupabaseClient.get(), main: document.getElementById('staff-main') };
  },

  logout: async () => { await Auth.signOut(); window.location.assign('/staff/login'); },

  fatal(root, title, body) {
    root.className = 'min-h-screen flex items-center justify-center px-6 bg-skynex-gray dark:bg-neutral-950';
    root.innerHTML = /*html*/`
      <div class="text-center max-w-md">
        <h1 class="text-2xl font-bold text-skynex-dark dark:text-white tracking-tighter mb-4">${title}</h1>
        <p class="text-slate-500 dark:text-slate-400 font-light mb-8">${body}</p>
        <button data-logout class="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-skynex-dark dark:hover:text-white transition-colors">Log Out</button>
      </div>`;
    root.querySelector('[data-logout]').addEventListener('click', Staff.logout);
  },

  renderFrame(root, { active, perms, profile, roleName, displayName }) {
    const links = Staff.NAV.filter(i => !i.perm || perms.has(i.perm)).map(i => /*html*/`
      <a href="${i.href}" class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${i.key === active ? 'bg-skynex-gray dark:bg-neutral-800 text-skynex-dark dark:text-white font-semibold' : 'text-slate-500 dark:text-slate-400 hover:bg-skynex-gray dark:hover:bg-neutral-800 hover:text-skynex-dark dark:hover:text-white font-medium'}">
        <i class="fa-solid ${i.icon} w-5 text-center"></i>${i.label}
      </a>`).join('');

    root.className = '';
    root.innerHTML = /*html*/`
      <div class="min-h-screen lg:flex bg-skynex-gray dark:bg-neutral-950">
        <div id="staff-backdrop" class="hidden fixed inset-0 z-30 bg-skynex-dark/50 lg:hidden"></div>

        <aside id="staff-sidebar" class="fixed inset-y-0 left-0 z-40 w-72 max-w-[85vw] shrink-0 lg:sticky lg:top-0 lg:h-screen bg-white dark:bg-neutral-900 border-r border-skynex-border dark:border-neutral-800 flex flex-col -translate-x-full lg:translate-x-0 transition-transform duration-300">
          <div class="h-20 px-6 flex items-center gap-3 border-b border-skynex-border dark:border-neutral-800 shrink-0">
            ${Staff.logoHtml('h-6 w-auto')}
            <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-l border-skynex-border dark:border-neutral-800 pl-3">Staff Portal</span>
          </div>
          <nav class="flex-1 overflow-y-auto p-4 space-y-1">${links}</nav>
          <div class="p-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-skynex-border dark:border-neutral-800 shrink-0 space-y-3">
            <div class="flex items-center gap-3 px-2">
              <div class="w-10 h-10 shrink-0 rounded-full bg-skynex-dark text-white text-xs font-bold flex items-center justify-center">${Staff.esc(Staff.initials(displayName))}</div>
              <div class="min-w-0">
                <p class="text-sm font-semibold text-skynex-dark dark:text-white truncate">${Staff.esc(displayName)}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400 truncate">${Staff.esc(roleName)}${profile.position_title ? ' · ' + Staff.esc(profile.position_title) : ''}</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <a href="/" class="text-center text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-skynex-dark dark:hover:text-white border border-skynex-border dark:border-neutral-800 rounded-full py-2.5 transition-colors">Website</a>
              <button data-logout class="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-white hover:bg-skynex-dark border border-skynex-border dark:border-neutral-800 hover:border-skynex-dark rounded-full py-2.5 transition-colors">Log out</button>
            </div>
          </div>
        </aside>

        <div class="flex-1 min-w-0">
          <header class="lg:hidden sticky top-0 z-20 h-16 px-4 flex items-center justify-between bg-white/90 backdrop-blur-xl border-b border-skynex-border dark:border-neutral-800">
            <button id="staff-menu-btn" aria-label="Open menu" class="p-2 text-skynex-dark dark:text-white"><i class="fa-solid fa-bars text-xl"></i></button>
            ${Staff.logoHtml('h-5 w-auto')}
            <span class="w-9"></span>
          </header>
          <main id="staff-main" class="page-view px-5 sm:px-8 lg:px-12 py-8 lg:py-12 max-w-6xl mx-auto"></main>
        </div>
      </div>
      <div id="staff-toasts" class="fixed bottom-4 right-4 left-4 sm:left-auto z-[60] flex flex-col items-stretch sm:items-end gap-2 pointer-events-none"></div>`;

    const sidebar = document.getElementById('staff-sidebar');
    const backdrop = document.getElementById('staff-backdrop');
    const setOpen = (open) => {
      sidebar.classList.toggle('-translate-x-full', !open);
      backdrop.classList.toggle('hidden', !open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    document.getElementById('staff-menu-btn').addEventListener('click', () => setOpen(true));
    backdrop.addEventListener('click', () => setOpen(false));
    root.querySelectorAll('[data-logout]').forEach(b => b.addEventListener('click', Staff.logout));
  },

  // ---- helpers ------------------------------------------------------------------------
  pageHeader: (title, subtitle = '', actionHtml = '') => /*html*/`
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl md:text-4xl font-bold text-skynex-dark dark:text-white tracking-tighter">${title}</h1>
        ${subtitle ? `<p class="text-slate-500 dark:text-slate-400 font-light mt-2 max-w-2xl">${subtitle}</p>` : ''}
      </div>
      ${actionHtml}
    </div>`,

  primaryBtn: 'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-skynex-dark text-white text-xs font-bold tracking-widest uppercase hover:bg-skynex-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
  ghostBtn: 'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-skynex-border dark:border-neutral-800 text-skynex-dark dark:text-white text-xs font-bold tracking-widest uppercase hover:border-skynex-dark transition-colors disabled:opacity-50',
  inputCls: 'w-full border border-skynex-border dark:border-neutral-800 rounded-lg px-4 py-3 text-base text-skynex-dark dark:text-white bg-white dark:bg-neutral-900 focus:outline-none focus:border-skynex-dark transition-colors',
  labelCls: 'block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2',

  toast(message, type = 'success') {
    const host = document.getElementById('staff-toasts');
    if (!host) return;
    const el = document.createElement('div');
    el.className = `pointer-events-auto max-w-md px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white ${type === 'error' ? 'bg-red-600' : 'bg-skynex-dark'}`;
    el.textContent = message;
    host.appendChild(el);
    setTimeout(() => el.remove(), type === 'error' ? 6000 : 3500);
  },

  formatDateTime: (iso) => new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
  formatDate: (iso) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),

  confirm({ title, message, confirmLabel = 'Confirm', danger = false }) {
    return new Promise(resolve => {
      const wrap = document.createElement('div');
      wrap.className = 'fixed inset-0 z-[70] flex items-center justify-center px-6 bg-skynex-dark/60 backdrop-blur-sm';
      wrap.innerHTML = /*html*/`
        <div class="w-full max-w-sm bg-white dark:bg-neutral-900 rounded-2xl p-8" role="dialog" aria-modal="true">
          <h2 class="text-lg font-bold text-skynex-dark dark:text-white tracking-tighter mb-2">${Staff.esc(title)}</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 font-light mb-8">${Staff.esc(message)}</p>
          <div class="flex gap-3 justify-end">
            <button data-no class="${Staff.ghostBtn}">Cancel</button>
            <button data-yes class="inline-flex items-center justify-center px-6 py-3 rounded-full text-white text-xs font-bold tracking-widest uppercase transition-colors ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-skynex-dark hover:bg-skynex-blue'}">${Staff.esc(confirmLabel)}</button>
          </div>
        </div>`;
      const done = (v) => { document.removeEventListener('keydown', onKey); wrap.remove(); resolve(v); };
      const onKey = (e) => { if (e.key === 'Escape') done(false); };
      document.addEventListener('keydown', onKey);
      wrap.querySelector('[data-no]').addEventListener('click', () => done(false));
      wrap.querySelector('[data-yes]').addEventListener('click', () => done(true));
      wrap.addEventListener('click', (e) => { if (e.target === wrap) done(false); });
      document.body.appendChild(wrap);
      wrap.querySelector('[data-no]').focus();
    });
  },

  // Right-hand slide-over panel (full width on phones). Returns { body, close }.
  drawer({ title, html = '', onClose = null }) {
    const wrap = document.createElement('div');
    wrap.className = 'fixed inset-0 z-50';
    wrap.innerHTML = /*html*/`
      <div data-backdrop class="absolute inset-0 bg-skynex-dark/50"></div>
      <div class="absolute inset-y-0 right-0 w-full sm:max-w-xl bg-white dark:bg-neutral-900 shadow-2xl flex flex-col" role="dialog" aria-modal="true">
        <div class="h-20 px-6 sm:px-8 flex items-center justify-between border-b border-skynex-border dark:border-neutral-800 shrink-0">
          <h2 class="text-lg font-bold text-skynex-dark dark:text-white tracking-tighter truncate">${Staff.esc(title)}</h2>
          <button data-close aria-label="Close" class="p-2 text-slate-400 hover:text-skynex-dark dark:hover:text-white transition-colors"><i class="fa-solid fa-xmark text-lg"></i></button>
        </div>
        <div data-body class="flex-1 overflow-y-auto px-6 sm:px-8 py-8">${html}</div>
      </div>`;
    const prevOverflow = document.body.style.overflow;
    const close = () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      wrap.remove();
      if (onClose) onClose();
    };
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    wrap.querySelector('[data-close]').addEventListener('click', close);
    wrap.querySelector('[data-backdrop]').addEventListener('click', close);
    document.body.style.overflow = 'hidden';
    document.body.appendChild(wrap);
    return { body: wrap.querySelector('[data-body]'), close };
  },

  statusBadge(status) {
    const map = {
      new: 'bg-blue-50 dark:bg-blue-950/40 text-skynex-blue', reviewed: 'bg-amber-50 dark:bg-amber-950/30 text-amber-700', resolved: 'bg-green-50 dark:bg-green-950/30 text-green-700',
      live: 'bg-green-50 dark:bg-green-950/30 text-green-700', scheduled: 'bg-amber-50 dark:bg-amber-950/30 text-amber-700', visible: 'bg-green-50 dark:bg-green-950/30 text-green-700', hidden: 'bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-slate-400'
    };
    return `<span class="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${map[status] || 'bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-slate-400'}">${Staff.esc(status)}</span>`;
  }
};
