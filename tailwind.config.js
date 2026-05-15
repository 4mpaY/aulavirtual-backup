/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,css}'],
  corePlugins: {
    preflight: false
  },
  important: '#__next',
  plugins: [require('tailwindcss-logical'), require('./src/@core/tailwind/plugin')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1177AB',
          foreground: '#ffffff',
          dark: '#0D3A52',
          light: '#88C7E6',
        },
        secondary: {
          DEFAULT: '#88C7E6',
          foreground: '#0D3A52',
        },
        muted: {
          DEFAULT: '#EBF5FB',
          foreground: '#4d6b7d',
        },
        border: 'hsl(200, 20%, 88%)',
        foreground: 'hsl(200, 82%, 15%)',
        background: 'hsl(0, 0%, 100%)',
        'terramett-navy': '#1177AB',
        'terramett-navy-light': '#2892C7',
        'terramett-cyan': '#88C7E6',
        'terramett-cyan-light': '#B8DEEF',
        // Keep original colors for compatibility if needed
        'original-primary': '#25927F',
        sidebar: {
          DEFAULT: 'hsl(167, 96%, 19%)',
          foreground: '#ffffff',
          accent: 'hsl(170, 60%, 36%)',
          border: 'hsl(167, 96%, 25%)',
        },
      },
      fontFamily: {
        display: ['Montserrat', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    }
  }
}
