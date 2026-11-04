// ==========================================
// 3. LAYOUT COMPONENTS
// ==========================================
const Layout = {
  Header: () => /*html*/`
    <nav class="fixed w-full z-50 transition-all duration-300 border-b border-transparent" id="navbar" aria-label="Main">
      <div class="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        <div class="flex justify-between items-center h-20 md:h-24">
          <div class="flex-shrink-0 flex items-center">
            <a href="/" class="flex items-center gap-3" aria-label="Skynex Solutions home">
              <img src="/skynex-online.svg" alt="" width="32" height="32" class="h-6 md:h-8 w-auto" onerror="this.src='https://placehold.co/150x40/ffffff/050505?text=SKYNEX'">
            </a>
          </div>
          <div class="hidden md:flex gap-x-6 lg:gap-x-9 items-center">
            ${UI.DesktopNavLinks()}
            <a href="/search" class="nav-icon-link" aria-label="Search the website">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
            </a>
            <a href="/contact" class="px-6 py-2.5 rounded-full bg-skynex-dark text-white text-xs font-bold tracking-widest uppercase hover:bg-slate-800 transition-colors">
              Engage
            </a>
          </div>
          <div class="md:hidden flex items-center gap-1">
            <a href="/search" class="nav-icon-link" aria-label="Search the website">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
            </a>
            <button id="mobile-menu-btn" type="button" class="nav-icon-link" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">
              <i class="fa-solid fa-bars text-xl" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>

      <div id="mobile-menu" inert class="fixed inset-0 z-40 bg-white dark:bg-neutral-900 transform translate-x-full transition-transform duration-500 ease-in-out md:hidden pt-28 px-6 overflow-y-auto pb-10" style="height:100vh;height:100dvh;padding-bottom:calc(2.5rem + env(safe-area-inset-bottom,0px))">
        <div class="flex flex-col space-y-8 text-3xl font-light tracking-tight text-center md:text-left">
          ${UI.MobileNavLinks()}
        </div>
        <div class="mt-16 pt-8 border-t border-skynex-border dark:border-neutral-800 text-center md:text-left">
          <p class="text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">Official Contact</p>
          <a href="mailto:${AppConfig.company.email}" class="text-lg text-skynex-blue block mb-2">${AppConfig.company.email}</a>
          <p class="text-slate-600 dark:text-slate-400">Suleja, Niger State, Nigeria.</p>
        </div>
      </div>
    </nav>
  `,

  Footer: () => /*html*/`
    <footer class="bg-white dark:bg-neutral-900 border-t border-skynex-border dark:border-neutral-800 pt-12 md:pt-16 pb-8">
      <div class="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-12 mb-12 md:mb-16">
          ${AppConfig.footerColumns.map(column => UI.FooterColumn(column)).join('')}
        </div>

        <div class="border-t border-skynex-border dark:border-neutral-800 mb-8"></div>

        <div class="mb-8">
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-4xl text-center md:text-left mx-auto md:mx-0">
            Copyright &copy; <span>${AppConfig.company.year}</span> ${AppConfig.company.name}. All Rights Reserved. RC: ${AppConfig.company.rc}.
            Trideta and associated product names are proprietary assets of Skynex Solutions Limited. Check our official contact pages for authentic communication.
          </p>
        </div>

        <div class="flex flex-col lg:flex-row justify-center lg:justify-between items-center gap-6">
          <div class="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2">
            <span class="text-xs font-bold text-skynex-dark dark:text-white uppercase">Nigeria/English</span>
            <span class="w-[1px] h-3 bg-slate-300 hidden sm:block"></span>
            <a href="/privacy-policy" class="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-skynex-dark dark:hover:text-white hover:underline transition-all">Privacy Policy</a>
            <a href="/terms-of-service" class="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-skynex-dark dark:hover:text-white hover:underline transition-all">Terms of Service</a>
            <a href="/legal" class="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-skynex-dark dark:hover:text-white hover:underline transition-all">Legal</a>
            <a href="/sitemap" class="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-skynex-dark dark:hover:text-white hover:underline transition-all">Sitemap</a>
            <a href="#cookie-settings" data-cookie-settings class="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-skynex-dark dark:hover:text-white hover:underline transition-all">Cookie Settings</a>
          </div>
          <div class="${AppConfig.company.social && Object.values(AppConfig.company.social).some(Boolean) ? 'flex' : 'hidden'} flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
            <span class="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase">Stay Connected</span>
            <div class="flex gap-4 justify-center">
              ${[['linkedin','fa-linkedin-in','LinkedIn'],['x','fa-x-twitter','X'],['instagram','fa-instagram','Instagram']]
                .filter(([k]) => AppConfig.company.social && AppConfig.company.social[k])
                .map(([k, icon, label]) => `<a href="${AppConfig.company.social[k]}" target="_blank" rel="noopener noreferrer" aria-label="Skynex on ${label}" class="text-slate-800 dark:text-slate-300 hover:text-skynex-blue transition-colors"><i class="fa-brands ${icon} text-lg" aria-hidden="true"></i></a>`).join('')}
            </div>
          </div>
        </div>
      </div>
    </footer>
  `
};
