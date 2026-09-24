// ==========================================
// STAFF AUTHENTICATION (thin wrapper around Supabase Auth)
// ==========================================
// Supabase Auth remains solely responsible for credentials -- this module never sees or
// stores a password itself. Role/permission data always comes from the `profiles` table via
// a normal, RLS-protected query: a signed-in user can only ever fetch their OWN profile row
// (enforced in Postgres, see migrations), so nothing here can be spoofed by editing this file
// in devtools -- the server would simply refuse the request.
const Auth = {
  _profileCache: null,
  _permCache: null,

  client() {
    return SupabaseClient.get();
  },

  async getSession() {
    const { data, error } = await this.client().auth.getSession();
    if (error) { console.error('Auth.getSession:', error); return null; }
    return data.session;
  },

  // The caller's own profile + role name. RLS guarantees this can only ever return the
  // signed-in user's own row, never a colleague's.
  async getProfile(force = false) {
    if (this._profileCache && !force) return this._profileCache;
    const session = await this.getSession();
    if (!session) { this._profileCache = null; this._permCache = null; return null; }
    const { data, error } = await this.client()
      .from('profiles')
      .select('id, email, full_name, role_code, position_title, roles ( name )')
      .eq('id', session.user.id)
      .single();
    if (error) { console.error('Auth.getProfile:', error); return null; }
    this._profileCache = data;
    return data;
  },

  // The caller's permission codes (view_contact_submissions, manage_news, ...), read from the
  // existing role_permissions table (RLS lets any signed-in user read it). Used only to decide
  // what to SHOW; the database re-checks the same permissions on every read and write.
  async getPermissions(force = false) {
    if (this._permCache && !force) return this._permCache;
    const profile = await this.getProfile(force);
    if (!profile || !profile.role_code) return new Set();
    const { data, error } = await this.client()
      .from('role_permissions')
      .select('permission_code')
      .eq('role_code', profile.role_code);
    if (error) { console.error('Auth.getPermissions:', error); return new Set(); }
    this._permCache = new Set(data.map(r => r.permission_code));
    return this._permCache;
  },

  async signIn(email, password) {
    const { data, error } = await this.client().auth.signInWithPassword({ email, password });
    if (error) throw error;
    this._profileCache = null; this._permCache = null;
    return data;
  },

  async signOut() {
    await this.client().auth.signOut();
    this._profileCache = null; this._permCache = null;
  },

  async sendPasswordReset(email) {
    const redirectTo = `${window.location.origin}/staff/reset-password`;
    const { error } = await this.client().auth.resetPasswordForEmail(email, { redirectTo });
    if (error) throw error;
  },

  async updatePassword(newPassword) {
    const { error } = await this.client().auth.updateUser({ password: newPassword });
    if (error) throw error;
  },

  onChange(callback) {
    this.client().auth.onAuthStateChange((_event, session) => {
      this._profileCache = null; this._permCache = null;
      callback(session);
    });
  }
};
