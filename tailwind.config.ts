import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: 'var(--brand)',
          dark: 'var(--brand-dark)',
          soft: 'var(--brand-soft)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          soft: 'var(--accent-soft)',
        },
        textColor: {
          main: 'var(--text)',
          muted: 'var(--text-muted)',
        },
        surface: 'var(--surface)',
        bgMain: 'var(--bg)',
        borderMain: 'var(--border)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
      },
    },
  },
  plugins: [],
} satisfies Config;
