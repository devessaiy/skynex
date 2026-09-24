// ==========================================
// COO Dashboard (dashboard shell for the 'coo' role)
// ==========================================
Views.DashboardCOO = {
  render: () => DashboardShell.render("dashboard-coo", "COO Dashboard"),
  mount: (el, profile) => DashboardShell.mount(el, profile)
};
