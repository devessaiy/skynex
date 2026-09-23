// ==========================================
// STAFF LOGIN  #/staff/login
// ==========================================
Views.StaffLogin = {
  render: () => /*html*/`
    <div id="view-staff-login" class="spa-view min-h-screen grid lg:grid-cols-2 bg-skynex-gray">

      <!-- Login column -->
      <div class="flex items-center justify-center px-6 py-16">
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

          <button data-forgot-open class="mt-6 text-xs text-slate-500 hover:text-skynex-dark underline transition-colors">
            Forgot your password?
          </button>
        </div>
      </div>

      <!-- Visual panel: desktop/large screens only. No photography is used anywhere else on
           this site (team headshots are initials, the offline state is an SVG mark), so an
           abstract brand panel keeps this consistent rather than introducing a stock photo. -->
      <div class="hidden lg:flex relative items-center justify-center overflow-hidden bg-skynex-dark">
        <div class="absolute inset-0 opacity-40"
          style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.35) 1px, transparent 0); background-size: 32px 32px;"></div>
        <div class="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full opacity-30 blur-3xl"
          style="background: radial-gradient(circle, #1976D2, transparent 70%);"></div>
        <div class="absolute -bottom-40 -left-24 w-[480px] h-[480px] rounded-full opacity-30 blur-3xl"
          style="background: radial-gradient(circle, #26A69A, transparent 70%);"></div>

        <div class="relative text-center px-12 max-w-md">
          <span class="text-4xl font-bold text-white tracking-tighter">Skynex</span>
          <p class="mt-4 text-lg text-white/70 font-light leading-relaxed">
            The internal portal for Skynex Solutions&rsquo; leadership team.
          </p>
        </div>
      </div>

      <!-- Forgot-password modal: intentionally a dialog, not an inline expansion -- expanding
           in place pushed the whole form/card taller on every reload of this screen, which read
           as a layout bug rather than a feature. -->
      <div data-reset-modal class="hidden fixed inset-0 z-50 items-center justify-center bg-skynex-dark/60 backdrop-blur-sm px-6">
        <div class="w-full max-w-sm bg-white rounded-2xl p-8 relative">
          <button data-reset-close aria-label="Close" class="absolute top-4 right-4 text-slate-400 hover:text-skynex-dark transition-colors">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
          <h2 class="text-lg font-bold text-skynex-dark tracking-tighter mb-2">Reset Password</h2>
          <form data-reset-form class="space-y-4">
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
    </div>
  `,

  mount: (el) => {
    const loginForm = el.querySelector('[data-login-form]');
    const errorEl = el.querySelector('[data-login-error]');
    const submitBtn = el.querySelector('[data-login-submit]');
    const forgotOpen = el.querySelector('[data-forgot-open]');
    const modal = el.querySelector('[data-reset-modal]');
    const resetClose = el.querySelector('[data-reset-close]');
    const resetForm = el.querySelector('[data-reset-form]');
    const resetMessage = el.querySelector('[data-reset-message]');

    const openModal = () => { modal.classList.remove('hidden'); modal.classList.add('flex'); };
    const closeModal = () => { modal.classList.remove('flex'); modal.classList.add('hidden'); };

    forgotOpen.addEventListener('click', openModal);
    resetClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
    });

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
