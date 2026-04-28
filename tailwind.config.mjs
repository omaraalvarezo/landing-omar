/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: 'var(--bg)',
          elev: 'var(--bg-elev)',
          soft: 'var(--bg-soft)',
        },
        border: {
          DEFAULT: 'var(--border)',
          hi: 'var(--border-hi)',
        },
        ink: {
          DEFAULT: 'var(--text)',
          mute: 'var(--text-mute)',
          dim: 'var(--text-dim)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          dim: 'var(--accent-dim)',
        },
      },
      fontFamily: {
        sans: ['"Geist Variable"', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono Variable"', 'ui-monospace', 'monospace'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
      fontSize: {
        'caption': ['13px', { lineHeight: '1.5' }],
        'mono-label': ['12px', { lineHeight: '1.5', letterSpacing: '0.1em' }],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.02em',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        '600': '600ms',
        '1200': '1200ms',
      },
      maxWidth: {
        container: '1280px',
      },
    },
  },
  plugins: [],
};
