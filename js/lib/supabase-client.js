// ==========================================
// SUPABASE CLIENT (singleton)
// ==========================================
// Requires the Supabase UMD bundle (window.supabase) to already be loaded. Only routes that
// actually need it (Contact, Staff Login, Reset Password, each staff dashboard) list the CDN
// script in their route's `src` array, so public visitors who never touch the staff portal or
// the contact form never download this at all.
const SupabaseClient = (() => {
  let client = null;
  return {
    get() {
      if (!client) {
        if (!window.supabase || !window.supabase.createClient) {
          throw new Error('Supabase library has not loaded yet.');
        }
        client = window.supabase.createClient(
          AppConfig.supabase.url,
          AppConfig.supabase.publishableKey,
          { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }
        );
      }
      return client;
    }
  };
})();
