// Staff -> Portfolio. Requires manage_portfolio (CEO only). The permission is enforced by Postgres RLS and
// Storage policies; this page only decides what to show. Images are resized to WebP in the browser first.
(async () => {
  const ctx = await Staff.init({ active: 'portfolio', permission: 'manage_portfolio' });
  if (!ctx) return;
  const { main, db } = ctx;
  const BUCKET = 'portfolio-media', E = Staff.esc;
  const MAX_GALLERY = 12;
  let rows = [];

  main.innerHTML = Staff.pageHeader('Portfolio', 'Projects shown on the public Portfolio page. Only published projects are visible to visitors.',
    `<button data-new class="${Staff.primaryBtn}"><i class="fa-solid fa-plus"></i> Add Project</button>`);
  const listEl = document.createElement('div');
  listEl.className = 'space-y-2';
  main.appendChild(listEl);
  main.querySelector('[data-new]').addEventListener('click', () => openForm(null));

  const iconBtn = 'w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-skynex-dark dark:hover:text-white disabled:opacity-30 transition-colors';
  const ringBtn = 'w-9 h-9 rounded-full border border-skynex-border dark:border-neutral-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-skynex-dark dark:hover:text-white hover:border-skynex-dark transition-colors';

  function renderList() {
    if (!rows.length) { listEl.innerHTML = `<p class="text-center text-slate-400 font-light py-16">No projects yet. Add your first one.</p>`; return; }
    listEl.innerHTML = rows.map((p, i) => /*html*/`
      <div class="bg-white dark:bg-neutral-900 border border-skynex-border dark:border-neutral-800 rounded-2xl p-4 flex items-center gap-4">
        <div class="w-20 h-14 shrink-0 rounded-lg overflow-hidden bg-skynex-gray dark:bg-neutral-950">
          ${p.featured_image_path ? `<img src="${E(PortfolioView.mediaUrl(p.featured_image_path))}" alt="" class="w-full h-full object-cover">` : ''}
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2 flex-wrap">
            <p class="font-bold text-skynex-dark dark:text-white truncate">${E(p.title)}</p>
            ${Staff.statusBadge(p.status === 'published' ? 'live' : 'draft')}
            ${p.is_featured ? '<span class="text-[10px] font-bold uppercase tracking-widest text-skynex-blue">Featured</span>' : ''}
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400 truncate">${E(p.category || 'No category')} · /portfolio/${E(p.slug)}</p>
        </div>
        <div class="shrink-0 flex items-center gap-1">
          <button data-up="${p.id}" ${i === 0 ? 'disabled' : ''} class="${iconBtn}" aria-label="Move up"><i class="fa-solid fa-chevron-up text-xs"></i></button>
          <button data-down="${p.id}" ${i === rows.length - 1 ? 'disabled' : ''} class="${iconBtn}" aria-label="Move down"><i class="fa-solid fa-chevron-down text-xs"></i></button>
          <button data-toggle="${p.id}" class="${ringBtn} ml-1" aria-label="${p.status === 'published' ? 'Unpublish' : 'Publish'}" title="${p.status === 'published' ? 'Unpublish' : 'Publish'}"><i class="fa-solid ${p.status === 'published' ? 'fa-eye-slash' : 'fa-eye'} text-xs"></i></button>
          <button data-edit="${p.id}" class="${ringBtn}" aria-label="Edit"><i class="fa-solid fa-pen text-xs"></i></button>
          <button data-delete="${p.id}" class="${ringBtn} hover:!text-red-600 hover:!border-red-600" aria-label="Delete"><i class="fa-solid fa-trash text-xs"></i></button>
        </div>
      </div>`).join('');
    const on = (sel, fn) => listEl.querySelectorAll(sel).forEach(b => b.addEventListener('click', () => fn(b.dataset[sel.slice(6, -1)])));
    on('[data-edit]', id => openForm(rows.find(r => r.id === id)));
    on('[data-delete]', remove);
    on('[data-toggle]', toggleStatus);
    on('[data-up]', id => move(id, -1));
    on('[data-down]', id => move(id, 1));
  }

  async function toggleStatus(id) {
    const p = rows.find(r => r.id === id);
    const status = p.status === 'published' ? 'draft' : 'published';
    const { data, error } = await db.from('portfolio_projects').update({ status }).eq('id', id).select().single();
    if (error) { Staff.toast('Could not change the status.', 'error'); return; }
    rows = rows.map(r => r.id === id ? data : r); renderList();
    Staff.toast(status === 'published' ? 'Project published.' : 'Project unpublished (now a draft).');
  }

  async function move(id, dir) {
    const i = rows.findIndex(r => r.id === id), j = i + dir;
    if (j < 0 || j >= rows.length) return;
    [rows[i], rows[j]] = [rows[j], rows[i]];
    renderList();
    const res = await Promise.all([rows[i], rows[j]].map(r => db.from('portfolio_projects').update({ display_order: rows.indexOf(r) }).eq('id', r.id)));
    if (res.some(r => r.error)) Staff.toast('Could not save the new order.', 'error');
  }

  async function remove(id) {
    const p = rows.find(r => r.id === id);
    const ok = await Staff.confirm({ title: 'Delete this project?', message: `"${p.title}" and its images will be permanently removed from the website. This cannot be undone. To hide it temporarily, unpublish it instead.`, confirmLabel: 'Delete', danger: true });
    if (!ok) return;
    const { error } = await db.from('portfolio_projects').delete().eq('id', id);
    if (error) { Staff.toast('Could not delete the project.', 'error'); return; }
    await Media.removeFolder(BUCKET, id).catch(() => {});
    rows = rows.filter(r => r.id !== id); renderList();
    Staff.toast('Project deleted.');
  }

  function openForm(existing) {
    const isEdit = !!existing;
    // Working copy of the images. `path` = already stored; `file` = chosen but not uploaded yet.
    let featured = existing?.featured_image_path ? { path: existing.featured_image_path } : null;
    let gallery = (existing?.gallery_paths || []).map(path => ({ path }));
    let slugTouched = isEdit;
    const originalPaths = [existing?.featured_image_path, ...(existing?.gallery_paths || [])].filter(Boolean);   // snapshot before any edit

    const { body, close } = Staff.drawer({ title: isEdit ? 'Edit Project' : 'Add Project', html: /*html*/`
      <form data-form class="space-y-5" novalidate>
        <div><label class="${Staff.labelCls}" for="pf-title">Title</label><input id="pf-title" data-title required maxlength="150" class="${Staff.inputCls}" value="${E(existing?.title || '')}"></div>
        <div><label class="${Staff.labelCls}" for="pf-slug">Web address</label>
          <input id="pf-slug" data-slug required maxlength="80" class="${Staff.inputCls}" value="${E(existing?.slug || '')}" aria-describedby="pf-slug-help">
          <p id="pf-slug-help" class="text-xs text-slate-400 mt-1">skynex.com.ng/portfolio/<span data-slug-preview>${E(existing?.slug || '')}</span> (lowercase letters, numbers and hyphens). Changing it later breaks links already shared.</p></div>
        <div><label class="${Staff.labelCls}" for="pf-short">Short description <span class="normal-case font-normal text-slate-400">(shown on the card, max 300)</span></label><textarea id="pf-short" data-short required rows="2" maxlength="300" class="${Staff.inputCls}">${E(existing?.short_description || '')}</textarea></div>
        <div><label class="${Staff.labelCls}" for="pf-desc">Detailed description <span class="normal-case font-normal text-slate-400">(optional, plain text; leave a blank line between paragraphs)</span></label><textarea id="pf-desc" data-desc rows="7" maxlength="10000" class="${Staff.inputCls}">${E(existing?.description || '')}</textarea></div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label class="${Staff.labelCls}" for="pf-cat">Category</label><input id="pf-cat" data-cat maxlength="60" list="pf-cats" placeholder="e.g. Web Application" class="${Staff.inputCls}" value="${E(existing?.category || '')}"><datalist id="pf-cats">${[...new Set(rows.map(r => r.category).filter(Boolean))].map(c => `<option value="${E(c)}">`).join('')}</datalist></div>
          <div><label class="${Staff.labelCls}" for="pf-date">Completed <span class="normal-case font-normal text-slate-400">(optional)</span></label><input id="pf-date" data-date type="date" class="${Staff.inputCls}" value="${E(existing?.completed_on || '')}"></div>
        </div>
        <div><label class="${Staff.labelCls}" for="pf-tech">Technologies <span class="normal-case font-normal text-slate-400">(optional, separated by commas, max 20)</span></label><input id="pf-tech" data-tech class="${Staff.inputCls}" value="${E((existing?.technologies || []).join(', '))}"></div>
        <div><label class="${Staff.labelCls}" for="pf-client">Client <span class="normal-case font-normal text-slate-400">(optional, only if the client approved being named publicly)</span></label><input id="pf-client" data-client maxlength="120" class="${Staff.inputCls}" value="${E(existing?.client_name || '')}"></div>
        <div><label class="${Staff.labelCls}" for="pf-url">Live project link <span class="normal-case font-normal text-slate-400">(optional, must start with https://)</span></label><input id="pf-url" data-url type="url" maxlength="500" placeholder="https://" class="${Staff.inputCls}" value="${E(existing?.live_url || '')}"></div>

        <div>
          <label class="${Staff.labelCls}" for="pf-feat">Featured image <span class="normal-case font-normal text-slate-400">(shown on the card; cropped to 16:10)</span></label>
          <div data-feat-preview class="mb-2"></div>
          <input id="pf-feat" data-feat type="file" accept="image/png,image/jpeg,image/webp" class="text-sm">
          <button type="button" data-feat-clear class="hidden ml-3 text-xs text-slate-500 underline">Remove image</button>
        </div>
        <div>
          <label class="${Staff.labelCls}" for="pf-gal">More screenshots <span class="normal-case font-normal text-slate-400">(optional, up to ${MAX_GALLERY}, shown uncropped)</span></label>
          <div data-gal-list class="grid grid-cols-3 gap-2 mb-2"></div>
          <input id="pf-gal" data-gal type="file" multiple accept="image/png,image/jpeg,image/webp" class="text-sm">
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div><label class="${Staff.labelCls}" for="pf-status">Status</label>
            <select id="pf-status" data-status class="${Staff.inputCls}"><option value="draft">Draft (hidden)</option><option value="published">Published (visible)</option></select></div>
          <label class="flex items-center gap-2 text-sm text-skynex-dark dark:text-white pb-3"><input type="checkbox" data-featured ${existing?.is_featured ? 'checked' : ''}> Feature on the homepage</label>
        </div>
        <p data-error role="alert" class="hidden text-sm text-red-600"></p>
        <div class="flex gap-3">
          <button type="button" data-preview class="flex-1 px-6 py-3 rounded-full border border-skynex-border dark:border-neutral-700 text-xs font-bold uppercase tracking-widest text-skynex-dark dark:text-white hover:border-skynex-dark transition-colors">Preview</button>
          <button type="submit" data-submit class="${Staff.primaryBtn} flex-1">${isEdit ? 'Save Changes' : 'Add Project'}</button>
        </div>
      </form>` });

    const q = (s) => body.querySelector(s);
    const err = q('[data-error]'), submitBtn = q('[data-submit]');
    q('[data-status]').value = existing?.status || 'draft';

    const urlOf = (it) => it.file ? (it.url ||= URL.createObjectURL(it.file)) : PortfolioView.mediaUrl(it.path);
    const drawImages = () => {
      q('[data-feat-preview]').innerHTML = featured ? `<img src="${E(urlOf(featured))}" alt="Current featured image" class="w-full max-w-xs aspect-[16/10] object-cover rounded-lg bg-skynex-gray dark:bg-neutral-950">` : '';
      q('[data-feat-clear]').classList.toggle('hidden', !featured);
      q('[data-gal-list]').innerHTML = gallery.map((g, i) => `<div class="relative"><img src="${E(urlOf(g))}" alt="Screenshot ${i + 1}" class="w-full aspect-[4/3] object-cover rounded-lg bg-skynex-gray dark:bg-neutral-950"><button type="button" data-gal-del="${i}" aria-label="Remove screenshot ${i + 1}" class="absolute top-1 right-1 w-6 h-6 rounded-full bg-white/90 text-red-600 text-xs shadow"><i class="fa-solid fa-xmark"></i></button></div>`).join('');
      body.querySelectorAll('[data-gal-del]').forEach(b => b.addEventListener('click', () => { gallery.splice(+b.dataset.galDel, 1); drawImages(); }));
    };
    drawImages();

    q('[data-title]').addEventListener('input', (e) => {
      if (!slugTouched) { const s = PortfolioView.slugify(e.target.value); q('[data-slug]').value = s; q('[data-slug-preview]').textContent = s; }
    });
    q('[data-slug]').addEventListener('input', (e) => { slugTouched = true; q('[data-slug-preview]').textContent = e.target.value; });
    q('[data-feat]').addEventListener('change', (e) => { const f = e.target.files[0]; if (f) { featured = { file: f }; drawImages(); } });
    q('[data-feat-clear]').addEventListener('click', () => { featured = null; q('[data-feat]').value = ''; drawImages(); });
    q('[data-gal]').addEventListener('change', (e) => {
      const files = [...e.target.files];
      if (gallery.length + files.length > MAX_GALLERY) { err.textContent = `You can add up to ${MAX_GALLERY} screenshots.`; err.classList.remove('hidden'); }
      else err.classList.add('hidden');
      files.slice(0, MAX_GALLERY - gallery.length).forEach(file => gallery.push({ file }));
      e.target.value = ''; drawImages();
    });

    // ---- read + validate the form -> payload (never trusted by the server; DB constraints re-check everything)
    const read = () => {
      const val = (s) => q(s).value.trim();
      const url = val('[data-url]');
      if (!val('[data-title]')) throw new Error('Please enter a title.');
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(val('[data-slug]'))) throw new Error('The web address can only contain lowercase letters, numbers and single hyphens.');
      if (!val('[data-short]')) throw new Error('Please enter a short description.');
      if (url && !PortfolioView.safeUrl(url)) throw new Error('The live project link must be a valid address starting with https://');
      const technologies = val('[data-tech]').split(',').map(s => s.trim()).filter(Boolean);
      if (technologies.length > 20) throw new Error('Please list at most 20 technologies.');
      return {
        title: val('[data-title]'), slug: val('[data-slug]'), short_description: val('[data-short]'),
        description: val('[data-desc]') || null, category: val('[data-cat]') || null, technologies,
        completed_on: val('[data-date]') || null, client_name: val('[data-client]') || null, live_url: url ? PortfolioView.safeUrl(url) : null,
        status: q('[data-status]').value, is_featured: q('[data-featured]').checked
      };
    };

    q('[data-preview]').addEventListener('click', () => {
      err.classList.add('hidden');
      let p;
      try { p = read(); } catch (e) { err.textContent = e.message; err.classList.remove('hidden'); return; }
      p.featured_image_path = featured ? urlOf(featured) : null;
      p.gallery_paths = gallery.map(urlOf);
      const ov = document.createElement('div');
      ov.className = 'fixed inset-0 z-[70] bg-white dark:bg-neutral-900 overflow-y-auto';
      ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Project preview');
      ov.innerHTML = `<div class="sticky top-0 z-10 bg-skynex-dark text-white text-xs font-bold uppercase tracking-widest px-5 py-3 flex items-center justify-between"><span>Preview${p.status === 'published' ? '' : ' (draft: not visible to visitors)'}</span><button data-x class="px-4 py-1.5 rounded-full border border-white/40">Close preview</button></div><div class="max-w-[1100px] mx-auto px-6 py-12">${PortfolioView.detail(p)}</div>`;
      document.body.appendChild(ov);
      const x = ov.querySelector('[data-x]'); x.focus();
      const shut = () => { ov.remove(); document.removeEventListener('keydown', esc, true); };
      const esc = (e) => { if (e.key === 'Escape') { e.stopPropagation(); shut(); } };
      document.addEventListener('keydown', esc, true);
      x.addEventListener('click', shut);
    });

    q('[data-form]').addEventListener('submit', async (e) => {
      e.preventDefault();
      err.classList.add('hidden'); submitBtn.disabled = true; submitBtn.textContent = 'Saving…';
      const id = existing?.id || crypto.randomUUID();
      const uploaded = [];                                         // rolled back if the row cannot be saved
      try {
        const patch = read();
        const ts = Date.now();
        const resolve = async (item, name, opts) => {
          if (!item) return null;
          if (item.path) return item.path;
          const { blob, ext, type } = await Media.compressImage(item.file, opts);
          const path = `${id}/${name}-${ts}.${ext}`;
          await Media.upload(BUCKET, path, blob, type); uploaded.push(path);
          return path;
        };
        patch.featured_image_path = await resolve(featured, 'featured', { maxW: 1600, maxH: 1000, aspect: 16 / 10 });
        patch.gallery_paths = [];
        for (let i = 0; i < gallery.length; i++) patch.gallery_paths.push(await resolve(gallery[i], `shot${i}`, { maxW: 1800, maxH: 1800 }));

        let saved;
        if (isEdit) {
          const r = await db.from('portfolio_projects').update(patch).eq('id', id).select().single();
          if (r.error) throw r.error; saved = r.data;
          rows = rows.map(x => x.id === id ? saved : x);
        } else {
          const r = await db.from('portfolio_projects').insert({ id, ...patch, display_order: rows.length }).select().single();
          if (r.error) throw r.error; saved = r.data;
          rows = [...rows, saved];
        }
        // Row saved: now it is safe to delete images that were replaced or removed.
        if (isEdit) {
          const keep = new Set([saved.featured_image_path, ...saved.gallery_paths]);
          const old = originalPaths.filter(p => !keep.has(p));
          await Media.remove(BUCKET, old).catch(() => {});
        }
        renderList();
        Staff.toast(isEdit ? 'Project updated.' : 'Project added.');
        close();
      } catch (e2) {
        console.error(e2);
        await Media.remove(BUCKET, uploaded).catch(() => {});
        err.textContent = e2.code === '23505' ? 'That web address is already used by another project. Please choose a different one.'
          : (e2.message || 'Something went wrong. Please try again.');
        err.classList.remove('hidden'); submitBtn.disabled = false; submitBtn.textContent = isEdit ? 'Save Changes' : 'Add Project';
      }
    });
  }

  const { data, error } = await db.from('portfolio_projects').select('*').order('display_order', { ascending: true }).order('created_at', { ascending: true });
  if (error) { listEl.innerHTML = `<p class="text-center text-red-600 py-16">Could not load the project list.</p>`; return; }
  rows = data; renderList();
})();
