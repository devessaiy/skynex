// ==========================================
// CTO Dashboard (dashboard shell for the 'cto' role)
// ==========================================
Views.DashboardCTO = {
  render: () => DashboardShell.render("dashboard-cto", "CTO Dashboard"),
  mount: (el) => DashboardShell.mount(el, "cto")
};
