/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#0A0E17', 900: '#080B12', 800: '#0E1421', 700: '#111726', 600: '#161d30', 500: '#1c243b' },
        gold: { DEFAULT: '#C9A24B', light: '#E3C57E', dark: '#A5822F' },
        ink: { DEFAULT: '#EDEDED', muted: '#9AA3B2', faint: '#5C6579' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['Cairo', 'Tajawal', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        gold: '0 0 40px -8px rgba(201,162,75,0.35)',
        'gold-lg': '0 0 70px -6px rgba(201,162,75,0.5)',
        card: '0 20px 60px -20px rgba(0,0,0,0.6)',
      },
      backgroundImage: {
        'gold-radial': 'radial-gradient(circle at 50% 0%, rgba(201,162,75,0.14), transparent 55%)',
        'gold-line': 'linear-gradient(90deg, transparent, #C9A24B, transparent)',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'spotlight': { '0%,100%': { opacity: '0.35' }, '50%': { opacity: '0.7' } },
        'pulse-ring': { '0%': { transform: 'scale(0.9)', opacity: '0.7' }, '70%,100%': { transform: 'scale(1.7)', opacity: '0' } },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'spotlight': 'spotlight 3s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2s ease-out infinite',
      },
    },
  },
  plugins: [],
};
