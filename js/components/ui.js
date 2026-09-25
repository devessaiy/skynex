// ==========================================
// 2. REUSABLE UI COMPONENTS
// ==========================================
const UI = {
  // Escape text that came from the database before putting it into HTML.
  esc: (value) => String(value ?? '').replace(/[&<>"']/g, ch => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
  )),

  DesktopNavLinks: () => AppConfig.navLinks.map(link => 
    /*html*/`<a href="${link.href}" class="nav-link text-sm font-semibold tracking-wide uppercase">${link.label}</a>`
  ).join(''),
  
  MobileNavLinks: () => AppConfig.navLinks.map(link => 
    /*html*/`<a href="${link.href}" class="mobile-link text-skynex-dark dark:text-white">${link.label}</a>`
  ).join(''),
  
  // Flat, divider-separated profile grid (mentor-listing style): portrait photo, name/role,
  // description, socials. No card box/shadow — the grid's own divider lines do the separating.
  //
  // Placeholder photo (used until a member has an uploaded photo): a self-contained inline SVG silhouette (data URI), not remote/hotlinked.
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

  // member: { name, role, description, photo, linkedin, instagram } -- all text is escaped, and
  // the description / social icons are simply omitted when a member has none.
  TeamCard: (member) => {
    const social = (href, icon, label) => href ? /*html*/`
      <a href="${UI.esc(href)}" target="_blank" rel="noopener noreferrer" aria-label="${UI.esc(member.name)} on ${label}" class="w-8 h-8 rounded-full border border-skynex-border dark:border-neutral-800 flex items-center justify-center text-skynex-dark dark:text-white hover:bg-skynex-dark hover:text-white hover:border-skynex-dark transition-colors">
        <i class="fa-brands ${icon} text-xs"></i>
      </a>` : '';
    const links = social(member.linkedin, 'fa-linkedin-in', 'LinkedIn') + social(member.instagram, 'fa-instagram', 'Instagram');
    return /*html*/`
    <div class="pb-12 sm:pb-0 sm:px-8 md:px-10 first:pl-0 last:pr-0">
      <div class="aspect-[4/5] w-full overflow-hidden bg-skynex-gray dark:bg-neutral-950">
        <img src="${UI.esc(member.photo || UI._PLACEHOLDER_AVATAR)}" alt="${UI.esc(member.name)}" loading="lazy" decoding="async" width="400" height="500" class="w-full h-full object-cover">
      </div>
      <div class="pt-6">
        <h3 class="text-base font-bold text-skynex-dark dark:text-white uppercase tracking-widest mb-1">${UI.esc(member.name)}</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium mb-4">${UI.esc(member.role)}</p>
        ${member.description ? `<p class="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 font-light leading-relaxed mb-5">${UI.esc(member.description)}</p>` : ''}
        ${links ? `<div class="flex items-center gap-3">${links}</div>` : ''}
      </div>
    </div>`;
  },

  ServiceListItem: (item) => /*html*/`
    <div class="grid grid-cols-1 md:grid-cols-12 gap-8 py-10 group">
      <div class="md:col-span-4">
        <h3 class="text-2xl font-bold text-skynex-dark dark:text-white">${item.title}</h3>
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
        <h4 class="text-sm font-bold text-skynex-dark dark:text-white uppercase tracking-widest md:mb-6">${column.title}</h4>
        <i class="fa-solid fa-plus absolute right-0 md:hidden text-skynex-dark dark:text-white transition-transform duration-300"></i>
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

  // Numbered section for a legal document (Privacy Policy / Terms / Legal Information).
  // bodyHtml is raw HTML — wrap paragraphs in <p class="..."> and lists in <ul class="...">
  // using the same utility classes as the rest of the section for a consistent look.
  LegalSection: (n, title, bodyHtml) => /*html*/`
    <div class="pb-12 border-b border-skynex-border dark:border-neutral-800 last:border-none last:pb-0">
      <h2 class="text-xl font-bold uppercase tracking-widest text-skynex-dark dark:text-white mb-6 border-b-2 border-skynex-dark inline-block pb-2">${n}. ${title}</h2>
      <div class="mt-6 space-y-4">
        ${bodyHtml}
      </div>
    </div>
  `,

  // One column of links for the Sitemap page: heading + list of page links (with optional
  // one-line description and an "external link" icon for links that leave the SPA router).
  SitemapColumn: (col) => /*html*/`
    <div>
      <h3 class="text-sm font-bold text-skynex-dark dark:text-white uppercase tracking-widest mb-6 pb-2 border-b-2 border-skynex-dark inline-block">${col.title}</h3>
      <ul class="space-y-5 mt-6">
        ${col.links.map(l => /*html*/`
          <li>
            <a href="${l.href}"${l.newTab ? ' target="_blank" rel="noopener noreferrer"' : ''} class="text-base font-medium text-skynex-dark dark:text-white hover:text-skynex-blue hover:underline transition-colors inline-flex items-center gap-2">
              ${l.label}
              ${l.newTab ? '<i class="fa-solid fa-arrow-up-right-from-square text-[10px] opacity-50"></i>' : ''}
            </a>
            ${l.desc ? `<p class="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 font-light mt-1">${l.desc}</p>` : ''}
          </li>
        `).join('')}
      </ul>
    </div>
  `,

  FooterLink: (link) => {
    const cls = link.accent
      ? 'text-sm font-semibold text-skynex-blue hover:underline transition-all'
      : 'text-sm text-slate-600 hover:text-skynex-dark dark:text-white hover:underline transition-all';
    const target = link.newTab ? ' target="_blank" rel="noopener noreferrer"' : '';
    const icon = link.icon ? ' <i class="fa-solid fa-arrow-up-right-from-square text-[10px] ml-1 opacity-50"></i>' : '';
    return /*html*/`<li><a href="${link.href}"${target} class="${cls}">${link.label}${icon}</a></li>`;
  }
};
