// ==========================================
// STAFF DASHBOARD ROUTER  --  /staff/dashboard.html
// ==========================================
// Reads the signed-in user's OWN profile (RLS guarantees this, see migrations) and forwards
// to their specific dashboard page. If no role has been assigned yet, shows a plain message
// rather than guessing -- role assignment is an admin action, not something the frontend invents.
Views.StaffDashboardRouter = {
  render: () => /*html*/`
    <div id="view-staff-dashboard" class="spa-view min-h-screen flex items-center justify-center bg-skynex-gray px-6">
      <p data-loading class="text-slate-400 font-light">Loading your dashboard&hellip;</p>
    </div>
  `,
  mount: async (el) => {
    const profile = await Auth.getProfile();
    if (!profile) { window.location.href = '/staff/login'; return; }

    const path = profile.role_code && DASHBOARD_PATHS[profile.role_code];
    if (path) {
      window.location.href = path;
      return;
    }

    el.innerHTML = /*html*/`
      <div class="text-center px-6 max-w-md">
        <h1 class="text-2xl font-bold text-skynex-dark tracking-tighter mb-4">No Role Assigned Yet</h1>
        <p class="text-slate-500 font-light mb-8">Your staff account is active, but no dashboard role has been assigned to it yet. Please contact an administrator.</p>
        <button data-dashboard-logout class="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-skynex-dark transition-colors">Log Out</button>
      </div>
    `;
    el.querySelector('[data-dashboard-logout]').addEventListener('click', async () => {
      await Auth.signOut();
      window.location.href = '/staff/login';
    });
  }
};
