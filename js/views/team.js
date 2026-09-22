// ==========================================
// SCREEN: LEADERSHIP  #team
// ==========================================
Views.Team = {
  render: () => /*html*/`
    <div id="view-team" class="spa-view bg-skynex-gray">
      <section class="pt-24 pb-20 bg-white border-b border-skynex-border">
        <div class="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 text-center">
          <h1 class="text-5xl md:text-7xl font-bold text-skynex-dark tracking-tighter mb-6">Leadership</h1>
          <p class="text-xl text-slate-500 font-light max-w-2xl mx-auto">
            The visionaries driving technical innovation and corporate strategy at Skynex Solutions Limited.
          </p>
        </div>
      </section>
      <section class="py-24 md:py-32">
        <div class="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-skynex-border max-w-6xl mx-auto">
            ${AppConfig.teamMembers.map(member => UI.TeamCard(member)).join('')}
          </div>
        </div>
      </section>
    </div>
  `
};
