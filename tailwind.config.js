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
          DEFAULT: '#25927F',
          foreground: '#ffffff',
          dark: '#025E44',
          light: '#BDD962',
        },
        secondary: {
          DEFAULT: '#BDD962',
          foreground: '#0A0A0A',
        },
        muted: {
          DEFAULT: 'hsl(210, 15%, 93%)',
          foreground: 'hsl(215, 16%, 47%)',
        },
        border: 'hsl(214, 20%, 88%)',
        foreground: '#0A0A0A',
        background: 'hsl(0, 0%, 100%)',
        'color-1': 'hsl(170, 60%, 36%)',
        'color-2': 'hsl(75, 63%, 62%)',
        'color-3': 'hsl(167, 96%, 19%)',
        'color-4': 'hsl(152, 50%, 46%)',
        'color-5': 'hsl(0, 0%, 4%)',
        sidebar: {
          DEFAULT: 'hsl(167, 96%, 19%)',
          foreground: '#ffffff',
          accent: 'hsl(170, 60%, 36%)',
          border: 'hsl(167, 96%, 25%)',
        },
      },
      fontFamily: {
        display: ['Montserrat', 'sans-serif'],
        sans: ['Montserrat', 'sans-serif'],
        body: ['Montserrat', 'sans-serif'],
      },
    }
  }
}
