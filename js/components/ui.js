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
  
  // Flat, divider-separated profile grid (mentor-listing style): portrait photo, name/role,
  // description, socials. No card box/shadow — the grid's own divider lines do the separating.
  //
  // Placeholder photo: a self-contained inline SVG silhouette (data URI), not remote/hotlinked.
  // It renders instantly with zero network requests, so a full roster never adds any load time.
  // Swap it out by giving a member a real `photo: 'assets/team/jane.jpg'` field — TeamCard uses
  // that automatically once it's present.
  _PLACEHOLDER_AVATAR: 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">' +
    '<rect width="400" height="500" fill="#f5f5f7"/>' +
    '<circle cx="200" cy="200" r="70" fill="#d4d4d8"/>' +
    '<path d="M60 460c0-90 63-150 140-150s140 60 140 150" fill="#d4d4d8"/>' +
    '</svg>'
  ),

  TeamCard: (member) => /*html*/`
    <div class="pb-12 sm:pb-0 sm:px-8 md:px-10 first:pl-0 last:pr-0">
      <div class="aspect-[4/5] w-full overflow-hidden bg-skynex-gray">
        <img src="${member.photo || UI._PLACEHOLDER_AVATAR}" alt="${member.name}" loading="lazy" width="400" height="500" class="w-full h-full object-cover">
      </div>
      <div class="pt-6">
        <h3 class="text-base font-bold text-skynex-dark uppercase tracking-widest mb-1">${member.name}</h3>
        <p class="text-sm text-slate-500 font-medium mb-4">${member.role}</p>
        <p class="text-sm text-slate-500 font-light leading-relaxed mb-5">${member.description}</p>
        <div class="flex items-center gap-3">
          <a href="${member.linkedin}" aria-label="${member.name} on LinkedIn" class="w-8 h-8 rounded-full border border-skynex-border flex items-center justify-center text-skynex-dark hover:bg-skynex-dark hover:text-white hover:border-skynex-dark transition-colors">
            <i class="fa-brands fa-linkedin-in text-xs"></i>
          </a>
          <a href="${member.instagram}" aria-label="${member.name} on Instagram" class="w-8 h-8 rounded-full border border-skynex-border flex items-center justify-center text-skynex-dark hover:bg-skynex-dark hover:text-white hover:border-skynex-dark transition-colors">
            <i class="fa-brands fa-instagram text-xs"></i>
          </a>
        </div>
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
