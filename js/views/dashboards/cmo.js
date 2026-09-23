// ==========================================
// CMO Dashboard (dashboard shell for the 'cmo' role)
// ==========================================
Views.DashboardCMO = {
  render: () => DashboardShell.render("dashboard-cmo", "CMO Dashboard"),
  mount: (el) => DashboardShell.mount(el, "cmo")
};
