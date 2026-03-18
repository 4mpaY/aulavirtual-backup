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
          DEFAULT: '#02115C',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#E2231A',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#f2f2f2',
          foreground: '#4d4d4d',
        },
        border: 'hsl(0, 0%, 88%)',
        foreground: 'hsl(0, 0%, 20%)',
        background: 'hsl(0, 0%, 100%)',
      },
      fontFamily: {
        display: ['Montserrat', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
    }
  }
}
