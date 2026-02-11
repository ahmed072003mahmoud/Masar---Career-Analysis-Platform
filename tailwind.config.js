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
          dark: '#020C1B',
          royal: '#2563EB',
          vibrant: '#F97316',
          purple: '#A855F7',
          accent: '#64FFDA',
        }
      },
      fontFamily: {
        sans: ['Alexandria', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        glow: {
          'from': { boxShadow: '0 0 10px -2px var(--accent)' },
          'to': { boxShadow: '0 0 25px 2px var(--accent)' },
        }
      }
    },
  },
  plugins: [],
}