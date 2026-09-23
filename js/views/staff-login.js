// ==========================================
// STAFF LOGIN  #/staff/login
// ==========================================
Views.StaffLogin = {
  render: () => /*html*/`
    <div id="view-staff-login" class="spa-view min-h-screen flex items-center justify-center bg-skynex-gray px-6 py-16">
      <div class="w-full max-w-md bg-white border border-skynex-border rounded-2xl p-8 md:p-10">
        <h1 class="text-2xl font-bold text-skynex-dark tracking-tighter mb-2">Staff Login</h1>
        <p class="text-sm text-slate-500 font-light mb-8">Sign in with your Skynex staff account.</p>

        <form data-login-form class="space-y-5">
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Email</label>
            <input data-login-email type="email" required autocomplete="username"
              class="w-full border border-skynex-border rounded-lg px-4 py-3 text-base text-skynex-dark focus:outline-none focus:border-skynex-dark transition-colors" />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Password</label>
            <input data-login-password type="password" required autocomplete="current-password"
              class="w-full border border-skynex-border rounded-lg px-4 py-3 text-base text-skynex-dark focus:outline-none focus:border-skynex-dark transition-colors" />
          </div>

          <p data-login-error class="text-sm text-red-600 font-medium hidden"></p>

          <button type="submit" data-login-submit
            class="w-full bg-skynex-dark text-white font-bold uppercase tracking-widest text-xs py-4 rounded-full hover:bg-skynex-blue transition-colors">
            Log In
          </button>
        </form>

        <button data-forgot-toggle class="mt-6 text-xs text-slate-500 hover:text-skynex-dark underline transition-colors">
          Forgot your password?
        </button>

        <form data-reset-form class="hidden mt-6 pt-6 border-t border-skynex-border space-y-4">
          <p class="text-sm text-slate-500 font-light">Enter your email and we&rsquo;ll send you a reset link.</p>
          <input data-reset-email type="email" required autocomplete="username" placeholder="you@company.com"
            class="w-full border border-skynex-border rounded-lg px-4 py-3 text-base text-skynex-dark focus:outline-none focus:border-skynex-dark transition-colors" />
          <p data-reset-message class="text-sm text-slate-500 font-light hidden"></p>
          <button type="submit"
            class="w-full border border-skynex-dark text-skynex-dark font-bold uppercase tracking-widest text-xs py-4 rounded-full hover:bg-skynex-dark hover:text-white transition-colors">
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  `,

  mount: (el) => {
    const loginForm = el.querySelector('[data-login-form]');
    const errorEl = el.querySelector('[data-login-error]');
    const submitBtn = el.querySelector('[data-login-submit]');
    const forgotToggle = el.querySelector('[data-forgot-toggle]');
    const resetForm = el.querySelector('[data-reset-form]');
    const resetMessage = el.querySelector('[data-reset-message]');

    forgotToggle.addEventListener('click', () => resetForm.classList.toggle('hidden'));

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorEl.classList.add('hidden');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Signing in…';

      const email = el.querySelector('[data-login-email]').value.trim();
      const password = el.querySelector('[data-login-password]').value;

      try {
        await Auth.signIn(email, password);
        const redirect = new URLSearchParams(window.location.search).get('redirect');
        Router.navigate(redirect || '/staff/dashboard');
      } catch (err) {
        errorEl.textContent = 'Incorrect email or password.';
        errorEl.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Log In';
      }
    });

    resetForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = el.querySelector('[data-reset-email]').value.trim();
      resetMessage.classList.remove('hidden');
      resetMessage.textContent = 'Sending…';
      try {
        await Auth.sendPasswordReset(email);
      } catch (err) {
        // Fall through to the same neutral message either way -- never reveal whether an
        // email address has a staff account.
      }
      resetMessage.textContent = 'If that email has a staff account, a reset link has been sent.';
    });
  }
};
