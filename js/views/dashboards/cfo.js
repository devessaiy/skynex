// ==========================================
// CFO Dashboard (dashboard shell for the 'cfo' role)
// ==========================================
Views.DashboardCFO = {
  render: () => DashboardShell.render("dashboard-cfo", "CFO Dashboard"),
  mount: (el) => DashboardShell.mount(el, "cfo")
};
