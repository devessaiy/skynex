// ==========================================
// CEO Dashboard (dashboard shell for the 'ceo' role)
// ==========================================
Views.DashboardCEO = {
  render: () => DashboardShell.render("dashboard-ceo", "CEO Dashboard"),
  mount: (el, profile) => DashboardShell.mount(el, profile)
};
