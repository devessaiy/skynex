// ==========================================
// 1. CONFIGURATION & SHARED DATA
// ==========================================
const AppConfig = {
  // Supabase project config for the Staff Portal + live Contact form.
  // These two values are PUBLIC by design (same as any Supabase browser client) -- they are
  // not secrets and are safe to ship in client-side code. All real authorization is enforced
  // server-side by Postgres Row Level Security policies, never by hiding these values.
  // The Supabase service-role key must NEVER appear anywhere in this codebase.
  supabase: {
    url: 'https://iyvuickcneepmbugnyex.supabase.co',
    publishableKey: 'sb_publishable_3Nxr3PlnfKQcoUyTWiMULw_HuKAEaz5'
  },
  company: {
    // Social profile URLs. '#' placeholders until the real pages exist (replace each with the full https:// URL).
    social: { linkedin: '#', x: '#', instagram: '#' },
    name: 'Skynex Solutions Limited',
    rc: '9757226',
    email: 'skynexsolutionslimited@gmail.com',
    address: 'KS Pawa Plaza,<br>Shuaibu Dagaci St.,<br>Suleja, Niger State,<br>Nigeria.',
    year: new Date().getFullYear(),
    whatsappUrl: 'https://wa.me/2348121219528?text=Hi%2C%20I%20am%20reaching%20out%20from%20your%20website%20to%20make%20an%20enquiry.%20I%20would%20like%20to%20know%20more%20about%20your%20services%2C%20products%2C%20or%20how%20we%20can work%20together.'
  },
  navLinks: [
    { href: '/', label: 'Home', mobileOnly: true },          // the logo already links home on desktop
    { href: '/services', label: 'Capabilities' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/#trideta', label: 'Trideta' },
    { href: '/team', label: 'Leadership' },
    { href: '/news', label: 'News' },
    { href: '/careers', label: 'Careers' },
    { href: '/contact', label: 'Contact', mobileOnly: true } // desktop has the "Engage" button for this
  ],
  // MERGED service list (existing site + the services named in the brief). Wording for the three newest
  // entries (Web Development, Analytics & Reporting, Digital Marketing) is a draft for management to review.
  servicesPage: [
    {
      category: 'Software & Digital',
      items: [
        { title: 'Web Development', desc: 'Design and development of websites and web applications, from corporate sites to custom platforms, built to be fast, secure and easy to maintain.' },
        { title: 'Custom Software & App Development', desc: 'Design and development of bespoke web platforms and native mobile applications. We build highly performant, secure, and scalable architectures tailored to specific business logic and user needs.' },
        { title: 'Cloud & Data Processing', desc: 'Provision of resilient cloud infrastructure services, complex data processing solutions, and enterprise digital transformation strategies to ensure high availability and data integrity.' },
        { title: 'Analytics & Reporting', desc: 'Collection and analysis of business and website data, presented as clear reports and dashboards that support better decisions.' },
        { title: 'Proprietary Software R&D', desc: 'Dedicated research and development of proprietary software products, with a specialized focus on crime reporting systems, security applications, and intellectual property commercialization.' },
        { title: 'IT Consultancy', desc: 'High-level technological advisory serving corporate and individual clients. We align IT investments with overarching business objectives to maximize operational efficiency.' }
      ]
    },
    {
      category: 'Systems & Hardware',
      items: [
        { title: 'System Integration', desc: 'Architecting and integrating disparate computing systems and software applications to function together seamlessly as a coordinated, unified whole within an enterprise environment.' },
        { title: 'ICT & Office Equipment Supply', desc: 'Procurement, supply, and maintenance of premium ICT equipment, commercial-grade computers, networking devices, peripherals, and modern office furniture.' },
        { title: 'Tech Support & Training', desc: 'Comprehensive technical support, system maintenance for digital platforms, and specialized IT training to empower your workforce and ensure continuous operational continuity.' }
      ]
    },
    {
      category: 'Creative & Marketing',
      items: [
        { title: 'Digital Marketing', desc: 'Planning and delivery of digital marketing campaigns, social media content and online presence management that help organisations reach and engage their audiences.' },
        { title: 'Branding & Creative Services', desc: 'Strategic brand identity development, high-end graphics design, visual communication, digital content creation, and professional multimedia production to elevate corporate presence.' },
        { title: 'Commercial Printing', desc: 'Execution of commercial and digital printing services, large-format corporate branding, specialized publishing, and professional document production services.' }
      ]
    }
  ]
};

// Footer link groups (Capabilities / Products / Company / Support).
// Rendered by UI.FooterColumn. Add or edit links here, not in the footer markup.
//   accent -> highlighted brand-blue link     icon -> small "external" arrow after the label
//   newTab -> opens in a new tab
AppConfig.footerColumns = [
  {
    title: 'Capabilities',
    links: [
      { href: '/services#web-development', label: 'Web Development' },
      { href: '/services#custom-software-and-app-development', label: 'Software & Apps' },
      { href: '/services#cloud-and-data-processing', label: 'Cloud & Data' },
      { href: '/services#digital-marketing', label: 'Digital Marketing' },
      { href: '/services#branding-and-creative-services', label: 'Branding & Creative' },
      { href: '/services#ict-and-office-equipment-supply', label: 'ICT & Office Equipment' }
    ]
  },
  {
    title: 'Products',
    links: [
      { href: 'https://trideta.skynex.com.ng', label: 'Trideta (Active)', accent: true }
    ]
  },
  {
    title: 'Company',
    links: [
      { href: '/team', label: 'Leadership Team' },
      { href: '/portfolio', label: 'Portfolio' },
      { href: '/contact', label: 'Contact Us' },
      { href: '/search', label: 'Search' },
      { href: '/careers', label: 'Careers', icon: true },
      { href: '/news', label: 'News', icon: true }
    ]
  },
  {
    title: 'Support',
    links: [
      { href: AppConfig.company.whatsappUrl, label: 'WhatsApp', newTab: true },
      { href: `mailto:${AppConfig.company.email}`, label: 'Email Support' },
      { href: '/staff/login', label: 'Staff Login' }
    ]
  }
];
