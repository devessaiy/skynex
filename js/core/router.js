// ==========================================
// CORE: SCREEN REGISTRY, LAZY LOADER & PATH-BASED ROUTER
// ==========================================
//
// Every screen lives in its own file under js/views/ and registers itself here:
//
//     Views.Team = { render: () => `<div id="view-team" class="spa-view">…</div>`, mount?: (el) => {} }
//
// The router downloads a screen's file the first time that route is visited, renders it into
// #app-root once, and afterwards just shows/hides it (exactly like the previous version).
//
// Routes are real URL paths (/team, /careers, /news, …), navigated with the History API — the
// address bar shows the real path and the page never does a full reload when a person clicks
// an in-app link. This requires the host to serve index.html for those paths too (see the
// deployment notes shipped alongside this file); it does NOT work when the page is opened
// directly from disk (a file:// URL) — serve it over http(s), even just a local dev server.
//
// To add a new screen:  1) create js/views/<name>.js   2) add one line to Router.routes below
//                       3) link to it with href="/<path>"

const Views = {};

// Shared script groups for routes that need the Supabase client. Kept as small, separate
// groups so a route only downloads what it actually needs (e.g. the public Contact page
// never pulls in the staff Auth module or a dashboard shell).
const SUPABASE_CDN = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
const CONTACT_LIBS = [SUPABASE_CDN, 'js/lib/supabase-client.js'];
const STAFF_LIBS = [SUPABASE_CDN, 'js/lib/supabase-client.js', 'js/core/auth.js', 'js/views/dashboards/shell.js'];

// --- Minimal script loader (each file is fetched once; concurrent requests share one promise) ---
const Loader = {
  _cache: {},

  script(src) {
    if (this._cache[src]) return this._cache[src];

    // Already present in the page (e.g. the landing screen is loaded by a <script> tag in index.html)
    if (document.querySelector(`script[src="${src}"]`)) return Promise.resolve();

    this._cache[src] = new Promise((resolve, reject) => {
      const el = document.createElement('script');
      el.src = src;
      el.async = true;
      el.onload = () => resolve();
      el.onerror = () => {
        delete Loader._cache[src];   // allow a retry on the next navigation
        el.remove();
        reject(new Error(`Failed to load ${src}`));
      };
      document.head.appendChild(el);
    });
    return this._cache[src];
  }
};

// --- Router ---
const Router = {
  // real URL path -> screen. `src` lists the file(s) to fetch before the screen can be rendered.
  routes: {
    '/':         { id: 'home',     view: 'Home',     src: ['js/views/home.js', 'js/features/trideta-video.js'] },
    '/services': { id: 'services', view: 'Services', src: ['js/views/services.js'] },
    '/team':     { id: 'team',     view: 'Team',     src: ['js/views/team.js'] },
    '/contact':  { id: 'contact',  view: 'Contact',  src: ['js/views/contact.js', ...CONTACT_LIBS] },
    '/careers':  { id: 'careers',  view: 'Careers',  src: ['js/views/careers.js'] },
    '/news':     { id: 'news',     view: 'News',     src: ['js/views/news.js'] },
    '/privacy-policy':   { id: 'privacy-policy',   view: 'PrivacyPolicy',   src: ['js/views/privacy.js'] },
    '/terms-of-service': { id: 'terms-of-service', view: 'TermsOfService',  src: ['js/views/terms.js'] },
    '/legal':            { id: 'legal',            view: 'Legal',          src: ['js/views/legal.js'] },
    '/sitemap':          { id: 'sitemap',          view: 'Sitemap',        src: ['js/views/sitemap.js'] },

    // --- Staff Portal (only ever downloaded by someone who actually navigates here) ---
    '/staff/login':          { id: 'staff-login', view: 'StaffLogin',         src: [...STAFF_LIBS, 'js/views/staff-login.js'] },
    '/staff/reset-password': { id: 'staff-reset', view: 'StaffResetPassword', src: [...STAFF_LIBS, 'js/views/staff-reset-password.js'] },
    // Landing pad after login: reads the caller's own profile (RLS-protected) and forwards to
    // their specific dashboard. Frontend routing only decides where to LOOK; it grants no data
    // access itself -- every dashboard's actual data is separately protected by RLS.
    '/staff/dashboard': { id: 'staff-dashboard', view: 'StaffDashboardRouter', src: [...STAFF_LIBS, 'js/views/staff-dashboard-router.js'], requiresAuth: true },

    '/staff/dashboard/ceo': { id: 'dashboard-ceo', view: 'DashboardCEO', src: [...STAFF_LIBS, 'js/views/dashboards/ceo.js'], requiresAuth: true, dashboardRole: 'ceo' },
    '/staff/dashboard/cto': { id: 'dashboard-cto', view: 'DashboardCTO', src: [...STAFF_LIBS, 'js/views/dashboards/cto.js'], requiresAuth: true, dashboardRole: 'cto' },
    '/staff/dashboard/coo': { id: 'dashboard-coo', view: 'DashboardCOO', src: [...STAFF_LIBS, 'js/views/dashboards/coo.js'], requiresAuth: true, dashboardRole: 'coo' },
    '/staff/dashboard/cfo': { id: 'dashboard-cfo', view: 'DashboardCFO', src: [...STAFF_LIBS, 'js/views/dashboards/cfo.js'], requiresAuth: true, dashboardRole: 'cfo' },
    '/staff/dashboard/cmo': { id: 'dashboard-cmo', view: 'DashboardCMO', src: [...STAFF_LIBS, 'js/views/dashboards/cmo.js'], requiresAuth: true, dashboardRole: 'cmo' },
    '/staff/dashboard/rnd': { id: 'dashboard-rnd', view: 'DashboardRND', src: [...STAFF_LIBS, 'js/views/dashboards/rnd.js'], requiresAuth: true, dashboardRole: 'rnd' }
  },

  // code -> path, used to send an authenticated user to THEIR OWN dashboard.
  roleDashboardPath: {
    ceo: '/staff/dashboard/ceo', cto: '/staff/dashboard/cto', coo: '/staff/dashboard/coo',
    cfo: '/staff/dashboard/cfo', cmo: '/staff/dashboard/cmo', rnd: '/staff/dashboard/rnd'
  },

  _navId: 0,        // increments on every navigation so a slow, superseded one can be ignored
  _pending: {},     // screens currently being fetched/mounted

  // Strip a trailing slash (except on the root) so "/team" and "/team/" both match.
  normalize(path) {
    if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
    return path || '/';
  },

  start() {
    Router.root = document.getElementById('app-root');
    Router.navLinks = document.querySelectorAll('.nav-link, .mobile-link');

    window.addEventListener('popstate', Router.handleRoute);

    // Intercept clicks on in-app links (href starting with "/") and route them client-side
    // instead of letting the browser do a full page reload. Anything else — mailto:, tel:,
    // external https:// links, the "#" placeholder links in the footer, modified clicks
    // (ctrl/cmd/shift/middle-click to open in a new tab) — is left alone.
    document.addEventListener('click', (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('/') || href.startsWith('//')) return;
      if (link.target && link.target !== '_self') return;
      if (link.hasAttribute('download')) return;

      e.preventDefault();
      Router.navigate(href);
    });

    return Router.handleRoute();   // run on initial load
  },

  // Push a new path onto the history stack and render it (used by the click handler above).
  navigate(path) {
    path = Router.normalize(path);
    if (path === Router.normalize(window.location.pathname)) return;   // already there
    window.history.pushState({}, '', path);
    Router.handleRoute();
  },

  // Download (if needed) and render a screen into #app-root. Resolves once it is in the DOM.
  ensureView(id) {
    if (document.getElementById(`view-${id}`)) return Promise.resolve();
    if (Router._pending[id]) return Router._pending[id];

    const route = Object.values(Router.routes).find(r => r.id === id);
    Router._pending[id] = Promise.all(route.src.map(src => Loader.script(src)))
      .then(() => {
        const view = Views[route.view];
        if (!view) throw new Error(`Screen "${route.view}" did not register itself in Views`);

        Router.root.insertAdjacentHTML('beforeend', view.render());
        const el = document.getElementById(`view-${id}`);
        el.classList.remove('active');            // visibility is decided by activate(), never by markup
        if (view.mount) view.mount(el);
      })
      .finally(() => { delete Router._pending[id]; });

    return Router._pending[id];
  },

  async handleRoute() {
    const navId = ++Router._navId;

    const path = Router.normalize(window.location.pathname);
    const route = Router.routes[path] || Router.routes['/'];

    // --- Staff Portal guard -------------------------------------------------------------
    // Runs BEFORE the protected screen's own bundle is fetched or mounted, so an
    // unauthenticated visitor never even downloads dashboard code, let alone sees it.
    // This is UX only: it decides which screen to SHOW. It grants no data access by itself
    // -- every dashboard's actual data is separately protected by Postgres RLS regardless of
    // what the router renders, so "just show me /staff/dashboard/ceo" is not a real bypass.
    if (route.requiresAuth || route.dashboardRole || route.id === 'staff-login') {
      try {
        await Promise.all(STAFF_LIBS.map(src => Loader.script(src)));
      } catch (err) {
        console.error(err);
        return;
      }
      if (navId !== Router._navId) return;

      const session = await Auth.getSession();
      if (navId !== Router._navId) return;

      if (route.id === 'staff-login') {
        // Already signed in? Forward straight to the dashboard instead of showing the form.
        if (session) { Router.navigate('/staff/dashboard'); return; }
      } else if (!session) {
        Router.navigate(`/staff/login?redirect=${encodeURIComponent(path)}`);
        return;
      } else if (route.dashboardRole) {
        const profile = await Auth.getProfile();
        if (navId !== Router._navId) return;
        if (!profile || profile.role_code !== route.dashboardRole) {
          const ownPath = profile && profile.role_code && Router.roleDashboardPath[profile.role_code];
          Router.navigate(ownPath || '/staff/dashboard');
          return;
        }
      }
    }

    try {
      await Router.ensureView(route.id);
    } catch (err) {
      console.error(err);          // stay on the current screen if a file could not be fetched
      return;
    }
    if (navId !== Router._navId) return;   // the user has already navigated somewhere else

    // If the path didn't match a known route, show Home but leave the address bar as typed
    // (matches how the previous hash router handled an unrecognised #hash).
    Router.activate(route.id, Router.routes[path] ? path : window.location.pathname);
  },

  activate(id, currentPath) {
    Router.root.querySelectorAll('.spa-view').forEach(view => view.classList.remove('active'));
    Router.navLinks.forEach(link => link.classList.remove('active'));

    document.getElementById(`view-${id}`).classList.add('active');

    document.querySelectorAll(`.nav-link[href="${currentPath}"], .mobile-link[href="${currentPath}"]`).forEach(link => {
      link.classList.add('active');
    });

    if (AppController.isMenuOpen) window.toggleMenu();
    window.scrollTo(0, 0);
  }
};
