// ==========================================
// SCREEN: HOME (landing page)  #home
// ==========================================
Views.Home = {
  render: () => /*html*/`
    <div id="view-home" class="spa-view active">
      <section class="relative pt-24 pb-32 md:pt-40 md:pb-48 bg-white flex items-center">
        <div class="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 w-full text-center">
          <h1 class="text-5xl md:text-7xl lg:text-[7rem] font-bold text-skynex-dark leading-[1.05] tracking-tighter mb-8 max-w-6xl mx-auto">
            Engineering the future <br class="hidden md:block" /> of digital business.
          </h1>
          <p class="text-xl md:text-2xl text-slate-500 font-light max-w-3xl mx-auto leading-relaxed mb-12">
            Premium software development, sophisticated cloud infrastructure, and proprietary digital ecosystems for forward-thinking enterprises.
          </p>
          <a href="/services" class="inline-flex items-center justify-center px-8 py-4 rounded-full bg-skynex-dark text-white font-medium text-sm tracking-widest uppercase hover:bg-skynex-blue transition-colors duration-300">
            Discover our expertise
          </a>
        </div>
      </section>

      <section class="py-24 md:py-32 bg-skynex-gray">
        <div class="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div>
              <span class="inline-block py-1 px-3 rounded-full border border-skynex-blue text-skynex-blue text-[10px] font-bold uppercase tracking-widest mb-6">Current Flagship</span>
              <h2 class="text-4xl md:text-6xl font-bold tracking-tight text-skynex-dark mb-6">TRIDETA.</h2>
              <p class="text-2xl font-light text-skynex-dark mb-6 leading-snug">The comprehensive, multi-tenancy school management platform.</p>
              <p class="text-lg text-slate-500 font-light leading-relaxed mb-10">A school management platform built for Nursery, Primary and Secondary levels handling students, results and day-to-day administration in one place.</p>
              <div class="flex items-center gap-6">
                <button class="px-8 py-4 rounded-full bg-white text-skynex-dark font-medium border border-skynex-border hover:border-skynex-dark transition-colors">Explore Trideta</button>
                <span class="text-sm font-semibold tracking-widest uppercase text-skynex-blue">Live Platform</span>
              </div>
            </div>
            
            <div id="trideta-video-container" class="relative w-full aspect-[4/3] bg-[#0a0f1a] rounded-2xl overflow-hidden shadow-2xl shadow-slate-200/50 group">
              <video id="trideta-video" class="absolute inset-0 w-full h-full object-cover" muted playsinline loop preload="none" poster="assets/tridetaintro.png">
                <source data-src="assets/tridetaintro.webm" type="video/webm">
                Your browser does not support the video tag.
              </video>
              <button id="mobile-sound-toggle" class="md:hidden absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white w-10 h-10 rounded-full flex items-center justify-center border border-white/20 z-10 transition-transform active:scale-95">
                <i class="fa-solid fa-volume-xmark text-sm" id="sound-icon"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section class="py-32 bg-skynex-dark text-white relative overflow-hidden">
        <div class="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
          <img src="skynex-offline.svg" alt="" class="w-[800px] h-auto" onerror="this.style.display='none'">
        </div>
        <div class="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 relative z-10 text-center">
          <h2 class="text-4xl md:text-6xl font-bold tracking-tight mb-8">Pioneering what's next.</h2>
          <p class="text-xl md:text-2xl text-slate-400 font-light max-w-3xl mx-auto leading-relaxed mb-12">
            While Trideta drives our current ecosystem, our R&D division is actively engineering proprietary software for security, advanced data processing, and integrated enterprise solutions.
          </p>
          <div class="inline-flex items-center justify-center gap-3 text-white font-medium tracking-widest uppercase text-sm border border-white/20 px-8 py-4 rounded-full">
            <i class="fa-solid fa-lock text-xs"></i> More Products Coming Soon
          </div>
        </div>
      </section>

      <section class="py-24 md:py-32 bg-white">
        <div class="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
          <div class="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24 gap-8">
            <div>
              <h2 class="text-4xl md:text-5xl font-bold tracking-tight text-skynex-dark mb-4">Core Capabilities</h2>
              <p class="text-xl text-slate-500 font-light max-w-2xl">Precision engineering across software, infrastructure, and brand identity.</p>
            </div>
            <a href="/services" class="text-sm font-bold uppercase tracking-widest text-skynex-dark border-b border-skynex-dark pb-1 hover:text-skynex-blue hover:border-skynex-blue transition-colors">
              View All Services
            </a>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16 border-t border-skynex-border pt-16">
            <div>
              <p class="text-skynex-blue font-bold tracking-widest text-xs mb-4">01</p>
              <h3 class="text-2xl font-bold text-skynex-dark mb-4">Software & Cloud Engineering</h3>
              <p class="text-slate-500 font-light leading-relaxed">End-to-end development of robust web/mobile applications and scalable cloud infrastructure tailored for high-availability enterprise environments.</p>
            </div>
            <div>
              <p class="text-skynex-blue font-bold tracking-widest text-xs mb-4">02</p>
              <h3 class="text-2xl font-bold text-skynex-dark mb-4">System Integration & Hardware</h3>
              <p class="text-slate-500 font-light leading-relaxed">Seamless integration of complex IT systems, coupled with the procurement, deployment, and maintenance of premium networking and hardware devices.</p>
            </div>
            <div>
              <p class="text-skynex-blue font-bold tracking-widest text-xs mb-4">03</p>
              <h3 class="text-2xl font-bold text-skynex-dark mb-4">Creative & Brand Identity</h3>
              <p class="text-slate-500 font-light leading-relaxed">Strategic visual communication, comprehensive brand identity creation, and professional multimedia production to establish definitive market presence.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,

  // Wires up the Trideta intro video (see js/features/trideta-video.js)
  mount: () => TridetaVideo.init()
};
