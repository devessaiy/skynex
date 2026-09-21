// ==========================================
// 1. CONFIGURATION & SHARED DATA
// ==========================================
const AppConfig = {
  company: {
    name: 'Skynex Solutions Limited',
    rc: '9757226',
    email: 'skynexsolutionslimited@gmail.com',
    address: 'KS Pawa Plaza,<br>Shuaibu Dagaci St.,<br>Suleja, Niger State,<br>Nigeria.',
    year: new Date().getFullYear(),
    whatsappUrl: 'https://wa.me/2348121219528?text=Hi%2C%20I%20am%20reaching%20out%20from%20your%20website%20to%20make%20an%20enquiry.%20I%20would%20like%20to%20know%20more%20about%20your%20services%2C%20products%2C%20or%20how%20we%20can work%20together.'
  },
  navLinks: [
    { href: '#home', label: 'Home' },
    { href: '#services', label: 'Capabilities' },
    { href: '#team', label: 'Leadership' },
    { href: '#contact', label: 'Contact' }
  ],
  teamMembers: [
    {
      name: 'Alhassan Bashir',
      role: 'CEO & Co-Founder',
      initials: 'AB',
      description: 'Guiding corporate strategy, operational execution, and business development. Alhassan ensures that Skynex\'s technological capabilities are perfectly aligned with market demands, enterprise integrations, and overarching business objectives.',
      linkedin: '#'
    },
    {
      name: 'Ibrahim Hanif Shuaibu',
      role: 'CTO & Co-Founder',
      initials: 'IHS',
      description: 'Leading the technological vision and engineering architecture of Skynex Solutions. Ibrahim oversees the development of flagship products like Trideta, driving innovation across software engineering, cloud deployments, and proprietary security research.',
      linkedin: 'https://www.linkedin.com/in/ibrahim-shuaibu-257921379?utm_source=share_via&utm_content=profile&utm_medium=member_android'
    }
  ],
  servicesPage: [
    {
      category: 'Software & Infrastructure',
      items: [
        { title: 'Software Development', desc: 'Design and development of bespoke web platforms and native mobile applications. We build highly performant, secure, and scalable architectures tailored to specific business logic and user needs.' },
        { title: 'Cloud & Data Processing', desc: 'Provision of resilient cloud infrastructure services, complex data processing solutions, and enterprise digital transformation strategies to ensure high availability and data integrity.' },
        { title: 'Proprietary Software R&D', desc: 'Dedicated research and development of proprietary software products, with a specialized focus on crime reporting systems, security applications, and intellectual property commercialization.' },
        { title: 'IT Consultancy', desc: 'High-level technological advisory serving corporate and individual clients. We align IT investments with overarching business objectives to maximize operational efficiency.' }
      ]
    },
    {
      category: 'Systems & Hardware',
      items: [
        { title: 'System Integration', desc: 'Architecting and integrating disparate computing systems and software applications to function together seamlessly as a coordinated, unified whole within an enterprise environment.' },
        { title: 'ICT Equipment Supply', desc: 'Procurement, supply, and maintenance of premium ICT equipment, commercial-grade computers, networking devices, peripherals, and modern office furniture.' },
        { title: 'Tech Support & Training', desc: 'Comprehensive technical support, system maintenance for digital platforms, and specialized IT training to empower your workforce and ensure continuous operational continuity.' }
      ]
    },
    {
      category: 'Creative & Media',
      items: [
        { title: 'Creative Services & Branding', desc: 'Strategic brand identity development, high-end graphics design, visual communication, digital content creation, and professional multimedia production to elevate corporate presence.' },
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
      { href: '#services', label: 'Software Development' },
      { href: '#services', label: 'Cloud Infrastructure' },
      { href: '#services', label: 'System Integration' },
      { href: '#services', label: 'Creative & Branding' },
      { href: '#services', label: 'ICT Procurement' }
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
      { href: '#team', label: 'Leadership Team' },
      { href: '#contact', label: 'Contact Us' },
      { href: '#careers', label: 'Careers', icon: true },
      { href: '#news', label: 'News', icon: true }
    ]
  },
  {
    title: 'Support',
    links: [
      { href: AppConfig.company.whatsappUrl, label: 'WhatsApp', newTab: true },
      { href: `mailto:${AppConfig.company.email}`, label: 'Email Support' }
    ]
  }
];
