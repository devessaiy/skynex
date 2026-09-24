// News page: lists live posts from the database (table: news_posts).
// RLS only returns posts that are published and not yet expired (7 days after creation).
(async () => {
  const list = document.getElementById('news-list');

  list.innerHTML = Array.from({ length: 3 }, () => /*html*/`
    <div class="bg-white border border-skynex-border rounded-2xl overflow-hidden animate-pulse">
      <div class="aspect-video bg-skynex-border/60"></div>
      <div class="p-6 space-y-3"><div class="h-3 w-1/3 bg-skynex-border/60"></div><div class="h-5 w-4/5 bg-skynex-border/60"></div></div>
    </div>`).join('');

  const message = (text) => {
    list.className = '';
    list.innerHTML = `<p class="text-center text-slate-500 font-light py-16">${text}</p>`;
  };

  try {
    // Only the columns the list needs -- the full body is loaded on the post's own page.
    const posts = await PublicAPI.select('news_posts',
      'select=id,title,excerpt,image_path,published_at,author_name&order=published_at.desc&limit=30');
    if (!posts.length) { message('No news right now. Latest company news and announcements will be published here.'); return; }

    list.innerHTML = posts.map((p, i) => {
      const img = PublicAPI.mediaUrl('news-media', p.image_path);
      return /*html*/`
        <a href="/news-post?id=${encodeURIComponent(p.id)}" class="group bg-white border border-skynex-border rounded-2xl overflow-hidden flex flex-col hover:border-skynex-dark transition-colors">
          <div class="aspect-video bg-skynex-gray overflow-hidden">
            ${img ? `<img src="${UI.esc(img)}" alt="" ${i < 3 ? '' : 'loading="lazy"'} decoding="async" class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500">`
                  : `<div class="w-full h-full flex items-center justify-center text-slate-300"><i class="fa-regular fa-newspaper text-4xl"></i></div>`}
          </div>
          <div class="p-6 md:p-8 flex flex-col flex-1">
            <p class="text-xs font-bold tracking-widest uppercase text-slate-500 mb-3">${UI.esc(PublicAPI.formatDate(p.published_at))}</p>
            <h2 class="text-xl md:text-2xl font-bold text-skynex-dark tracking-tight leading-snug mb-3">${UI.esc(p.title)}</h2>
            ${p.excerpt ? `<p class="text-slate-500 font-light leading-relaxed mb-6">${UI.esc(p.excerpt)}</p>` : ''}
            <span class="mt-auto text-xs font-bold uppercase tracking-widest text-skynex-blue">Read more</span>
          </div>
        </a>`;
    }).join('');
  } catch (err) {
    console.error('News load failed:', err);
    message('We could not load the news right now. Please refresh in a moment.');
  }
})();
