// ==========================================
// SET NEW PASSWORD  #/staff/reset-password
// ==========================================
// Reached via the link Supabase emails from Auth.sendPasswordReset(). The Supabase client is
// configured with detectSessionInUrl: true, so a recovery session is already established by
// the time this view mounts.
Views.StaffResetPassword = {
  render: () => /*html*/`
    <div id="view-staff-reset" class="spa-view min-h-screen flex items-center justify-center bg-skynex-gray px-6 py-16">
      <div class="w-full max-w-md bg-white border border-skynex-border rounded-2xl p-8 md:p-10">
        <h1 class="text-2xl font-bold text-skynex-dark tracking-tighter mb-2">Set a New Password</h1>
        <p class="text-sm text-slate-500 font-light mb-8">Choose a new password for your staff account.</p>

        <form data-newpass-form class="space-y-5">
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">New Password</label>
            <input data-newpass type="password" minlength="8" required autocomplete="new-password"
              class="w-full border border-skynex-border rounded-lg px-4 py-3 text-base text-skynex-dark focus:outline-none focus:border-skynex-dark transition-colors" />
          </div>
          <p data-newpass-message class="text-sm font-medium hidden"></p>
          <button type="submit" data-newpass-submit
            class="w-full bg-skynex-dark text-white font-bold uppercase tracking-widest text-xs py-4 rounded-full hover:bg-skynex-blue transition-colors">
            Update Password
          </button>
        </form>
      </div>
    </div>
  `,

  mount: (el) => {
    const form = el.querySelector('[data-newpass-form]');
    const msg = el.querySelector('[data-newpass-message]');
    const btn = el.querySelector('[data-newpass-submit]');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      btn.disabled = true;
      msg.classList.add('hidden');
      const password = el.querySelector('[data-newpass]').value;

      try {
        await Auth.updatePassword(password);
        msg.textContent = 'Password updated. Redirecting…';
        msg.classList.remove('hidden', 'text-red-600');
        msg.classList.add('text-green-600');
        setTimeout(() => Router.navigate('/staff/dashboard'), 1200);
      } catch (err) {
        msg.textContent = 'Could not update password. The reset link may have expired — request a new one from the login page.';
        msg.classList.remove('hidden', 'text-green-600');
        msg.classList.add('text-red-600');
        btn.disabled = false;
      }
    });
  }
};
