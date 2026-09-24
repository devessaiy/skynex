// Tailwind CDN theme (shared by every page; must load right after the Tailwind CDN script)
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        skynex: {
          blue: '#1976D2',
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
