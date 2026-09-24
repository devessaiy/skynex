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
  initMobileMenu: () => {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const icon = btn.querySelector('i');
    const navbar = document.getElementById('navbar');

    window.toggleMenu = function() {
      AppController.isMenuOpen = !AppController.isMenuOpen;
      if (AppController.isMenuOpen) {
        menu.classList.remove('translate-x-full');
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
        document.body.style.overflow = 'hidden';

        // Force solid background on navbar when open
        navbar.classList.remove('bg-white/90', 'backdrop-blur-xl');
        navbar.classList.add('bg-white');
      } else {
        menu.classList.add('translate-x-full');
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
        document.body.style.overflow = '';

        // Restore default semi-transparent navbar styling
        navbar.classList.add('bg-white/90', 'backdrop-blur-xl');
        navbar.classList.remove('bg-white');
      }
    };
    btn.addEventListener('click', window.toggleMenu);
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

  initEvents: () => {
    AppController.initMobileMenu();
    AppController.initFooterAccordion();
    AppController.markActiveNav();

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
