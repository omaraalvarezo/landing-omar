/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: 'var(--bg)',
          soft: 'var(--bg-soft)',
        },
        ink: {
          DEFAULT: 'var(--ink)',
          soft: 'var(--ink-soft)',
          mute: 'var(--mute)',
        },
        line: {
          DEFAULT: 'var(--line)',
          hi: 'var(--line-hi)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          soft: 'var(--accent-soft)',
        },
        positive: 'var(--positive)',
        negative: 'var(--negative)',
      },
      fontFamily: {
        sans: ['"Geist Variable"', '-apple-system', 'BlinkMacSystemFont', '"Helvetica Neue"', 'sans-serif'],
        mono: ['"Geist Mono Variable"', 'ui-monospace', 'Menlo', 'monospace'],
        serif: ['"Instrument Serif"', 'Georgia', '"Times New Roman"', 'serif'],
      },
      fontSize: {
        'caption': ['13px', { lineHeight: '1.5' }],
        'mono-label': ['11px', { lineHeight: '1.5', letterSpacing: '0.18em' }],
        'meta': ['11px', { lineHeight: '1.5', letterSpacing: '0.04em' }],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.025em',
        tight2: '-0.02em',
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
