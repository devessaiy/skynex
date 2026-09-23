// ==========================================
// R&D Dashboard (dashboard shell for the 'rnd' role)
// ==========================================
Views.DashboardRND = {
  render: () => DashboardShell.render("dashboard-rnd", "R&D Dashboard"),
  mount: (el) => DashboardShell.mount(el, "rnd")
};
