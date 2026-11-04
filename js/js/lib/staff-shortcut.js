// "Post or manage news" shortcut on the public News pages, shown only to a browser that is signed in to the Staff Portal.
// It reads the Supabase session marker from localStorage (no SDK download, no network request), so ordinary visitors
// never see it. It is a convenience link only: /staff/news checks the session and the manage_news permission itself,
// and Postgres re-checks every post, so nobody gains anything by faking this marker.
(() => {
  const slot = document.getElementById('staff-news-shortcut');
  if (!slot) return;
  try {
    const ref = new URL(AppConfig.supabase.url).hostname.split('.')[0];
    const raw = localStorage.getItem(`sb-${ref}-auth-token`);
    if (!raw) return;
    const s = JSON.parse(raw);
    if (!s || !s.access_token || !s.user) return;
    slot.innerHTML = `<a href="/staff/news" class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-skynex-dark text-white text-xs font-bold tracking-widest uppercase hover:bg-skynex-blue transition-colors"><i class="fa-solid fa-pen-to-square" aria-hidden="true"></i> Post or manage news</a>`;
    slot.hidden = false;
  } catch (e) { /* storage blocked or unreadable: show nothing */ }
})();
