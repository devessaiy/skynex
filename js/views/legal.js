// ==========================================
// SCREEN: LEGAL INFORMATION  #legal
// ==========================================
// Deliberately limited to company-level facts appropriate for a public website (name, RC
// number, company type, registered address, incorporation jurisdiction, and a general summary
// of registered business objects). It does not reproduce personal details found in the CAC
// MEMART/Status Report — director/shareholder addresses, dates of birth, emails, phone numbers,
// shareholding percentages, or witness details — as those are not appropriate for public
// disclosure on a company website.
Views.Legal = {
  render: () => /*html*/`
    <div id="view-legal" class="spa-view bg-white">
      <section class="pt-24 pb-20 border-b border-skynex-border bg-skynex-gray">
        <div class="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
          <h1 class="text-5xl md:text-7xl font-bold text-skynex-dark tracking-tighter mb-6">Legal Information</h1>
          <p class="text-lg text-slate-500 font-light max-w-3xl">
            Corporate and legal information about ${AppConfig.company.name}.
          </p>
        </div>
      </section>

      <section class="py-24">
        <div class="max-w-[880px] mx-auto px-6 md:px-12 lg:px-0 space-y-12">

          ${UI.LegalSection(1, 'Company Information', /*html*/`
            <div class="divide-y divide-skynex-border">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-6 py-4">
                <p class="text-sm font-bold tracking-widest uppercase text-slate-500">Registered Name</p>
                <p class="sm:col-span-2 text-base md:text-lg text-skynex-dark font-light">${AppConfig.company.name}</p>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-6 py-4">
                <p class="text-sm font-bold tracking-widest uppercase text-slate-500">RC Number</p>
                <p class="sm:col-span-2 text-base md:text-lg text-skynex-dark font-light">${AppConfig.company.rc}</p>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-6 py-4">
                <p class="text-sm font-bold tracking-widest uppercase text-slate-500">Company Type</p>
                <p class="sm:col-span-2 text-base md:text-lg text-skynex-dark font-light">Private Company Limited by Shares</p>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-6 py-4">
                <p class="text-sm font-bold tracking-widest uppercase text-slate-500">Jurisdiction of Incorporation</p>
                <p class="sm:col-span-2 text-base md:text-lg text-skynex-dark font-light">Federal Republic of Nigeria, under the Companies and Allied Matters Act, 2020</p>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-6 py-4">
                <p class="text-sm font-bold tracking-widest uppercase text-slate-500">Registered Office</p>
                <p class="sm:col-span-2 text-base md:text-lg text-skynex-dark font-light">${AppConfig.company.address}</p>
              </div>
            </div>
          `)}

          ${UI.LegalSection(2, 'Principal Business Activities', /*html*/`
            <p class="text-base md:text-lg text-slate-600 font-light leading-relaxed">
              As registered with the Corporate Affairs Commission, our objects include information technology consultancy, software and mobile/web application development, system integration, cloud infrastructure and data processing, research and development of proprietary software (including security-focused applications), technical support and IT training, creative and branding services, and commercial/digital printing and ICT equipment supply.
            </p>
          `)}

          ${UI.LegalSection(3, 'Intellectual Property Notice', /*html*/`
            <p class="text-base md:text-lg text-slate-600 font-light leading-relaxed">
              "Skynex", the Skynex logo, "Trideta", and other product and brand names referenced on this website are proprietary assets of ${AppConfig.company.name}, except where otherwise indicated. All website content is protected by applicable intellectual property law and may not be used without our prior written permission.
            </p>
          `)}

          ${UI.LegalSection(4, 'Website Ownership', /*html*/`
            <p class="text-base md:text-lg text-slate-600 font-light leading-relaxed">
              This website is owned and operated by ${AppConfig.company.name}.
            </p>
          `)}

          ${UI.LegalSection(5, 'Related Legal Documents', /*html*/`
            <p class="text-base md:text-lg text-slate-600 font-light leading-relaxed">
              Further terms governing use of this website are set out in our
              <a href="/privacy-policy" class="text-skynex-blue hover:underline">Privacy Policy</a> and
              <a href="/terms-of-service" class="text-skynex-blue hover:underline">Terms of Service</a>.
            </p>
          `)}

          ${UI.LegalSection(6, 'Legal Enquiries', /*html*/`
            <p class="text-base md:text-lg text-slate-600 font-light leading-relaxed">
              For legal or corporate enquiries relating to ${AppConfig.company.name}, please contact us at
              <a href="mailto:${AppConfig.company.email}" class="text-skynex-blue hover:underline">${AppConfig.company.email}</a>.
            </p>
            <p class="text-sm text-slate-400 font-light leading-relaxed pt-4">
              This page summarises publicly appropriate company information and does not constitute a full corporate filing or legal advice.
            </p>
          `)}

        </div>
      </section>
    </div>
  `
};
