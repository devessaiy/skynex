// Accessible autocomplete for any <form data-site-search>. Pattern: ARIA 1.2 combobox with a listbox,
// aria-activedescendant for the highlighted option, and Enter/Escape/Arrow key support.
// Pressing Enter with nothing highlighted submits the form to /search?q=...
const SearchUI = {
  attach(form) {
    const input = form.querySelector('input[type="search"]');
    const list = form.querySelector('[role="listbox"]');
    const clear = form.querySelector('[data-search-clear]');
    const status = form.querySelector('[data-search-status]');
    if (!input || !list) return;

    let items = [], active = -1, timer = null, live = [], liveRequested = false;

    const close = () => { list.hidden = true; input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant'); active = -1; };
    const setActive = (i) => {
      active = i;
      list.querySelectorAll('[role="option"]').forEach((el, idx) => el.setAttribute('aria-selected', idx === i ? 'true' : 'false'));
      if (i >= 0) { const el = list.children[i]; input.setAttribute('aria-activedescendant', el.id); el.scrollIntoView({ block: 'nearest' }); }
      else input.removeAttribute('aria-activedescendant');
    };

    const render = () => {
      const q = input.value.trim();
      clear.hidden = !input.value;
      if (!q) { close(); return; }
      items = SiteSearch.search(q, live).slice(0, 6);
      if (!items.length) {
        list.innerHTML = `<li class="search-pop__note" role="presentation">No quick matches. Press Enter to search the whole site.</li>`;
      } else {
        list.innerHTML = items.map((e, i) => `
          <li id="${list.id}-o${i}" role="option" aria-selected="false" class="search-opt" data-url="${UI.esc(e.url)}" data-ext="${e.external ? 1 : ''}">
            <span class="search-opt__top"><span class="search-opt__title">${SiteSearch.highlight(e.title, q)}</span><span class="search-opt__cat">${UI.esc(e.category)}</span></span>
            ${e.desc ? `<span class="search-opt__desc">${SiteSearch.highlight(SiteSearch.snippet(e.desc, 110), q)}</span>` : ''}
          </li>`).join('');
      }
      list.hidden = false; input.setAttribute('aria-expanded', 'true'); active = -1;
      if (status) status.textContent = items.length ? `${items.length} suggestion${items.length > 1 ? 's' : ''} available. Use the up and down arrow keys.` : 'No quick matches.';
    };

    const go = (el) => { const url = el.dataset.url; if (el.dataset.ext) window.open(url, '_blank', 'noopener'); else window.location.href = url; };

    input.addEventListener('input', () => {
      if (!liveRequested) { liveRequested = true; SiteSearch.loadLive().then(r => { live = r.entries; if (input.value.trim()) render(); }); }
      clearTimeout(timer); timer = setTimeout(render, 120);
    });
    input.addEventListener('focus', () => { if (input.value.trim()) render(); });
    input.addEventListener('keydown', (e) => {
      const open = !list.hidden && list.querySelector('[role="option"]');
      if (e.key === 'ArrowDown' && open) { e.preventDefault(); setActive((active + 1) % items.length); }
      else if (e.key === 'ArrowUp' && open) { e.preventDefault(); setActive(active <= 0 ? items.length - 1 : active - 1); }
      else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); go(list.children[active]); }
      else if (e.key === 'Escape') { if (!list.hidden) { close(); e.preventDefault(); } else if (input.value) { input.value = ''; clear.hidden = true; } }
    });
    list.addEventListener('mousedown', (e) => e.preventDefault());           // keep input focus
    list.addEventListener('click', (e) => { const el = e.target.closest('[role="option"]'); if (el) go(el); });
    clear.addEventListener('click', () => { input.value = ''; clear.hidden = true; close(); input.focus(); });
    document.addEventListener('click', (e) => { if (!form.contains(e.target)) close(); });
    form.addEventListener('submit', (e) => { if (!input.value.trim()) { e.preventDefault(); input.focus(); } });
    clear.hidden = !input.value;
  }
};
document.addEventListener('DOMContentLoaded', () => document.querySelectorAll('form[data-site-search]').forEach(SearchUI.attach));
