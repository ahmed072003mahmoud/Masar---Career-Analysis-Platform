
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0A192F',
          light: '#64FFDA',
          accent: '#64FFDA',
          highlight: '#112240'
        },
        slate: {
          100: '#CCD6F6',
          200: '#A8B2D1',
          300: '#8892B0',
        },
        navy: {
          light: '#112240',
          lighter: '#233554',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Kufi Arabic', 'sans-serif'],
      },
      boxShadow: {
        'vivid': '0 10px 30px -15px rgba(2, 12, 27, 0.7)',
      }
    },
  },
  plugins: [],
}
