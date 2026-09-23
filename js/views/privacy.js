// ==========================================
// SCREEN: PRIVACY POLICY  #privacy-policy
// ==========================================
// Content reflects only what the current codebase actually does: no analytics, no tracking
// cookies, and no third-party integrations beyond the CDN-hosted fonts/icon library/framework
// loaded in index.html and the external WhatsApp / Trideta links used elsewhere on the site.
// If those change, this page should be revisited alongside them.
Views.PrivacyPolicy = {
  render: () => /*html*/`
    <div id="view-privacy-policy" class="spa-view bg-white">
      <section class="pt-24 pb-20 border-b border-skynex-border bg-skynex-gray">
        <div class="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
          <h1 class="text-5xl md:text-7xl font-bold text-skynex-dark tracking-tighter mb-6">Privacy Policy</h1>
          <p class="text-lg text-slate-500 font-light max-w-3xl">
            Last updated: September 2026. This policy explains what information ${AppConfig.company.name} may collect through this website, how it is used, and the choices available to you.
          </p>
        </div>
      </section>

      <section class="py-24">
        <div class="max-w-[880px] mx-auto px-6 md:px-12 lg:px-0 space-y-12">

          ${UI.LegalSection(1, 'Introduction', /*html*/`
            <p class="text-base md:text-lg text-slate-600 font-light leading-relaxed">
              ${AppConfig.company.name} ("Skynex", "we", "us", or "our") operates this website as an informational and corporate presence for our business. This Privacy Policy describes how we handle information in connection with your use of this website. It does not apply to third-party websites we link to, including our Trideta product platform, which may maintain its own separate policy.
            </p>
          `)}

          ${UI.LegalSection(2, 'Information We May Collect', /*html*/`
            <p class="text-base md:text-lg text-slate-600 font-light leading-relaxed">
              We aim to collect only what is necessary to respond to you. The categories of information involved are:
            </p>
            <ul class="list-disc pl-6 space-y-2 text-base md:text-lg text-slate-600 font-light leading-relaxed">
              <li><strong class="text-skynex-dark font-semibold">Information you provide directly</strong> &mdash; if you reach out through our Contact page, email, or WhatsApp, you may share your full name, email address, phone number, and the content of your message or enquiry.</li>
              <li><strong class="text-skynex-dark font-semibold">Standard technical data</strong> &mdash; like any website, requests to load this site pass through your browser and our hosting infrastructure, which may incidentally process technical information such as your IP address and browser type. We do not currently collect or review this data ourselves for any analytics or marketing purpose.</li>
            </ul>
            <p class="text-base md:text-lg text-slate-600 font-light leading-relaxed">
              We do not currently ask visitors to create accounts, log in, or submit payment information through this website.
            </p>
          `)}

          ${UI.LegalSection(3, 'How We Use Information', /*html*/`
            <p class="text-base md:text-lg text-slate-600 font-light leading-relaxed">Information you send us is used only to:</p>
            <ul class="list-disc pl-6 space-y-2 text-base md:text-lg text-slate-600 font-light leading-relaxed">
              <li>Respond to your enquiry, request, or message;</li>
              <li>Communicate with you about our services, where you have asked us to; and</li>
              <li>Maintain a reasonable record of business correspondence.</li>
            </ul>
            <p class="text-base md:text-lg text-slate-600 font-light leading-relaxed">
              We do not use the information you send us for advertising, and we do not sell it to third parties.
            </p>
          `)}

          ${UI.LegalSection(4, 'Cookies and Similar Technologies', /*html*/`
            <p class="text-base md:text-lg text-slate-600 font-light leading-relaxed">
              This website does not itself set cookies or use tracking pixels, session storage, or similar technologies to identify or follow visitors across sessions. Should this change &mdash; for example, if we later add analytics tools &mdash; this policy will be updated to reflect that before such tools go live.
            </p>
          `)}

          ${UI.LegalSection(5, 'Website Analytics', /*html*/`
            <p class="text-base md:text-lg text-slate-600 font-light leading-relaxed">
              We do not currently use Google Analytics or any other website analytics or visitor-tracking service on this site.
            </p>
          `)}

          ${UI.LegalSection(6, 'Third-Party Services', /*html*/`
            <p class="text-base md:text-lg text-slate-600 font-light leading-relaxed">
              This website loads a small number of third-party resources needed to render its design and icons:
            </p>
            <ul class="list-disc pl-6 space-y-2 text-base md:text-lg text-slate-600 font-light leading-relaxed">
              <li><strong class="text-skynex-dark font-semibold">Google Fonts</strong> &mdash; for website typography.</li>
              <li><strong class="text-skynex-dark font-semibold">Cloudflare CDN (cdnjs)</strong> &mdash; for our icon library and the Tailwind CSS styling framework.</li>
            </ul>
            <p class="text-base md:text-lg text-slate-600 font-light leading-relaxed">
              Loading these resources may cause your browser to make a request directly to these providers, who may process limited technical data (such as your IP address) as part of delivering that request, subject to their own privacy policies. We do not share any of your personal information with these providers.
            </p>
            <p class="text-base md:text-lg text-slate-600 font-light leading-relaxed">
              If you choose to contact us via the WhatsApp link on this site, that conversation takes place on WhatsApp's platform and is governed by WhatsApp's own privacy policy, not this one. Our Trideta product is hosted on a separate domain and may be governed by its own separate policy.
            </p>
          `)}

          ${UI.LegalSection(7, 'Data Sharing and Disclosure', /*html*/`
            <p class="text-base md:text-lg text-slate-600 font-light leading-relaxed">
              We do not sell, rent, or trade your personal information. We may disclose information you have provided if required to do so by law, regulation, or a valid legal process, or where necessary to protect our legal rights.
            </p>
          `)}

          ${UI.LegalSection(8, 'Data Storage and Protection', /*html*/`
            <p class="text-base md:text-lg text-slate-600 font-light leading-relaxed">
              Information you send us is received into our business communication channels (such as our company email address). We take reasonable steps to protect information sent to us, but no method of electronic transmission or storage is completely secure, and we cannot guarantee absolute security.
            </p>
          `)}

          ${UI.LegalSection(9, 'Data Retention', /*html*/`
            <p class="text-base md:text-lg text-slate-600 font-light leading-relaxed">
              We retain correspondence and enquiry information for as long as reasonably necessary to respond to you, manage our business relationship with you, or as required by applicable law, after which it may be deleted.
            </p>
          `)}

          ${UI.LegalSection(10, 'Your Rights', /*html*/`
            <p class="text-base md:text-lg text-slate-600 font-light leading-relaxed">
              Depending on applicable Nigerian data protection legislation, you may have rights to request access to, correction of, or deletion of personal information you have shared with us. You can exercise these rights by contacting us using the details below.
            </p>
          `)}

          ${UI.LegalSection(11, "Children's Privacy", /*html*/`
            <p class="text-base md:text-lg text-slate-600 font-light leading-relaxed">
              This website is intended for a general business audience and is not directed at children. We do not knowingly collect personal information from children through this website.
            </p>
          `)}

          ${UI.LegalSection(12, 'Contact Us', /*html*/`
            <p class="text-base md:text-lg text-slate-600 font-light leading-relaxed">
              For questions about this Privacy Policy or to make a request regarding your information, contact us at
              <a href="mailto:${AppConfig.company.email}" class="text-skynex-blue hover:underline">${AppConfig.company.email}</a>.
            </p>
          `)}

          ${UI.LegalSection(13, 'Updates to This Policy', /*html*/`
            <p class="text-base md:text-lg text-slate-600 font-light leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes to this website or our practices. The "Last updated" date at the top of this page indicates when it was last revised. We encourage you to review this page periodically.
            </p>
            <p class="text-sm text-slate-400 font-light leading-relaxed pt-4">
              This page is provided for general informational purposes and does not constitute legal advice. We recommend it be reviewed by a qualified Nigerian legal professional to confirm ongoing compliance with applicable law.
            </p>
          `)}

        </div>
      </section>
    </div>
  `
};
