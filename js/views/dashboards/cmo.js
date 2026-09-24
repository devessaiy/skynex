// ==========================================
// CMO Dashboard (dashboard shell for the 'cmo' role)
// ==========================================
Views.DashboardCMO = {
  render: () => DashboardShell.render("dashboard-cmo", "CMO Dashboard"),
  mount: (el, profile) => DashboardShell.mount(el, profile)
};
