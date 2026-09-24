// Staff login page. Supabase Auth does the real authentication (js/core/auth.js).
(async () => {
  // Already signed in? Skip the form.
  if (await Auth.getSession()) { window.location.replace('/staff/dashboard'); return; }

  const el = document;
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

  // Only ever redirect to a path on this site (never an external URL).
  const safeRedirect = () => {
    const r = new URLSearchParams(window.location.search).get('redirect');
    return r && r.startsWith('/') && !r.startsWith('//') ? r : '/staff/dashboard';
  };

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.classList.add('hidden');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in…';

    const email = el.querySelector('[data-login-email]').value.trim();
    const password = el.querySelector('[data-login-password]').value;

    try {
      await Auth.signIn(email, password);
      window.location.assign(safeRedirect());
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
})();
