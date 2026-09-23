// ==========================================
// SCREEN: CONTACT  #contact
// ==========================================
Views.Contact = {
  render: () => /*html*/`
    <div id="view-contact" class="spa-view bg-white">
      <section class="pt-24 pb-32">
        <div class="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
          <h1 class="text-5xl md:text-7xl font-bold text-skynex-dark tracking-tighter mb-16 text-center">Engage with Skynex.</h1>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            
            <div>
              <h2 class="text-2xl font-bold text-skynex-dark mb-8">Send an Inquiry</h2>
              <form data-contact-form class="space-y-8">
                <div>
                  <label class="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2">Full Name</label>
                  <input data-contact-name type="text" required class="w-full bg-transparent border-b border-slate-300 py-3 text-skynex-dark focus:outline-none focus:border-skynex-dark transition-colors" placeholder="Jane Doe">
                </div>
                <div>
                  <label class="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2">Email Address</label>
                  <input data-contact-email type="email" required class="w-full bg-transparent border-b border-slate-300 py-3 text-skynex-dark focus:outline-none focus:border-skynex-dark transition-colors" placeholder="jane@company.com">
                </div>
                <div>
                  <label class="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2">Message or Requirement</label>
                  <textarea data-contact-message rows="4" required class="w-full bg-transparent border-b border-slate-300 py-3 text-skynex-dark focus:outline-none focus:border-skynex-dark transition-colors resize-none" placeholder="How can we assist your business?"></textarea>
                </div>
                <p data-contact-status class="text-sm font-medium hidden"></p>
                <button type="submit" data-contact-submit class="px-10 py-4 bg-skynex-dark text-white text-sm font-bold tracking-widest uppercase rounded-full hover:bg-slate-800 transition-colors disabled:opacity-50">
                  Submit Message
                </button>
              </form>
            </div>

            <div class="bg-skynex-gray p-10 md:p-16 rounded-2xl">
              <h2 class="text-2xl font-bold text-skynex-dark mb-10">Corporate Headquarters</h2>
              <div class="space-y-8">
                <div>
                  <p class="text-xs font-bold tracking-widest uppercase text-slate-500 mb-2">Address</p>
                  <p class="text-lg text-skynex-dark font-light leading-relaxed">${AppConfig.company.address}</p>
                </div>
                <div>
                  <p class="text-xs font-bold tracking-widest uppercase text-slate-500 mb-2">Electronic Mail</p>
                  <a href="mailto:${AppConfig.company.email}" class="text-lg text-skynex-blue hover:text-skynex-dark transition-colors">${AppConfig.company.email}</a>
                </div>
                <div class="pt-8 border-t border-slate-200">
                  <p class="text-xs font-bold tracking-widest uppercase text-slate-500 mb-2">Corporate Registration</p>
                  <p class="text-lg text-skynex-dark font-light">CAC RC: ${AppConfig.company.rc}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  `,

  mount: (el) => {
    const form = el.querySelector('[data-contact-form]');
    const statusEl = el.querySelector('[data-contact-status]');
    const submitBtn = el.querySelector('[data-contact-submit]');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      statusEl.classList.add('hidden');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      const name = el.querySelector('[data-contact-name]').value.trim();
      const email = el.querySelector('[data-contact-email]').value.trim();
      const message = el.querySelector('[data-contact-message]').value.trim();

      try {
        const { error } = await SupabaseClient.get()
          .from('contact_submissions')
          .insert({ name, email, message });
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
  }
};
