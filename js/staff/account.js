// Staff -> My Account. Lets staff update their own name/title and change their password.
// role_code is deliberately never editable here (or anywhere client-side) -- the database column
// permissions already block authenticated users from writing it.
(async () => {
  const ctx = await Staff.init({ active: 'account' });
  if (!ctx) return;
  const { main, profile, roleName, db } = ctx;

  main.innerHTML = Staff.pageHeader('My Account');
  main.insertAdjacentHTML('beforeend', /*html*/`
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-3xl">
      <div class="bg-white dark:bg-neutral-900 border border-skynex-border dark:border-neutral-800 rounded-2xl p-6 md:p-8">
        <h2 class="text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-6">Profile</h2>
        <form data-profile-form class="space-y-5">
          <div><label for="acc-1" class="${Staff.labelCls}">Full name</label><input id="acc-1" data-full-name autocomplete="name" required maxlength="120" class="${Staff.inputCls}" value="${Staff.esc(profile.full_name || '')}"></div>
          <div><label for="acc-2" class="${Staff.labelCls}">Position title <span class="normal-case font-normal text-slate-600 dark:text-slate-400">(shown on your dashboard)</span></label><input id="acc-2" data-position-title maxlength="120" class="${Staff.inputCls}" value="${Staff.esc(profile.position_title || '')}"></div>
          <div><label for="acc-3" class="${Staff.labelCls}">Email</label><input id="acc-3" disabled class="${Staff.inputCls} bg-skynex-gray dark:bg-neutral-950 text-slate-600 dark:text-slate-400" value="${Staff.esc(profile.email)}"></div>
          <div><label for="acc-4" class="${Staff.labelCls}">Role</label><input id="acc-4" disabled class="${Staff.inputCls} bg-skynex-gray dark:bg-neutral-950 text-slate-600 dark:text-slate-400" value="${Staff.esc(roleName)}"></div>
          <p data-profile-error role="alert" class="hidden text-sm text-red-600 dark:text-red-400"></p>
          <button type="submit" data-profile-submit class="${Staff.primaryBtn}">Save Changes</button>
        </form>
      </div>
      <div class="bg-white dark:bg-neutral-900 border border-skynex-border dark:border-neutral-800 rounded-2xl p-6 md:p-8">
        <h2 class="text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-6">Change Password</h2>
        <form data-password-form class="space-y-5">
          <div><label for="acc-5" class="${Staff.labelCls}">New password</label><input id="acc-5" data-new-password autocomplete="new-password" type="password" required minlength="8" class="${Staff.inputCls}"></div>
          <div><label for="acc-6" class="${Staff.labelCls}">Confirm new password</label><input id="acc-6" data-confirm-password autocomplete="new-password" type="password" required minlength="8" class="${Staff.inputCls}"></div>
          <p data-password-error role="alert" class="hidden text-sm text-red-600 dark:text-red-400"></p>
          <p data-password-success class="hidden text-sm text-green-600"></p>
          <button type="submit" data-password-submit class="${Staff.ghostBtn}">Update Password</button>
        </form>
      </div>
    </div>`);

  const pForm = main.querySelector('[data-profile-form]');
  const pErr = main.querySelector('[data-profile-error]');
  pForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    pErr.classList.add('hidden');
    const btn = main.querySelector('[data-profile-submit]');
    btn.disabled = true; btn.textContent = 'Saving…';
    const { error } = await db.from('profiles').update({
      full_name: main.querySelector('[data-full-name]').value.trim(),
      position_title: main.querySelector('[data-position-title]').value.trim() || null,
    }).eq('id', profile.id);
    if (error) { pErr.textContent = 'Could not save changes.'; pErr.classList.remove('hidden'); }
    else { await Auth.getProfile(true); Staff.clearCache(); Staff.toast('Profile updated.'); }
    btn.disabled = false; btn.textContent = 'Save Changes';
  });

  const wForm = main.querySelector('[data-password-form]');
  const wErr = main.querySelector('[data-password-error]');
  const wOk = main.querySelector('[data-password-success]');
  wForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    wErr.classList.add('hidden'); wOk.classList.add('hidden');
    const a = main.querySelector('[data-new-password]').value, b = main.querySelector('[data-confirm-password]').value;
    if (a !== b) { wErr.textContent = 'Passwords do not match.'; wErr.classList.remove('hidden'); return; }
    const btn = main.querySelector('[data-password-submit]');
    btn.disabled = true; btn.textContent = 'Updating…';
    try {
      await Auth.updatePassword(a);
      wOk.textContent = 'Password updated.'; wOk.classList.remove('hidden');
      wForm.reset();
    } catch (err) {
      wErr.textContent = 'Could not update password.'; wErr.classList.remove('hidden');
    }
    btn.disabled = false; btn.textContent = 'Update Password';
  });
})();
