// ==========================================
// SCREEN: SERVICES / CAPABILITIES  #services
// ==========================================
Views.Services = {
  render: () => /*html*/`
    <div id="view-services" class="spa-view bg-white">
      <section class="pt-24 pb-20 border-b border-skynex-border">
        <div class="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
          <h1 class="text-5xl md:text-7xl font-bold text-skynex-dark tracking-tighter mb-6">Our Capabilities</h1>
          <p class="text-2xl text-slate-500 font-light max-w-3xl">
            A comprehensive suite of technological and creative solutions, delivered with uncompromising quality and strategic intent.
          </p>
        </div>
      </section>
      <section class="py-24">
        <div class="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
          ${AppConfig.servicesPage.map(section => `
            <div class="mb-24 last:mb-0">
              <h2 class="text-xl font-bold uppercase tracking-widest text-skynex-dark mb-12 border-b-2 border-skynex-dark inline-block pb-2">${section.category}</h2>
              <div class="structural-list">
                ${section.items.map(item => UI.ServiceListItem(item)).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    </div>
  `
};
