// ==========================================
// SCREEN: TERMS OF SERVICE  #terms-of-service
// ==========================================
Views.TermsOfService = {
  render: () => /*html*/`
    <div id="view-terms-of-service" class="spa-view bg-white">
      <section class="pt-24 pb-20 border-b border-skynex-border bg-skynex-gray">
        <div class="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
          <h1 class="text-5xl md:text-7xl font-bold text-skynex-dark tracking-tighter mb-6">Terms of Service</h1>
          <p class="text-lg text-slate-500 font-light max-w-3xl">
            Last updated: September 2026. These Terms govern your use of this website, operated by ${AppConfig.company.name}.
          </p>
        </div>
      </section>

      <section class="py-24">
        <div class="max-w-[880px] mx-auto px-6 md:px-12 lg:px-0 space-y-12">

          ${UI.LegalSection(1, 'Acceptance of Terms', /*html*/`
            <p class="text-base md:text-lg text-slate-600 font-light leading-relaxed">
              By accessing or using this website, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please discontinue use of the website.
            </p>
          `)}

          ${UI.LegalSection(2, 'Use of the Website', /*html*/`
            <p class="text-base md:text-lg text-slate-600 font-light leading-relaxed">
              This website is provided as an informational and corporate resource describing ${AppConfig.company.name}, its leadership, and its services. It is not, on its own, a platform for placing orders, making payments, or entering binding transactions.
            </p>
          `)}

          ${UI.LegalSection(3, 'Intellectual Property', /*html*/`
            <p class="text-base md:text-lg text-slate-600 font-light leading-relaxed">
              All content on this website &mdash; including text, graphics, logos, and the "Skynex" and "Trideta" names &mdash; is the property of ${AppConfig.company.name} or its licensors, and is protected by applicable intellectual property laws, except where otherwise indicated. You may not copy, reproduce, distribute, or create derivative works from this content without our prior written permission.
            </p>
          `)}

          ${UI.LegalSection(4, 'Website Content', /*html*/`
            <p class="text-base md:text-lg text-slate-600 font-light leading-relaxed">
              Content on this website, including descriptions of our services and capabilities, is provided for general informational purposes and does not constitute a binding offer or contract. Any specific engagement for our services will be governed by a separate written agreement between ${AppConfig.company.name} and the client.
            </p>
          `)}

          ${UI.LegalSection(5, 'Product and Service Information', /*html*/`
            <p class="text-base md:text-lg text-slate-600 font-light leading-relaxed">
              Descriptions of our capabilities &mdash; including software development, cloud and data processing, system integration, ICT equipment supply, technical support, and creative and printing services &mdash; are summarised on our
              <a href="/services" class="text-skynex-blue hover:underline">Capabilities page</a>. We aim to keep this information accurate but reserve the right to update, expand, or discontinue services described here at any time without prior notice.
            </p>
          `)}

          ${UI.LegalSection(6, 'User Responsibilities', /*html*/`
            <p class="text-base md:text-lg text-slate-600 font-light leading-relaxed">When contacting us through this website, you agree to:</p>
            <ul class="list-disc pl-6 space-y-2 text-base md:text-lg text-slate-600 font-light leading-relaxed">
              <li>Provide accurate and truthful information;</li>
              <li>Use our contact channels only for genuine business enquiries; and</li>
              <li>Comply with all applicable laws while using this website.</li>
            </ul>
          `)}

          ${UI.LegalSection(7, 'Prohibited Use', /*html*/`
            <p class="text-base md:text-lg text-slate-600 font-light leading-relaxed">You agree not to:</p>
            <ul class="list-disc pl-6 space-y-2 text-base md:text-lg text-slate-600 font-light leading-relaxed">
              <li>Attempt to gain unauthorized access to this website or any connected systems;</li>
              <li>Introduce viruses, malware, or other harmful code;</li>
              <li>Scrape, harvest, or misuse content or contact information from this website; or</li>
              <li>Use this website for any unlawful purpose or in a way that infringes the rights of others.</li>
            </ul>
          `)}

          ${UI.LegalSection(8, 'External Links', /*html*/`
            <p class="text-base md:text-lg text-slate-600 font-light leading-relaxed">
              This website may link to third-party destinations, including WhatsApp and our Trideta product platform, and may reference our social media presence. We do not control and are not responsible for the content, availability, or privacy practices of any third-party site or platform.
            </p>
          `)}

          ${UI.LegalSection(9, 'Availability of the Website', /*html*/`
            <p class="text-base md:text-lg text-slate-600 font-light leading-relaxed">
              We aim to keep this website available and accurate, but we do not guarantee uninterrupted, error-free, or continuous access. We may modify, suspend, or discontinue any part of this website at any time without prior notice.
            </p>
          `)}

          ${UI.LegalSection(10, 'Limitation of Liability', /*html*/`
            <p class="text-base md:text-lg text-slate-600 font-light leading-relaxed">
              To the maximum extent permitted by applicable law, ${AppConfig.company.name} shall not be liable for any indirect, incidental, or consequential loss or damage arising from your use of, or inability to use, this website. This website and its content are provided on an "as is" and "as available" basis, without warranties of any kind, express or implied.
            </p>
          `)}

          ${UI.LegalSection(11, 'Changes to These Terms', /*html*/`
            <p class="text-base md:text-lg text-slate-600 font-light leading-relaxed">
              We may revise these Terms of Service from time to time. Continued use of this website after changes are posted constitutes acceptance of the revised terms. The "Last updated" date at the top of this page reflects the most recent revision.
            </p>
          `)}

          ${UI.LegalSection(12, 'Governing Law and Jurisdiction', /*html*/`
            <p class="text-base md:text-lg text-slate-600 font-light leading-relaxed">
              These Terms are governed by and construed in accordance with the laws of the Federal Republic of Nigeria.
            </p>
            <p class="text-sm text-slate-400 font-light leading-relaxed pt-2">
              The precise venue/court for any dispute has not been specified here and should be confirmed with qualified Nigerian legal counsel before this clause is treated as final.
            </p>
          `)}

          ${UI.LegalSection(13, 'Contact Information', /*html*/`
            <p class="text-base md:text-lg text-slate-600 font-light leading-relaxed">
              Questions about these Terms of Service can be directed to
              <a href="mailto:${AppConfig.company.email}" class="text-skynex-blue hover:underline">${AppConfig.company.email}</a>.
            </p>
            <p class="text-sm text-slate-400 font-light leading-relaxed pt-4">
              This page is provided for general informational purposes and does not constitute legal advice. We recommend it be reviewed by a qualified Nigerian legal professional before relying on it as a binding legal document.
            </p>
          `)}

        </div>
      </section>
    </div>
  `
};
