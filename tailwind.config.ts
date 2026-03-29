import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#1F3E77',   // Institutional Blue — nav, headers
          secondary: '#2F6FED', // Insight Blue — buttons, links, chart lines
          bg: '#F5F7FA',        // Cloud Interface — page/card backgrounds
          accent: '#9EDC4B',    // Momentum Green — growth indicators, positive metrics
          text: '#2A2E35',      // Executive Graphite — titles, KPI numbers, body text
        },
        // Semantic aliases for common states
        surface: '#FFFFFF',
        muted: '#6B7280',
        error: '#DC2626',
        warning: '#D97706',
        success: '#16A34A',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px 0 rgba(0,0,0,0.1)',
      },
      borderRadius: {
        card: '12px',
      },
    },
  },
  plugins: [],
};

export default config;
