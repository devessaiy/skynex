// ==========================================
// COOKIE / OPTIONAL-TECHNOLOGY CONSENT
// ==========================================
// Optional technologies (today only: Google AdSense advertising on the News pages) are OFF until the visitor
// accepts. "Reject" and "Accept" are the same size and one click each, and the choice can be changed or withdrawn
// at any time from the "Cookie Settings" link in the footer. Strictly necessary storage (the Staff Portal sign-in)
// needs no consent and is not controlled here. Only the choice itself is stored: category, yes/no, date, version.
const Consent = {
  KEY: 'sx_consent',
  VERSION: 1,
  optional: [],                       // categories this site can actually use right now, e.g. ['advertising']

  get() {
    try {
      const c = JSON.parse(localStorage.getItem(this.KEY) || 'null');
      return c && c.v === this.VERSION ? c : null;
    } catch (e) { return null; }
  },
  allowed(cat) { const c = this.get(); return !!(c && c[cat] === true); },

  save(choices) {
    const prev = this.get() || {};
    const next = { v: this.VERSION, ts: new Date().toISOString(), ...choices };
    try { localStorage.setItem(this.KEY, JSON.stringify(next)); } catch (e) { /* storage blocked: choice applies to this page only */ }
    return { prev, next };
  },

  // Best-effort removal of first-party advertising cookies when consent is withdrawn.
  clearAdCookies() {
    ['__gads', '__gpi', '__eoi'].forEach(n => {
      document.cookie = `${n}=; Max-Age=0; path=/`;
      document.cookie = `${n}=; Max-Age=0; path=/; domain=${location.hostname}`;
      document.cookie = `${n}=; Max-Age=0; path=/; domain=.${location.hostname.replace(/^www\./, '')}`;
    });
  },

  // Called on pages that use optional technologies. Shows the banner only if a decision is still missing.
  init({ optional = [] } = {}) {
    this.optional = optional;
    if (optional.length && !this.get()) this.show();
  },

  async open() {
    if (!this.optional.length && typeof AdsConfig === 'undefined') {            // opened from a page that does not load ads
      await new Promise(res => { const s = document.createElement('script'); s.src = '/js/config-ads.js'; s.onload = s.onerror = res; document.head.appendChild(s); });
      if (typeof AdsConfig !== 'undefined' && AdsConfig.enabled && !/REPLACE|^\s*$/.test(AdsConfig.client)) this.optional = ['advertising'];
    }
    this.show();
  },

  show() {
    const old = document.getElementById('consent-banner'); if (old) old.remove();
    const cur = this.get();
    const usesAds = this.optional.includes('advertising');
    const state = !cur ? 'You have not made a choice yet.' : `Your current choice: advertising cookies ${cur.advertising ? 'accepted' : 'rejected'}.`;
    const el = document.createElement('div');
    el.id = 'consent-banner'; el.className = 'consent';
    el.setAttribute('role', 'region'); el.setAttribute('aria-label', 'Cookie choices');
    el.innerHTML = usesAds ? /*html*/`
      <div class="consent__text">
        <p class="consent__title">Cookies on the News pages</p>
        <p>Our News pages can show advertising provided by Google AdSense. This uses cookies and similar technologies that may process your IP address and browsing data. They are only used if you accept. The rest of the site works the same either way.
          <a href="/privacy-policy#cookies">Read how we use cookies</a>.</p>
        <p class="consent__state">${state}</p>
      </div>
      <div class="consent__actions">
        <button type="button" class="consent__btn" data-choice="reject">Reject</button>
        <button type="button" class="consent__btn" data-choice="accept">Accept</button>
      </div>` : /*html*/`
      <div class="consent__text">
        <p class="consent__title">Cookie settings</p>
        <p>This website does not currently use any optional cookies or tracking, so there is nothing to switch on or off. <a href="/privacy-policy#cookies">Read our cookie information</a>.</p>
      </div>
      <div class="consent__actions"><button type="button" class="consent__btn" data-choice="close">Close</button></div>`;
    document.body.appendChild(el);
    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-choice]'); if (!b) return;
      const choice = b.dataset.choice;
      if (choice === 'close') { el.remove(); return; }
      const { prev, next } = this.save({ advertising: choice === 'accept' });
      el.remove();
      if (choice === 'reject') this.clearAdCookies();
      if (!!prev.advertising !== next.advertising || (choice === 'accept' && !prev.ts)) location.reload();   // load or stop the ad script cleanly
    });
    el.querySelector('[data-choice]').focus({ preventScroll: true });
  }
};
