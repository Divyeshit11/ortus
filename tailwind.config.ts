import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#FFFFFF',
          text: '#1A1A1A',
          accent: '#000000',
          'accent-light': '#F5F5F5',
          border: '#E5E5E5',
          muted: '#666666',
          surface: '#FAFAFA',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      borderRadius: {
        brand: '999px',
      },
      boxShadow: {
        soft: '0 4px 24px -4px rgba(0, 0, 0, 0.08)',
        card: '0 8px 32px -8px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
