// ==========================================
// SHARED STAFF DASHBOARD SHELL
// ==========================================
// One shared shell reused by all six founder dashboard pages: header, name/role display,
// logout, and a placeholder content area. Deliberately minimal -- no invented business
// functionality (that's Phase 2). This file only decides what to SHOW; it never decides what a
// role is ALLOWED to see. The guard (session + role match) already ran in app.js before this
// page's content was even rendered, so `profile` here is guaranteed to already belong to the
// signed-in user and already match this page's role -- this file just displays it.
const DashboardShell = {
  render(id, dashboardTitle) {
    return /*html*/`
      <div id="view-${id}" class="spa-view bg-skynex-gray min-h-screen">
        <header class="border-b border-skynex-border bg-white">
          <div class="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 h-20 flex items-center justify-between">
            <div class="flex items-center gap-3 min-w-0">
              <span class="text-lg font-bold text-skynex-dark tracking-tighter">Skynex</span>
              <span class="text-xs font-bold uppercase tracking-widest text-slate-400 border-l border-skynex-border pl-3 truncate">Staff Portal</span>
            </div>
            <button data-dashboard-logout class="shrink-0 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-skynex-dark transition-colors">Log Out</button>
          </div>
        </header>

        <section class="pt-12 md:pt-16 pb-10 md:pb-12 border-b border-skynex-border bg-white">
          <div class="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
            <p data-dashboard-role class="text-sm font-bold uppercase tracking-widest text-skynex-blue mb-3">&nbsp;</p>
            <h1 class="text-3xl md:text-6xl font-bold text-skynex-dark tracking-tighter mb-4">${dashboardTitle}</h1>
            <p data-dashboard-welcome class="text-base md:text-lg text-slate-500 font-light">&nbsp;</p>
          </div>
        </section>

        <section class="py-12 md:py-16">
          <div class="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
            <div class="border border-dashed border-skynex-border rounded-2xl p-8 md:p-12 text-center bg-white">
              <p class="text-sm md:text-base text-slate-400 font-light">This dashboard is ready for role-specific content. No functionality has been built here yet beyond authentication and access control.</p>
            </div>
          </div>
        </section>
      </div>
    `;
  },

  mount(el, profile) {
    const welcomeEl = el.querySelector('[data-dashboard-welcome]');
    const roleEl = el.querySelector('[data-dashboard-role]');
    const logoutBtn = el.querySelector('[data-dashboard-logout]');

    logoutBtn.addEventListener('click', async () => {
      await Auth.signOut();
      window.location.href = '/staff/login';
    });

    const displayName = profile.full_name || profile.email;
    const roleName = (profile.roles && profile.roles.name) || profile.role_code.toUpperCase();
    welcomeEl.textContent = `Welcome back, ${displayName}.`;
    roleEl.textContent = roleName + (profile.position_title ? ` · ${profile.position_title}` : '');
  }
};
