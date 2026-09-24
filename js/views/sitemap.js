// ==========================================
// SCREEN: SITEMAP  #sitemap
// ==========================================
// Lists only pages that actually exist on this site, plus the Trideta product (a real,
// separately-hosted destination linked from the Home screen), and support channels that exist
// today (WhatsApp / email) rather than a dedicated "Support" page, since none exists yet.
Views.Sitemap = {
  render: () => /*html*/`
    <div id="view-sitemap" class="spa-view bg-white">
      <section class="pt-24 pb-20 border-b border-skynex-border bg-skynex-gray">
        <div class="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
          <h1 class="text-5xl md:text-7xl font-bold text-skynex-dark tracking-tighter mb-6">Sitemap</h1>
          <p class="text-lg text-slate-500 font-light max-w-3xl">
            An overview of the pages and destinations available on this website.
          </p>
        </div>
      </section>

      <section class="py-24">
        <div class="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16">

            ${UI.SitemapColumn({
              title: 'Company',
              links: [
                { href: '/', label: 'Home', desc: 'Overview of Skynex Solutions and our Trideta product.' },
                { href: '/services', label: 'Capabilities', desc: 'Our software, cloud, systems, and creative services.' },
                { href: '/team', label: 'Leadership', desc: 'Our founding leadership team.' },
                { href: '/news', label: 'News & Updates', desc: 'Company news and announcements.' },
                { href: '/careers', label: 'Careers', desc: 'Opportunities to work with us.' }
              ]
            })}

            ${UI.SitemapColumn({
              title: 'Products',
              links: [
                { href: 'https://trideta.skynex.com.ng', label: 'Trideta', newTab: true, desc: 'Our proprietary product platform, hosted separately.' }
              ]
            })}

            ${UI.SitemapColumn({
              title: 'Get in Touch',
              links: [
                { href: '/contact', label: 'Contact', desc: 'Send us an enquiry or find our corporate address.' },
                { href: `mailto:${AppConfig.company.email}`, label: 'Email Support' },
                { href: AppConfig.company.whatsappUrl, label: 'WhatsApp', newTab: true }
              ]
            })}

            ${UI.SitemapColumn({
              title: 'Legal',
              links: [
                { href: '/privacy-policy', label: 'Privacy Policy' },
                { href: '/terms-of-service', label: 'Terms of Service' },
                { href: '/legal', label: 'Legal Information' },
                { href: '/sitemap', label: 'Sitemap' }
              ]
            })}

          </div>
        </div>
      </section>
    </div>
  `
};
