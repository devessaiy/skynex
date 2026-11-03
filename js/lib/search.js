// ==========================================
// SITE SEARCH (index + ranking)
// ==========================================
// Searches only PUBLIC content: static pages, the services list (js/config.js), the Trideta product,
// and -- fetched once, lazily, through the same read-only public REST calls the News and Leadership
// pages already use -- live news posts and active leadership profiles. Row Level Security still
// decides what those calls can return, so drafts/expired posts/inactive members never appear.
// Matching runs in the browser: typing never triggers a database request, and nothing the visitor
// types is sent anywhere or stored.
const SiteSearch = {
  _livePromise: null,

  norm: (s) => String(s || '').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, ''),
  tokens(q) { return this.norm(q).split(/[^a-z0-9]+/).filter(Boolean); },
  slug: (s) => String(s).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),

  staticEntries() {
    const out = [
      { title: 'Trideta', category: 'Product', url: 'https://trideta.skynex.com.ng', external: true,
        desc: 'School management platform for nursery, primary and secondary schools: students, results and day-to-day administration in one place.',
        keywords: 'school management students results admission parents teachers platform app' },
      { title: 'Home', category: 'Company', url: '/', desc: 'Skynex Solutions Limited: software, systems and creative services.', keywords: 'skynex homepage' },
      { title: 'Capabilities', category: 'Company', url: '/services', desc: 'Everything Skynex does, from web and software development to ICT supply and branding.', keywords: 'services what we do' },
      { title: 'Portfolio', category: 'Company', url: '/portfolio', desc: 'Selected projects delivered by Skynex.', keywords: 'projects work case studies clients websites apps' },
      { title: 'Leadership', category: 'Company', url: '/team', desc: 'The founders and directors of Skynex Solutions Limited.', keywords: 'team directors founders ceo cto coo cfo cmo about' },
      { title: 'News', category: 'Company', url: '/news', desc: 'Latest company news and announcements.', keywords: 'announcements updates press' },
      { title: 'Careers', category: 'Company', url: '/careers', desc: 'Career opportunities at Skynex.', keywords: 'jobs vacancies recruitment work' },
      { title: 'Contact', category: 'Company', url: '/contact', desc: 'Send a project enquiry or message to the Skynex team.', keywords: 'enquiry quote project email whatsapp support address' },
      { title: 'Privacy Policy', category: 'Legal', url: '/privacy-policy', desc: 'How this website handles personal data.', keywords: 'data protection ndpa cookies' },
      { title: 'Terms of Service', category: 'Legal', url: '/terms-of-service', desc: 'Terms for using this website.', keywords: 'terms conditions' },
      { title: 'Legal Information', category: 'Legal', url: '/legal', desc: 'Company registration and legal notices.', keywords: 'rc registration notices' },
      { title: 'Trideta Privacy Policy', category: 'Legal', url: '/trideta-privacy-policy', desc: 'How the Trideta platform handles personal data.', keywords: 'school children data' },
      { title: 'Trideta Terms', category: 'Legal', url: '/trideta-terms', desc: 'Terms for using the Trideta platform.', keywords: 'school terms conditions' },
      { title: 'Sitemap', category: 'Legal', url: '/sitemap', desc: 'A list of every public page on this website.', keywords: 'pages index' }
    ];
    (AppConfig.servicesPage || []).forEach(group => group.items.forEach(item => out.push({
      title: item.title, category: 'Capability', url: '/services#' + this.slug(item.title), desc: item.desc, keywords: group.category
    })));
    return out;
  },

  // Live news + leadership. Resolves once; a failure only means those two groups are missing.
  loadLive() {
    if (this._livePromise) return this._livePromise;
    if (typeof PublicAPI === 'undefined') return (this._livePromise = Promise.resolve({ entries: [], failed: true }));
    const news = PublicAPI.select('news_posts', 'select=id,title,excerpt&order=published_at.desc&limit=50')
      .then(rows => rows.map(r => ({ title: r.title, category: 'News', url: '/news-post?id=' + encodeURIComponent(r.id), desc: r.excerpt || '', keywords: '' })));
    const team = PublicAPI.select('leadership_members', 'select=full_name,position_title,bio&is_active=eq.true')
      .then(rows => rows.map(r => ({ title: r.full_name, category: 'Leadership', url: '/team', desc: [r.position_title, r.bio].filter(Boolean).join('. '), keywords: '' })));
    const work = PublicAPI.select('portfolio_projects', 'select=title,slug,short_description,category,technologies&status=eq.published&limit=100')
      .then(rows => rows.map(r => ({ title: r.title, category: 'Portfolio', url: '/portfolio/' + encodeURIComponent(r.slug), desc: r.short_description || '', keywords: [r.category].concat(r.technologies || []).filter(Boolean).join(' ') })));
    this._livePromise = Promise.allSettled([news, team, work]).then(res => ({
      entries: res.flatMap(r => r.status === 'fulfilled' ? r.value : []),
      failed: res.some(r => r.status === 'rejected')
    }));
    return this._livePromise;
  },

  // Every typed word must match somewhere; title matches rank highest.
  search(query, extraEntries) {
    const toks = this.tokens(query);
    if (!toks.length) return [];
    const all = this.staticEntries().concat(extraEntries || []);
    const scored = [];
    for (const e of all) {
      const t = this.norm(e.title), d = this.norm(e.desc), k = this.norm(e.keywords);
      let score = 0, ok = true;
      for (const w of toks) {
        let s = 0;
        if (t.startsWith(w)) s = 6; else if (t.split(/[^a-z0-9]+/).some(x => x.startsWith(w))) s = 5; else if (t.includes(w)) s = 3;
        else if (k.includes(w)) s = 2; else if (d.includes(w)) s = 1;
        if (!s) { ok = false; break; }
        score += s;
      }
      if (ok) scored.push({ e, score: score + (e.category === 'Product' ? .5 : 0) });
    }
    return scored.sort((a, b) => b.score - a.score || a.e.title.localeCompare(b.e.title)).map(x => x.e);
  },

  // Escape first, then wrap matched words, so database text can never inject markup.
  highlight(text, query) {
    const safe = UI.esc(text || '');
    const words = this.tokens(query).map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    if (!words.length) return safe;
    return safe.replace(new RegExp('(' + words.join('|') + ')', 'gi'), '<mark>$1</mark>');
  },

  snippet: (s, n = 140) => s && s.length > n ? s.slice(0, n).replace(/\s+\S*$/, '') + '…' : (s || '')
};
