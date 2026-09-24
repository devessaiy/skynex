// ==========================================
// MEDIA HELPERS (staff dashboard only)
// ==========================================
// Images are resized and re-encoded to WebP in the browser BEFORE upload, so Storage never holds
// a multi-megabyte phone photo and public pages stay fast. Videos cannot be re-encoded in the
// browser, so they are limited by type and size instead.
const Media = {
  VIDEO_MAX_BYTES: 50 * 1024 * 1024,
  VIDEO_TYPES: { 'video/mp4': 'mp4', 'video/webm': 'webm' },

  publicUrl(bucket, path) {
    return path ? SupabaseClient.get().storage.from(bucket).getPublicUrl(path).data.publicUrl : null;
  },

  // -> { blob, ext, type }. `aspect` (w/h) center-crops first; `maxW`/`maxH` cap the output size.
  async compressImage(file, { maxW = 1600, maxH = 1600, aspect = null, quality = 0.82 } = {}) {
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) throw new Error('Please choose a JPG, PNG or WebP image.');
    if (file.size > 25 * 1024 * 1024) throw new Error('That image is too large (25 MB max).');

    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    let sx = 0, sy = 0, sw = bitmap.width, sh = bitmap.height;
    if (aspect) {
      if (sw / sh > aspect) { const w = Math.round(sh * aspect); sx = Math.round((sw - w) / 2); sw = w; }
      else { const h = Math.round(sw / aspect); sy = Math.round((sh - h) / 2); sh = h; }
    }
    const scale = Math.min(1, maxW / sw, maxH / sh);
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(sw * scale));
    canvas.height = Math.max(1, Math.round(sh * scale));
    canvas.getContext('2d').drawImage(bitmap, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    bitmap.close && bitmap.close();

    let blob = await new Promise(r => canvas.toBlob(r, 'image/webp', quality));
    let ext = 'webp';
    if (!blob || blob.type !== 'image/webp') {            // very old Safari: fall back to JPEG
      blob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', quality));
      ext = 'jpg';
    }
    if (!blob) throw new Error('Could not process that image.');
    return { blob, ext, type: blob.type };
  },

  checkVideo(file) {
    const ext = this.VIDEO_TYPES[file.type];
    if (!ext) throw new Error('Video must be an MP4 or WebM file.');
    if (file.size > this.VIDEO_MAX_BYTES) throw new Error('Video is too large (50 MB max).');
    return ext;
  },

  async upload(bucket, path, body, contentType) {
    const { error } = await SupabaseClient.get().storage.from(bucket)
      .upload(path, body, { contentType, cacheControl: '31536000', upsert: false });
    if (error) throw error;
    return path;
  },

  async remove(bucket, paths) {
    const list = paths.filter(Boolean);
    if (!list.length) return;
    const { error } = await SupabaseClient.get().storage.from(bucket).remove(list);
    if (error) throw error;
  },

  // Remove every file stored under "<folder>/" (used when a whole post / member is deleted).
  async removeFolder(bucket, folder) {
    const store = SupabaseClient.get().storage.from(bucket);
    const { data, error } = await store.list(folder, { limit: 100 });
    if (error) throw error;
    await this.remove(bucket, (data || []).map(f => `${folder}/${f.name}`));
  }
};
