/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#050505',
          surface: '#0b0b0e',
          card: '#121217',
          cardHover: '#181822',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(255, 255, 255, 0.18)',
        },
        brand: {
          pink: '#FF4DA6',
          violet: '#A855F7',
          pinkGlow: 'rgba(255, 77, 166, 0.4)',
          violetGlow: 'rgba(168, 85, 247, 0.4)',
        },
        game: {
          truthOrDare: '#FF4DA6',
          neverHaveIEver: '#A855F7',
          wouldYouRather: '#06B6D4',
          hotTakes: '#F97316',
          dareRoulette: '#EF4444',
          redFlag: '#EF4444',
          greenFlag: '#10B981',
          truthOrSip: '#F59E0B',
          pointAndDrink: '#EC4899',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Cabinet Grotesk', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'neon-pink': '0 0 20px -3px rgba(255, 77, 166, 0.5), 0 0 8px -2px rgba(255, 77, 166, 0.3)',
        'neon-violet': '0 0 20px -3px rgba(168, 85, 247, 0.5), 0 0 8px -2px rgba(168, 85, 247, 0.3)',
        'neon-cyan': '0 0 20px -3px rgba(6, 182, 212, 0.5), 0 0 8px -2px rgba(6, 182, 212, 0.3)',
        'neon-amber': '0 0 20px -3px rgba(245, 158, 11, 0.5), 0 0 8px -2px rgba(245, 158, 11, 0.3)',
        'neon-red': '0 0 20px -3px rgba(239, 68, 68, 0.5), 0 0 8px -2px rgba(239, 68, 68, 0.3)',
        'neon-green': '0 0 20px -3px rgba(16, 185, 129, 0.5), 0 0 8px -2px rgba(16, 185, 129, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite alternate',
        'float-slow': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        glowPulse: {
          '0%': { filter: 'drop-shadow(0 0 10px rgba(255, 77, 166, 0.35)) drop-shadow(0 0 25px rgba(168, 85, 247, 0.25))' },
          '100%': { filter: 'drop-shadow(0 0 22px rgba(255, 77, 166, 0.6)) drop-shadow(0 0 45px rgba(168, 85, 247, 0.45))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
}
