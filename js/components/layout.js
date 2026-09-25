// ==========================================
// 3. LAYOUT COMPONENTS
// ==========================================
const Layout = {
  Header: () => /*html*/`
    <nav class="fixed w-full z-50 transition-all duration-300 bg-white/90 backdrop-blur-xl border-b border-transparent" id="navbar">
      <div class="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        <div class="flex justify-between items-center h-20 md:h-24">
          <div class="flex-shrink-0 flex items-center">
            <a href="/" class="flex items-center gap-3">
              <img src="/skynex-online.svg" alt="Skynex Solutions Logo" class="h-6 md:h-8 w-auto" onerror="this.src='https://placehold.co/150x40/ffffff/050505?text=SKYNEX'">
            </a>
          </div>
          <div class="hidden md:flex space-x-10 items-center">
            ${UI.DesktopNavLinks()}
            <a href="/contact" class="ml-6 px-6 py-2.5 rounded-full bg-skynex-dark text-white text-xs font-bold tracking-widest uppercase hover:bg-slate-800 transition-colors">
              Engage
            </a>
          </div>
          <div class="md:hidden flex items-center">
            <button id="mobile-menu-btn" class="text-skynex-dark dark:text-white focus:outline-none p-2">
              <i class="fa-solid fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>

      <div id="mobile-menu" class="fixed inset-0 z-40 bg-white dark:bg-neutral-900 transform translate-x-full transition-transform duration-500 ease-in-out md:hidden pt-28 px-6 overflow-y-auto pb-10">
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
          </div>
          <div class="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
            <span class="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase">Stay Connected</span>
            <div class="flex gap-4 justify-center">
              <a href="#" class="text-slate-800 hover:text-skynex-blue transition-colors"><i class="fa-brands fa-linkedin-in text-lg"></i></a>
              <a href="#" class="text-slate-800 hover:text-skynex-dark dark:hover:text-white transition-colors"><i class="fa-brands fa-x-twitter text-lg"></i></a>
              <a href="#" class="text-slate-800 hover:text-skynex-dark dark:hover:text-white transition-colors"><i class="fa-brands fa-instagram text-lg"></i></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `
};
