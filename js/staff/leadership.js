// Staff -> Leadership. Requires manage_leadership (CEO only, per role_permissions). Members do
// not need a staff login -- this reads/writes public.leadership_members, not profiles.
(async () => {
  const ctx = await Staff.init({ active: 'leadership', permission: 'manage_leadership' });
  if (!ctx) return;
  const { main, db } = ctx;
  let rows = [];

  main.innerHTML = Staff.pageHeader('Leadership', 'Shown on the public Leadership page, in this order.',
    `<button data-new class="${Staff.primaryBtn}"><i class="fa-solid fa-plus"></i> Add Member</button>`);
  const listEl = document.createElement('div');
  listEl.className = 'space-y-2';
  main.appendChild(listEl);
  main.querySelector('[data-new]').addEventListener('click', () => openForm(null));

  function renderList() {
    if (!rows.length) { listEl.innerHTML = `<p class="text-center text-slate-400 font-light py-16">No leadership members yet.</p>`; return; }
    listEl.innerHTML = rows.map((m, i) => /*html*/`
      <div class="bg-white border border-skynex-border rounded-2xl p-4 flex items-center gap-4">
        <img src="${Staff.esc(Media.publicUrl('team-photos', m.photo_path) || UI._PLACEHOLDER_AVATAR)}" alt="" class="w-12 h-12 rounded-full object-cover bg-skynex-gray shrink-0">
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2 flex-wrap">
            <p class="font-bold text-skynex-dark truncate">${Staff.esc(m.full_name)}</p>
            ${Staff.statusBadge(m.is_active ? 'visible' : 'hidden')}
          </div>
          <p class="text-sm text-slate-500 truncate">${Staff.esc(m.position_title)}</p>
        </div>
        <div class="shrink-0 flex items-center gap-1">
          <button data-up="${m.id}" ${i === 0 ? 'disabled' : ''} class="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-skynex-dark disabled:opacity-30 transition-colors" aria-label="Move up"><i class="fa-solid fa-chevron-up text-xs"></i></button>
          <button data-down="${m.id}" ${i === rows.length - 1 ? 'disabled' : ''} class="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-skynex-dark disabled:opacity-30 transition-colors" aria-label="Move down"><i class="fa-solid fa-chevron-down text-xs"></i></button>
          <button data-edit="${m.id}" class="w-9 h-9 rounded-full border border-skynex-border flex items-center justify-center text-slate-500 hover:text-skynex-dark hover:border-skynex-dark transition-colors ml-1" aria-label="Edit"><i class="fa-solid fa-pen text-xs"></i></button>
          <button data-delete="${m.id}" class="w-9 h-9 rounded-full border border-skynex-border flex items-center justify-center text-slate-500 hover:text-red-600 hover:border-red-600 transition-colors" aria-label="Delete"><i class="fa-solid fa-trash text-xs"></i></button>
        </div>
      </div>`).join('');
    listEl.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => openForm(rows.find(r => r.id === b.dataset.edit))));
    listEl.querySelectorAll('[data-delete]').forEach(b => b.addEventListener('click', () => remove(b.dataset.delete)));
    listEl.querySelectorAll('[data-up]').forEach(b => b.addEventListener('click', () => move(b.dataset.up, -1)));
    listEl.querySelectorAll('[data-down]').forEach(b => b.addEventListener('click', () => move(b.dataset.down, 1)));
  }

  async function move(id, dir) {
    const i = rows.findIndex(r => r.id === id);
    const j = i + dir;
    if (j < 0 || j >= rows.length) return;
    [rows[i], rows[j]] = [rows[j], rows[i]];
    renderList();
    const updates = [rows[i], rows[j]].map((r, k) => {
      const idx = rows.indexOf(r);
      return db.from('leadership_members').update({ display_order: idx }).eq('id', r.id);
    });
    const results = await Promise.all(updates);
    if (results.some(r => r.error)) Staff.toast('Could not save the new order.', 'error');
  }

  async function remove(id) {
    const m = rows.find(r => r.id === id);
    const ok = await Staff.confirm({ title: 'Remove this member?', message: `"${m.full_name}" will be removed from the public Leadership page.`, confirmLabel: 'Remove', danger: true });
    if (!ok) return;
    if (m.photo_path) await Media.remove('team-photos', [m.photo_path]).catch(() => {});
    const { error } = await db.from('leadership_members').delete().eq('id', id);
    if (error) { Staff.toast('Could not remove member.', 'error'); return; }
    rows = rows.filter(r => r.id !== id);
    renderList();
    Staff.toast('Member removed.');
  }

  function openForm(existing) {
    const isEdit = !!existing;
    const { body, close } = Staff.drawer({ title: isEdit ? 'Edit Member' : 'Add Member', html: /*html*/`
      <form data-form class="space-y-5">
        <div><label class="${Staff.labelCls}">Full name</label><input data-name required maxlength="120" class="${Staff.inputCls}" value="${Staff.esc(existing?.full_name || '')}"></div>
        <div><label class="${Staff.labelCls}">Position / title</label><input data-title required maxlength="120" class="${Staff.inputCls}" value="${Staff.esc(existing?.position_title || '')}"></div>
        <div><label class="${Staff.labelCls}">Bio <span class="normal-case font-normal text-slate-400">(optional)</span></label><textarea data-bio rows="4" class="${Staff.inputCls}">${Staff.esc(existing?.bio || '')}</textarea></div>
        <div>
          <label class="${Staff.labelCls}">Photo <span class="normal-case font-normal text-slate-400">(optional, cropped to a portrait automatically)</span></label>
          ${existing?.photo_path ? `<img src="${Staff.esc(Media.publicUrl('team-photos', existing.photo_path))}" class="w-24 aspect-[4/5] object-cover rounded-lg mb-2 bg-skynex-gray">` : ''}
          <input data-photo type="file" accept="image/png,image/jpeg,image/webp" class="text-sm">
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div><label class="${Staff.labelCls}">LinkedIn URL</label><input data-linkedin type="url" placeholder="https://linkedin.com/in/…" class="${Staff.inputCls}" value="${Staff.esc(existing?.linkedin_url || '')}"></div>
          <div><label class="${Staff.labelCls}">Instagram URL</label><input data-instagram type="url" placeholder="https://instagram.com/…" class="${Staff.inputCls}" value="${Staff.esc(existing?.instagram_url || '')}"></div>
        </div>
        <label class="flex items-center gap-2 text-sm text-skynex-dark"><input type="checkbox" data-active ${existing ? (existing.is_active ? 'checked' : '') : 'checked'}> Visible on the public Leadership page</label>
        <p data-error class="hidden text-sm text-red-600"></p>
        <button type="submit" data-submit class="${Staff.primaryBtn} w-full">${isEdit ? 'Save Changes' : 'Add Member'}</button>
      </form>` });

    const form = body.querySelector('[data-form]');
    const err = body.querySelector('[data-error]');
    const submitBtn = body.querySelector('[data-submit]');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      err.classList.add('hidden');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Saving…';
      const id = existing?.id || crypto.randomUUID();

      try {
        const patch = {
          full_name: body.querySelector('[data-name]').value.trim(),
          position_title: body.querySelector('[data-title]').value.trim(),
          bio: body.querySelector('[data-bio]').value.trim() || null,
          linkedin_url: body.querySelector('[data-linkedin]').value.trim() || null,
          instagram_url: body.querySelector('[data-instagram]').value.trim() || null,
          is_active: body.querySelector('[data-active]').checked,
        };

        const photoFile = body.querySelector('[data-photo]').files[0];
        if (photoFile) {
          const { blob, ext, type } = await Media.compressImage(photoFile, { maxW: 800, maxH: 1000, aspect: 4 / 5 });
          const path = `${id}/photo-${Date.now()}.${ext}`;
          await Media.upload('team-photos', path, blob, type);
          if (existing?.photo_path) await Media.remove('team-photos', [existing.photo_path]).catch(() => {});
          patch.photo_path = path;
        }

        if (isEdit) {
          const { data, error } = await db.from('leadership_members').update(patch).eq('id', id).select().single();
          if (error) throw error;
          rows = rows.map(r => r.id === id ? data : r);
        } else {
          const { data, error } = await db.from('leadership_members')
            .insert({ id, ...patch, display_order: rows.length }).select().single();
          if (error) throw error;
          rows = [...rows, data];
        }
        renderList();
        Staff.toast(isEdit ? 'Member updated.' : 'Member added.');
        close();
      } catch (e2) {
        console.error(e2);
        err.textContent = e2.message || 'Something went wrong. Please try again.';
        err.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.textContent = isEdit ? 'Save Changes' : 'Add Member';
      }
    });
  }

  const { data, error } = await db.from('leadership_members').select('*').order('display_order', { ascending: true });
  if (error) { listEl.innerHTML = `<p class="text-center text-red-600 py-16">Could not load the leadership list.</p>`; return; }
  rows = data;
  renderList();
})();
