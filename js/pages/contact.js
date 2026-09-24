// Contact page: submits the inquiry form to Supabase (table: contact_submissions).
(() => {
  const form = document.querySelector('[data-contact-form]');
  const statusEl = document.querySelector('[data-contact-status]');
  const submitBtn = document.querySelector('[data-contact-submit]');
  const field = (name) => form.querySelector(`[data-contact-${name}]`);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.classList.add('hidden');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    const name = field('name').value.trim();
    const email = field('email').value.trim();
    const company_name = field('company').value.trim() || null;
    const service_needed = field('service').value;
    const budget_range = field('budget').value;
    const message = field('message').value.trim();

    try {
      const { error } = await SupabaseClient.get()
        .from('contact_submissions')
        .insert({ name, email, company_name, service_needed, budget_range, message });
      if (error) throw error;

      form.reset();
      statusEl.textContent = 'Thank you — your message has been sent. We\u2019ll be in touch shortly.';
      statusEl.classList.remove('hidden', 'text-red-600');
      statusEl.classList.add('text-green-600');
    } catch (err) {
      console.error('Contact form submission failed:', err);
      statusEl.textContent = 'Something went wrong sending your message. Please try again or email us directly.';
      statusEl.classList.remove('hidden', 'text-green-600');
      statusEl.classList.add('text-red-600');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Message';
    }
  });
})();
