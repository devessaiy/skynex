// ==========================================
// SHARE BUTTONS
// ==========================================
// Plain share links (no third-party scripts, no tracking pixels). Each button opens the destination's own
// share page in a new tab with the article's canonical link. Note: whether a destination shows a rich
// preview image depends on that site reading the article page's metadata, which this site does not
// provide yet; recipients still get the title and a working link.
const Share = {
  html({ url, title }) {
    const u = encodeURIComponent(url), t = encodeURIComponent(title);
    const E = UI.esc;
    const link = (href, icon, label) => `<a href="${E(href)}" target="_blank" rel="noopener noreferrer" aria-label="Share on ${label} (opens in a new tab)" title="${label}"
        class="share-btn w-11 h-11 rounded-full border border-skynex-border dark:border-neutral-700 flex items-center justify-center text-skynex-dark dark:text-white hover:bg-skynex-dark hover:text-white hover:border-skynex-dark transition-colors"><i class="${icon}" aria-hidden="true"></i></a>`;
    const btn = (attr, icon, label) => `<button type="button" ${attr} aria-label="${label}" title="${label}"
        class="share-btn w-11 h-11 rounded-full border border-skynex-border dark:border-neutral-700 flex items-center justify-center text-skynex-dark dark:text-white hover:bg-skynex-dark hover:text-white hover:border-skynex-dark transition-colors"><i class="${icon}" aria-hidden="true"></i></button>`;
    return /*html*/`
      <section data-share class="mt-12 pt-8 border-t border-skynex-border dark:border-neutral-800" aria-labelledby="share-heading">
        <h2 id="share-heading" class="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">Share this article</h2>
        <div class="flex flex-wrap items-center gap-3">
          ${btn('data-share-native hidden', 'fa-solid fa-share-nodes', 'Share using your device')}
          ${link(`https://wa.me/?text=${t}%20${u}`, 'fa-brands fa-whatsapp', 'WhatsApp')}
          ${link(`https://www.facebook.com/sharer/sharer.php?u=${u}`, 'fa-brands fa-facebook-f', 'Facebook')}
          ${link(`https://www.linkedin.com/sharing/share-offsite/?url=${u}`, 'fa-brands fa-linkedin-in', 'LinkedIn')}
          ${link(`https://twitter.com/intent/tweet?text=${t}&url=${u}`, 'fa-brands fa-x-twitter', 'X')}
          ${link(`mailto:?subject=${t}&body=${t}%0A%0A${u}`, 'fa-solid fa-envelope', 'Email').replace(' target="_blank" rel="noopener noreferrer"', '').replace(' (opens in a new tab)', '')}
          ${btn('data-share-copy', 'fa-solid fa-link', 'Copy link')}
        </div>
        <p data-share-status role="status" aria-live="polite" class="mt-3 text-sm text-slate-500 dark:text-slate-400 min-h-[1.25rem]"></p>
      </section>`;
  },

  bind(root, { url, title }) {
    const sec = root.querySelector('[data-share]');
    if (!sec) return;
    const status = sec.querySelector('[data-share-status]');
    const say = (m) => { status.textContent = m; clearTimeout(Share._t); Share._t = setTimeout(() => { status.textContent = ''; }, 4000); };

    const native = sec.querySelector('[data-share-native]');
    if (navigator.share) {
      native.hidden = false; native.classList.remove('hidden');
      native.addEventListener('click', async () => {
        try { await navigator.share({ title, url }); }
        catch (e) { if (e && e.name !== 'AbortError') say('Sharing was not possible. Try copying the link instead.'); }
      });
    }

    sec.querySelector('[data-share-copy]').addEventListener('click', async () => {
      try {
        if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(url);
        else {                                                    // fallback for older browsers / non-secure pages
          const ta = document.createElement('textarea');
          ta.value = url; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
          document.body.appendChild(ta); ta.select();
          const ok = document.execCommand('copy'); ta.remove();
          if (!ok) throw new Error('copy failed');
        }
        say('Link copied.');
      } catch (e) { say('Could not copy automatically. The link is: ' + url); }
    });
  }
};
