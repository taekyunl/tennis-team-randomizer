import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#0a0d0c',
        panel: '#121715',
        panelElevated: '#171d1b',
        ink: '#f4f2ea',
        muted: '#a6aaa4',
        line: 'rgba(214, 232, 173, 0.14)',
        accent: '#cfe96d',
        accentStrong: '#e6f47f',
        accentDeep: '#8ca53b',
      },
      fontFamily: {
        sans: ['"SUIT Variable"', '"Pretendard Variable"', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', '"Iowan Old Style"', 'serif'],
        mono: ['"JetBrains Mono"', '"SFMono-Regular"', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(207, 233, 109, 0.12), 0 20px 60px rgba(0, 0, 0, 0.35)',
        card: '0 18px 40px rgba(0, 0, 0, 0.28)',
      },
      backgroundImage: {
        texture:
          'radial-gradient(circle at top, rgba(207, 233, 109, 0.08), transparent 28%), radial-gradient(circle at bottom right, rgba(230, 244, 127, 0.06), transparent 24%)',
      },
    },
  },
  plugins: [],
} satisfies Config;
