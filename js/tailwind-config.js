// Tailwind CDN theme (shared by every page; must load right after the Tailwind CDN script)
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        skynex: {
          blue: '#1976D2',        // brand blue for BACKGROUNDS and large accents
          bluetext: '#1565C0',    // brand blue for TEXT on light surfaces (5.3:1 or better)
          bluelight: '#6cb2f5',   // brand blue for TEXT on dark surfaces (7:1 or better)
          teal: '#26A69A',
          dark: '#050505',     // True premium black
          gray: '#f5f5f7',     // Apple/Samsung style surface gray
          border: '#e5e5e5'    // Crisp, subtle structural border
        }
      },
      letterSpacing: {
        tightest: '-.04em',
        tighter: '-.02em',
      }
    }
  }
}
