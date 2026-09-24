// Set-new-password page. Reached via the link Supabase emails from Auth.sendPasswordReset().
// The Supabase client has detectSessionInUrl: true, so a recovery session already exists here.
(() => {
  const form = document.querySelector('[data-newpass-form]');
  const msg = document.querySelector('[data-newpass-message]');
  const btn = document.querySelector('[data-newpass-submit]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    btn.disabled = true;
    msg.classList.add('hidden');
    const password = document.querySelector('[data-newpass]').value;

    try {
      await Auth.updatePassword(password);
      msg.textContent = 'Password updated. Redirecting…';
      msg.classList.remove('hidden', 'text-red-600');
      msg.classList.add('text-green-600');
      setTimeout(() => window.location.assign('/staff/dashboard'), 1200);
    } catch (err) {
      msg.textContent = 'Could not update password. The reset link may have expired — request a new one from the login page.';
      msg.classList.remove('hidden', 'text-green-600');
      msg.classList.add('text-red-600');
      btn.disabled = false;
    }
  });
})();
