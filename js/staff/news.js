// Staff -> News. Requires manage_news (all 6 director roles have it). Posts auto-expire 7 days
// after creation (enforced in the database, not here) and their Storage files are cleaned up by
// the scheduled cleanup-expired-news function.
(async () => {
  const ctx = await Staff.init({ active: 'news', permission: 'manage_news' });
  if (!ctx) return;
  const { main, profile, roleName, db } = ctx;
  let rows = [];

  main.innerHTML = Staff.pageHeader('News', 'Posts you publish here go live immediately and are removed automatically after 7 days.',
    `<button data-new class="${Staff.primaryBtn}"><i class="fa-solid fa-plus"></i> New Post</button>`);
  const listEl = document.createElement('div');
  listEl.className = 'space-y-3';
  main.appendChild(listEl);
  main.querySelector('[data-new]').addEventListener('click', () => openForm(null));

  const daysLeft = (expires_at) => Math.max(0, Math.ceil((new Date(expires_at) - Date.now()) / 86400000));

  function renderList() {
    if (!rows.length) { listEl.innerHTML = `<p class="text-center text-slate-400 font-light py-16">No news posts yet. Create the first one.</p>`; return; }
    listEl.innerHTML = rows.map(p => {
      const left = daysLeft(p.expires_at);
      return /*html*/`
      <div class="bg-white dark:bg-neutral-900 border border-skynex-border dark:border-neutral-800 rounded-2xl p-5 flex items-start justify-between gap-4">
        <div class="min-w-0">
          <div class="flex items-center gap-2 mb-1 flex-wrap">
            <p class="font-bold text-skynex-dark dark:text-white truncate">${Staff.esc(p.title)}</p>
            <span class="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${left <= 1 ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-700' : 'bg-green-50 dark:bg-green-950/30 text-green-700'}">${left === 0 ? 'expires today' : `${left}d left`}</span>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400 truncate">${Staff.esc(p.author_name)} · published ${Staff.esc(Staff.formatDate(p.published_at))}</p>
        </div>
        <div class="shrink-0 flex gap-2">
          <button data-edit="${p.id}" class="w-9 h-9 rounded-full border border-skynex-border dark:border-neutral-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-skynex-dark dark:hover:text-white hover:border-skynex-dark transition-colors" aria-label="Edit"><i class="fa-solid fa-pen text-xs"></i></button>
          <button data-delete="${p.id}" class="w-9 h-9 rounded-full border border-skynex-border dark:border-neutral-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-red-600 hover:border-red-600 transition-colors" aria-label="Delete"><i class="fa-solid fa-trash text-xs"></i></button>
        </div>
      </div>`;
    }).join('');
    listEl.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => openForm(rows.find(r => r.id === b.dataset.edit))));
    listEl.querySelectorAll('[data-delete]').forEach(b => b.addEventListener('click', () => remove(b.dataset.delete)));
  }

  async function remove(id) {
    const post = rows.find(r => r.id === id);
    const ok = await Staff.confirm({ title: 'Delete this post?', message: `"${post.title}" and its images/video will be permanently removed.`, confirmLabel: 'Delete', danger: true });
    if (!ok) return;
    try {
      await Media.removeFolder('news-media', id);
    } catch (e) { console.error('media cleanup:', e); }
    const { error } = await db.from('news_posts').delete().eq('id', id);
    if (error) { Staff.toast('Could not delete post.', 'error'); return; }
    rows = rows.filter(r => r.id !== id);
    renderList();
    Staff.toast('Post deleted.');
  }

  function openForm(existing) {
    const isEdit = !!existing;
    const { body, close } = Staff.drawer({ title: isEdit ? 'Edit Post' : 'New Post', html: /*html*/`
      <form data-form class="space-y-5">
        <div><label class="${Staff.labelCls}">Title</label><input data-title required maxlength="200" class="${Staff.inputCls}" value="${Staff.esc(existing?.title || '')}"></div>
        <div><label class="${Staff.labelCls}">Excerpt <span class="normal-case font-normal text-slate-400">(shown on the News list, optional)</span></label><input data-excerpt maxlength="400" class="${Staff.inputCls}" value="${Staff.esc(existing?.excerpt || '')}"></div>
        <div><label class="${Staff.labelCls}">Body</label><textarea data-body required rows="8" class="${Staff.inputCls}">${Staff.esc(existing?.body || '')}</textarea></div>
        <div>
          <label class="${Staff.labelCls}">Featured image <span class="normal-case font-normal text-slate-400">(optional, compressed automatically)</span></label>
          ${existing?.image_path ? `<img src="${Staff.esc(Media.publicUrl('news-media', existing.image_path))}" class="w-full aspect-video object-cover rounded-lg mb-2 bg-skynex-gray dark:bg-neutral-950">` : ''}
          <input data-image type="file" accept="image/png,image/jpeg,image/webp" class="text-sm">
          ${existing?.image_path ? `<label class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-2"><input type="checkbox" data-remove-image> Remove current image</label>` : ''}
        </div>
        <div>
          <label class="${Staff.labelCls}">Video <span class="normal-case font-normal text-slate-400">(optional, MP4/WebM, 50MB max)</span></label>
          ${existing?.video_path ? `<p class="text-xs text-slate-500 dark:text-slate-400 mb-2"><i class="fa-solid fa-circle-play"></i> Current video attached</p>` : ''}
          <input data-video type="file" accept="video/mp4,video/webm" class="text-sm">
          ${existing?.video_path ? `<label class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-2"><input type="checkbox" data-remove-video> Remove current video</label>` : ''}
        </div>
        <p data-error class="hidden text-sm text-red-600"></p>
        <div class="flex gap-3 pt-2">
          <button type="submit" data-submit class="${Staff.primaryBtn} flex-1">${isEdit ? 'Save Changes' : 'Publish'}</button>
        </div>
      </form>` });

    const form = body.querySelector('[data-form]');
    const err = body.querySelector('[data-error]');
    const submitBtn = body.querySelector('[data-submit]');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      err.classList.add('hidden');
      submitBtn.disabled = true;
      submitBtn.textContent = isEdit ? 'Saving…' : 'Publishing…';
      const id = existing?.id || crypto.randomUUID();

      try {
        const patch = {
          title: body.querySelector('[data-title]').value.trim(),
          excerpt: body.querySelector('[data-excerpt]').value.trim() || null,
          body: body.querySelector('[data-body]').value.trim(),
        };

        const imageFile = body.querySelector('[data-image]').files[0];
        if (imageFile) {
          const { blob, ext, type } = await Media.compressImage(imageFile, { maxW: 1600, maxH: 1067, aspect: 16 / 9 });
          const path = `${id}/featured-${Date.now()}.${ext}`;
          await Media.upload('news-media', path, blob, type);
          if (existing?.image_path) await Media.remove('news-media', [existing.image_path]).catch(() => {});
          patch.image_path = path;
        } else if (body.querySelector('[data-remove-image]')?.checked) {
          await Media.remove('news-media', [existing.image_path]).catch(() => {});
          patch.image_path = null;
        }

        const videoFile = body.querySelector('[data-video]').files[0];
        if (videoFile) {
          const ext = Media.checkVideo(videoFile);
          const path = `${id}/video-${Date.now()}.${ext}`;
          await Media.upload('news-media', path, videoFile, videoFile.type);
          if (existing?.video_path) await Media.remove('news-media', [existing.video_path]).catch(() => {});
          patch.video_path = path;
        } else if (body.querySelector('[data-remove-video]')?.checked) {
          await Media.remove('news-media', [existing.video_path]).catch(() => {});
          patch.video_path = null;
        }

        if (isEdit) {
          const { data, error } = await db.from('news_posts').update(patch).eq('id', id).select().single();
          if (error) throw error;
          rows = rows.map(r => r.id === id ? data : r);
        } else {
          const { data, error } = await db.from('news_posts').insert({
            id, ...patch, author_id: profile.id, author_name: profile.full_name || profile.email, author_title: roleName
          }).select().single();
          if (error) throw error;
          rows = [data, ...rows];
        }
        renderList();
        Staff.toast(isEdit ? 'Post updated.' : 'Post published.');
        close();
      } catch (e2) {
        console.error(e2);
        err.textContent = e2.message || 'Something went wrong. Please try again.';
        err.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.textContent = isEdit ? 'Save Changes' : 'Publish';
      }
    });
  }

  const { data, error } = await db.from('news_posts').select('*').order('published_at', { ascending: false });
  if (error) { listEl.innerHTML = `<p class="text-center text-red-600 py-16">Could not load news posts.</p>`; return; }
  rows = data;
  renderList();
})();
