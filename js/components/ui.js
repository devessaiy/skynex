// ==========================================
// 2. REUSABLE UI COMPONENTS
// ==========================================
const UI = {
  DesktopNavLinks: () => AppConfig.navLinks.map(link => 
    /*html*/`<a href="${link.href}" class="nav-link text-sm font-semibold tracking-wide uppercase">${link.label}</a>`
  ).join(''),
  
  MobileNavLinks: () => AppConfig.navLinks.map(link => 
    /*html*/`<a href="${link.href}" class="mobile-link text-skynex-dark">${link.label}</a>`
  ).join(''),
  
  TeamCard: (member) => /*html*/`
    <div class="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-10 items-start">
      <div class="w-40 h-40 flex-shrink-0 rounded-full overflow-hidden bg-slate-200 border border-slate-300">
        <img src="https://placehold.co/400x400/e2e8f0/64748b?text=${member.initials}" alt="${member.name}" class="w-full h-full object-cover">
      </div>
      <div>
        <h3 class="text-3xl font-bold text-skynex-dark mb-2">${member.name}</h3>
        <p class="text-sm font-bold tracking-widest uppercase text-skynex-blue mb-6">${member.role}</p>
        <p class="text-slate-600 font-light leading-relaxed mb-6">${member.description}</p>
        <a href="${member.linkedin}" class="text-skynex-dark hover:text-skynex-blue transition-colors">
          <i class="fa-brands fa-linkedin text-xl"></i>
        </a>
      </div>
    </div>
  `,

  ServiceListItem: (item) => /*html*/`
    <div class="grid grid-cols-1 md:grid-cols-12 gap-8 py-10 group">
      <div class="md:col-span-4">
        <h3 class="text-2xl font-bold text-skynex-dark">${item.title}</h3>
      </div>
      <div class="md:col-span-8">
        <p class="text-lg text-slate-600 font-light leading-relaxed">${item.desc}</p>
      </div>
    </div>
  `,

  // One footer accordion column (heading + list of links).
  // Mobile: heading and links are left-aligned. Desktop (md+) layout is unchanged.
  FooterColumn: (column) => /*html*/`
    <div class="border-b border-slate-100 md:border-none">
      <button class="footer-btn relative w-full flex justify-start items-center md:pointer-events-none py-4 md:py-0">
        <h4 class="text-sm font-bold text-skynex-dark uppercase tracking-widest md:mb-6">${column.title}</h4>
        <i class="fa-solid fa-plus absolute right-0 md:hidden text-skynex-dark transition-transform duration-300"></i>
      </button>
      <div class="grid grid-rows-[0fr] md:grid-rows-[1fr] transition-[grid-template-rows] duration-300">
        <div class="overflow-hidden">
          <ul class="space-y-4 pb-6 md:pb-0 text-left">
            ${column.links.map(link => UI.FooterLink(link)).join('')}
          </ul>
        </div>
      </div>
    </div>
  `,

  FooterLink: (link) => {
    const cls = link.accent
      ? 'text-sm font-semibold text-skynex-blue hover:underline transition-all'
      : 'text-sm text-slate-600 hover:text-skynex-dark hover:underline transition-all';
    const target = link.newTab ? ' target="_blank" rel="noopener noreferrer"' : '';
    const icon = link.icon ? ' <i class="fa-solid fa-arrow-up-right-from-square text-[10px] ml-1 opacity-50"></i>' : '';
    return /*html*/`<li><a href="${link.href}"${target} class="${cls}">${link.label}${icon}</a></li>`;
  }
};
