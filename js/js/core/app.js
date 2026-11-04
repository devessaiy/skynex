// ==========================================
// CORE: APP CONTROLLER & SHARED EVENTS
// ==========================================
// Every page is its own real HTML file. This injects the shared header and footer into the
// #site-header / #site-footer placeholders and wires up the behaviour shared by every page.
// (There is no client-side router: links are ordinary links to real pages.)
const AppController = {

  isMenuOpen: false,

  // Inject the shared header + footer into the page
  render: () => {
    document.getElementById('site-header').innerHTML = Layout.Header();
    document.getElementById('site-footer').innerHTML = Layout.Footer();
  },

  // Highlight the nav link for the page that is currently open (was done by the router).
  markActiveNav: () => {
    let path = window.location.pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
    if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
    document.querySelectorAll(`.nav-link[href="${path}"], .mobile-link[href="${path}"]`).forEach(link => {
      link.classList.add('active');
    });
  },

  // --- 1. Mobile Menu Logic ---
  // Accessible disclosure: labelled toggle with aria-expanded, closed menu is inert (not tabbable and
  // hidden from screen readers), Escape closes and returns focus, Tab is kept inside while open, and
  // the menu closes by itself if the window grows to the desktop layout.
  initMobileMenu: () => {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const icon = btn.querySelector('i');
    const navbar = document.getElementById('navbar');

    const setOpen = (open, restoreFocus) => {
      AppController.isMenuOpen = open;
      menu.classList.toggle('translate-x-full', !open);
      menu.inert = !open;
      icon.classList.toggle('fa-bars', !open);
      icon.classList.toggle('fa-xmark', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      navbar.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) { const first = menu.querySelector('a'); if (first) first.focus({ preventScroll: true }); }
      else if (restoreFocus) btn.focus();
    };
    window.toggleMenu = () => setOpen(!AppController.isMenuOpen, true);
    btn.addEventListener('click', window.toggleMenu);

    document.addEventListener('keydown', (e) => {
      if (!AppController.isMenuOpen) return;
      if (e.key === 'Escape') { setOpen(false, true); return; }
      if (e.key !== 'Tab') return;
      const stops = [btn, ...menu.querySelectorAll('a[href]')];
      const i = stops.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); stops[stops.length - 1].focus(); }
      else if (!e.shiftKey && i === stops.length - 1) { e.preventDefault(); btn.focus(); }
    });
    const desktop = window.matchMedia('(min-width: 768px)');
    const onChange = () => { if (desktop.matches && AppController.isMenuOpen) setOpen(false, false); };
    if (desktop.addEventListener) desktop.addEventListener('change', onChange); else desktop.addListener(onChange);
  },

  // --- 2. Mobile Footer Accordion Logic ---
  initFooterAccordion: () => {
    const footerBtns = document.querySelectorAll('.footer-btn');
    footerBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Only execute accordion toggle on mobile screens (less than 768px wide)
        if (window.innerWidth >= 768) return;

        const content = btn.nextElementSibling;
        const icon = btn.querySelector('i');
        const isOpen = content.classList.contains('grid-rows-[1fr]');

        if (isOpen) {
          content.classList.replace('grid-rows-[1fr]', 'grid-rows-[0fr]');
          icon.classList.replace('fa-minus', 'fa-plus');
        } else {
          content.classList.replace('grid-rows-[0fr]', 'grid-rows-[1fr]');
          icon.classList.replace('fa-plus', 'fa-minus');
        }
      });
    });
  },

  // --- 3. Navbar Scroll Effect ---
  // Only touches the DOM when the navbar actually needs to change (i.e. when scrolling past / back
  // above the 20px threshold), instead of rewriting its classes on every single scroll event.
  initNavbarScrollEffect: () => {
    const navbar = document.getElementById('navbar');
    let scrolled = false;   // matches the initial markup (border-transparent)

    window.addEventListener('scroll', () => {
      if (AppController.isMenuOpen) return;

      const shouldBeScrolled = window.scrollY > 20;
      if (shouldBeScrolled === scrolled) return;
      scrolled = shouldBeScrolled;

      if (scrolled) {
        navbar.classList.add('border-skynex-border', 'shadow-sm');
        navbar.classList.remove('border-transparent');
      } else {
        navbar.classList.remove('border-skynex-border', 'shadow-sm');
        navbar.classList.add('border-transparent');
      }
    });
  },

  // Footer "Cookie Settings": opens the consent panel from any page (loads the small consent script on demand).
  initCookieSettingsLink: () => {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-cookie-settings]');
      if (!link) return;
      e.preventDefault();
      const run = () => Consent.open();
      if (typeof Consent !== 'undefined') return run();
      const s = document.createElement('script'); s.src = '/js/lib/consent.js'; s.onload = run; document.head.appendChild(s);
    });
  },

  initEvents: () => {
    AppController.initMobileMenu();
    AppController.initFooterAccordion();
    AppController.markActiveNav();
    AppController.initCookieSettingsLink();

    // Coming back with the browser Back button can restore the page from cache with the
    // mobile menu still open; close it so the page is scrollable again.
    window.addEventListener('pageshow', (e) => {
      if (e.persisted && AppController.isMenuOpen) window.toggleMenu();
    });
    AppController.initNavbarScrollEffect();
  }
};

// ==========================================
// INITIALIZE APPLICATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  AppController.render();
  AppController.initEvents();
});
