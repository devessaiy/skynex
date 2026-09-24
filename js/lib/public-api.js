// ==========================================
// PUBLIC READ API (no Supabase SDK)
// ==========================================
// The public pages (Leadership, News) only READ data that Row Level Security already exposes to
// visitors, so they call the Supabase REST endpoint with plain fetch() instead of downloading the
// whole Supabase JS library. Keeps those pages light. The publishable key is public by design.
const PublicAPI = {
  async select(table, query) {
    const res = await fetch(`${AppConfig.supabase.url}/rest/v1/${table}?${query}`, {
      headers: { apikey: AppConfig.supabase.publishableKey, Accept: 'application/json' }
    });
    if (!res.ok) throw new Error(`${table}: HTTP ${res.status}`);
    return res.json();
  },

  // Public URL of a file in a public Storage bucket (null when there is no file).
  mediaUrl(bucket, path) {
    if (!path) return null;
    const safe = path.split('/').map(encodeURIComponent).join('/');
    return `${AppConfig.supabase.url}/storage/v1/object/public/${bucket}/${safe}`;
  },

  formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }
};
