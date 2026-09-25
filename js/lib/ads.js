// ==========================================
// AD RENDERING HELPER (News pages only)
// ==========================================
const Ads = {
  ready() {
    return AdsConfig.enabled && !/REPLACE/.test(AdsConfig.client) && !/^\s*$/.test(AdsConfig.client);
  },

  // Loads the AdSense script once. Safe to call more than once (only injects it the first time).
  loadScript() {
    if (!this.ready() || document.getElementById('adsbygoogle-script')) return;
    const s = document.createElement('script');
    s.id = 'adsbygoogle-script';
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(AdsConfig.client)}`;
    document.head.appendChild(s);
  },

  // Returns an ad unit's outer HTML, or '' when ads aren't configured yet (renders nothing --
  // never a broken/empty ad box). `format`: 'horizontal' for the banner above the list,
  // 'fluid' for in-feed units, 'auto' for the single unit under an article.
  unitHtml(slotKey, { format = 'auto', label = true } = {}) {
    if (!this.ready()) return '';
    const slot = AdsConfig.slots[slotKey];
    if (!slot || /REPLACE/.test(slot)) return '';
    return /*html*/`
      <div class="w-full my-2">
        ${label ? `<p class="text-center text-[10px] font-bold uppercase tracking-widest text-slate-300 dark:text-slate-600 mb-2">Advertisement</p>` : ''}
        <ins class="adsbygoogle" style="display:block" data-ad-client="${AdsConfig.client}" data-ad-slot="${slot}"
          data-ad-format="${format === 'fluid' ? 'fluid' : 'auto'}" ${format === 'fluid' ? 'data-ad-layout-key="-6t+ed+2i-1n-4w"' : ''}
          data-full-width-responsive="true"></ins>
      </div>`;
  },

  // Call once per unit inserted into the page, after it's in the DOM.
  push() {
    if (!this.ready()) return;
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); }
    catch (e) { console.error('AdSense push failed:', e); }
  }
};
