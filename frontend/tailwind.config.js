/** @type {import('tailwindcss').Config} — Legal Luxury (Phases A-D unified) */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Phase A-C palette
        navy: { DEFAULT: '#0A0E17', 900: '#080B12', 800: '#0E1421', 700: '#111726', 600: '#161d30', 500: '#1c243b' },
        // Phase D palette (Legal Luxury)
        surface: { DEFAULT: '#121414', 900: '#0C0E0E', 800: '#161919', 700: '#1B1F1F', 600: '#232727' },
        card: '#1A1C1C',
        gold: { DEFAULT: '#C9A24B', light: '#E3C57E', dark: '#A5822F' },
        ink: { DEFAULT: '#FFFFFF', muted: '#A8AEAE', faint: '#6B7070' },
        ok: '#3FB984', warn: '#E0A93B', danger: '#E05B5B',
        risk: { critical: '#E05B5B', warning: '#E0A93B', suggested: '#C9A24B', safe: '#3FB984' },
      },
      fontFamily: {
        sans: ['Inter', '"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        arabic: ['Cairo', '"IBM Plex Sans Arabic"', 'Tajawal', 'sans-serif'],
        serif: ['"Playfair Display"', '"IBM Plex Serif"', 'Georgia', 'serif'],
      },
      borderRadius: { DEFAULT: '8px', lg: '8px', xl: '12px', '2xl': '16px' },
      boxShadow: {
        // Phase A-C
        gold: '0 0 40px -8px rgba(201,162,75,0.35)',
        'gold-lg': '0 0 70px -6px rgba(201,162,75,0.5)',
        card: '0 20px 60px -20px rgba(0,0,0,0.6)',
        // Phase D
        glass: '0 8px 32px -8px rgba(0,0,0,0.55)',
        'ai-glow': '0 0 60px -6px rgba(201,162,75,0.55)',
      },
      backgroundImage: {
        'gold-radial': 'radial-gradient(circle at 50% 0%, rgba(201,162,75,0.12), transparent 55%)',
        'gold-line': 'linear-gradient(90deg, transparent, #C9A24B, transparent)',
        'ai-spot': 'radial-gradient(circle at 50% 40%, rgba(201,162,75,0.18), transparent 60%)',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(14px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'spotlight': { '0%,100%': { opacity: '0.35' }, '50%': { opacity: '0.7' } },
        'pulse-ring': { '0%': { transform: 'scale(0.9)', opacity: '0.7' }, '70%,100%': { transform: 'scale(1.7)', opacity: '0' } },
        // Phase D AI animations
        'pulse-ai': { '0%,100%': { transform: 'scale(1)', opacity: '0.9' }, '50%': { transform: 'scale(1.08)', opacity: '1' } },
        'spin-slow': { to: { transform: 'rotate(360deg)' } },
        'ring-pulse': { '0%': { transform: 'scale(0.8)', opacity: '0.7' }, '100%': { transform: 'scale(1.9)', opacity: '0' } },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'spotlight': 'spotlight 3s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2s ease-out infinite',
        // Phase D
        'pulse-ai': 'pulse-ai 2.2s ease-in-out infinite',
        'spin-slow': 'spin-slow 14s linear infinite',
        'ring-pulse': 'ring-pulse 2.4s ease-out infinite',
      },
    },
  },
  plugins: [],
};
