import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}', './brand/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          bg: 'var(--color-brand-bg)',
          fg: 'var(--color-brand-fg)',
          muted: 'var(--color-brand-muted)',
          border: 'var(--color-brand-border)',
          'border-strong': 'var(--color-brand-border-strong)',
          'orb-indigo': 'var(--color-brand-orb-indigo)',
          'orb-violet': 'var(--color-brand-orb-violet)',
          'orb-pink': 'var(--color-brand-orb-pink)',
        },
      },
      fontFamily: {
        'brand-sans': 'var(--font-brand-sans)',
        'brand-mono': 'var(--font-brand-mono)',
      },
      maxWidth: {
        shell: '1440px',
      },
    },
  },
  plugins: [],
} satisfies Config;
