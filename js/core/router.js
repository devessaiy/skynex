// ==========================================
// CORE: SCREEN REGISTRY, LAZY LOADER & SPA ROUTER
// ==========================================
//
// Every screen lives in its own file under js/views/ and registers itself here:
//
//     Views.Team = { render: () => `<div id="view-team" class="spa-view">…</div>`, mount?: (el) => {} }
//
// The router downloads a screen's file the first time that route is visited, renders it into
// #app-root once, and afterwards just shows/hides it (exactly like the previous single-file version).
//
// To add a new screen:  1) create js/views/<name>.js   2) add one line to Router.routes below
//                       3) link to it with href="#<name>"

const Views = {};

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
  // hash name -> screen. `src` lists the file(s) to fetch before the screen can be rendered.
  routes: {
    home:     { view: 'Home',     src: ['js/views/home.js', 'js/features/trideta-video.js'] },
    services: { view: 'Services', src: ['js/views/services.js'] },
    team:     { view: 'Team',     src: ['js/views/team.js'] },
    contact:  { view: 'Contact',  src: ['js/views/contact.js'] },
    careers:  { view: 'Careers',  src: ['js/views/careers.js'] },
    news:     { view: 'News',     src: ['js/views/news.js'] }
  },

  _navId: 0,        // increments on every navigation so a slow, superseded one can be ignored
  _pending: {},     // screens currently being fetched/mounted

  start() {
    Router.root = document.getElementById('app-root');
    Router.navLinks = document.querySelectorAll('.nav-link, .mobile-link');
    window.addEventListener('hashchange', Router.handleRoute);
    return Router.handleRoute();   // run on initial load
  },

  // Download (if needed) and render a screen into #app-root. Resolves once it is in the DOM.
  ensureView(name) {
    if (document.getElementById(`view-${name}`)) return Promise.resolve();
    if (Router._pending[name]) return Router._pending[name];

    const route = Router.routes[name];
    Router._pending[name] = Promise.all(route.src.map(src => Loader.script(src)))
      .then(() => {
        const view = Views[route.view];
        if (!view) throw new Error(`Screen "${route.view}" did not register itself in Views`);

        Router.root.insertAdjacentHTML('beforeend', view.render());
        const el = document.getElementById(`view-${name}`);
        el.classList.remove('active');            // visibility is decided by activate(), never by markup
        if (view.mount) view.mount(el);
      })
      .finally(() => { delete Router._pending[name]; });

    return Router._pending[name];
  },

  async handleRoute() {
    const navId = ++Router._navId;

    let hash = window.location.hash || '#home';
    let name = hash.substring(1);
    if (!Object.prototype.hasOwnProperty.call(Router.routes, name)) {
      name = 'home';
      hash = '#home';
    }

    try {
      await Router.ensureView(name);
    } catch (err) {
      console.error(err);          // stay on the current screen if a file could not be fetched
      return;
    }
    if (navId !== Router._navId) return;   // the user has already navigated somewhere else

    Router.activate(name, hash);
  },

  activate(name, hash) {
    Router.root.querySelectorAll('.spa-view').forEach(view => view.classList.remove('active'));
    Router.navLinks.forEach(link => link.classList.remove('active'));

    document.getElementById(`view-${name}`).classList.add('active');

    document.querySelectorAll(`.nav-link[href="${hash}"], .mobile-link[href="${hash}"]`).forEach(link => {
      link.classList.add('active');
    });

    if (AppController.isMenuOpen) window.toggleMenu();
    window.scrollTo(0, 0);
  }
};
