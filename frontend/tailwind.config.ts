import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pine: {
          50: '#edf7f2',
          100: '#d7ede2',
          200: '#b2dbc6',
          300: '#84c2a4',
          400: '#52b788',
          500: '#40916c',
          600: '#2d6a4f',
          700: '#1b4332',
          800: '#133024',
          900: '#0b1d16',
          950: '#050f0b',
        },
        civic: {
          light: '#f9f8f5',
          card: '#ffffff',
          dark: '#0c1612',
          darkCard: '#13211b',
          darkBorder: '#1c3329',
        },
        risk: {
          low: '#15803d',
          medium: '#b45309',
          high: '#b91c1c',
        }
      },
      fontFamily: {
        bengali: ['"Noto Sans Bengali"', 'system-ui', 'sans-serif'],
        sans: ['"Noto Sans Bengali"', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
