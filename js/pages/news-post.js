// A single news post (/news-post?id=...). Posts that expired or were removed simply are not
// returned by the database, so they show the "no longer available" message.
//
// Ads (see js/config-ads.js) render only here and on the News list page; Ads.unitHtml() returns
// '' until a real AdSense Publisher ID + slot IDs are set, so nothing ad-related shows up yet.
(async () => {
  const box = document.getElementById('news-post');
  const id = new URLSearchParams(window.location.search).get('id') || '';
  Ads.loadScript();

  const gone = (text) => {
    box.innerHTML = /*html*/`
      <div class="text-center py-16">
        <h1 class="text-3xl md:text-4xl font-bold text-skynex-dark dark:text-white tracking-tighter mb-4">${text}</h1>
        <a href="/news" class="text-sm font-bold uppercase tracking-widest text-skynex-blue hover:text-skynex-dark dark:hover:text-white transition-colors">Back to news</a>
      </div>`;
  };

  if (!/^[0-9a-f-]{36}$/i.test(id)) { gone('Post not found'); return; }

  try {
    const rows = await PublicAPI.select('news_posts',
      `select=id,title,body,image_path,video_path,author_name,author_title,published_at&id=eq.${encodeURIComponent(id)}&limit=1`);
    if (!rows.length) { gone('This post is no longer available'); return; }

    const p = rows[0];
    document.title = `${p.title} | Skynex Solutions Limited`;
    const img = PublicAPI.mediaUrl('news-media', p.image_path);
    const video = PublicAPI.mediaUrl('news-media', p.video_path);
    // Body is plain text: blank lines split paragraphs. Everything is escaped.
    const paragraphs = p.body.split(/\n{2,}/).map(t => t.trim()).filter(Boolean)
      .map(t => `<p class="text-lg text-slate-600 dark:text-slate-400 font-light leading-relaxed">${UI.esc(t).replace(/\n/g, '<br>')}</p>`).join('');

    box.innerHTML = /*html*/`
      <a href="/news" class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-skynex-dark dark:hover:text-white transition-colors mb-10">
        <i class="fa-solid fa-arrow-left text-[10px]"></i> All news
      </a>
      <h1 class="text-4xl md:text-5xl font-bold text-skynex-dark dark:text-white tracking-tighter leading-tight mb-6">${UI.esc(p.title)}</h1>
      <p class="text-sm text-slate-500 dark:text-slate-400 mb-10">
        <span class="font-semibold text-skynex-dark dark:text-white">${UI.esc(p.author_name)}</span>${p.author_title ? ` · ${UI.esc(p.author_title)}` : ''} · ${UI.esc(PublicAPI.formatDate(p.published_at))}
      </p>
      ${img ? `<img src="${UI.esc(img)}" alt="" decoding="async" class="w-full rounded-2xl mb-10 bg-skynex-gray dark:bg-neutral-950">` : ''}
      <div class="space-y-6">${paragraphs}</div>
      ${video ? `<video src="${UI.esc(video)}" controls playsinline preload="metadata" class="w-full rounded-2xl mt-10 bg-skynex-dark"></video>` : ''}
      ${Ads.unitHtml('newsPost') ? `<div class="mt-12 pt-10 border-t border-skynex-border dark:border-neutral-800">${Ads.unitHtml('newsPost')}</div>` : ''}
    `;
    Ads.push();
  } catch (err) {
    console.error('News post load failed:', err);
    gone('We could not load this post');
  }
})();
