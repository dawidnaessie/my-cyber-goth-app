/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        corporate: {
          navy: '#0a192f',
          darknavy: '#07101f',
          slate: '#0f172a',
          blue: '#0284c7',
          sky: '#0ea5e9',
          teal: '#0d9488',
          accent: '#0284c7',
          border: '#e2e8f0',
          darkborder: '#1e293b',
          lightbg: '#f8fafc',
          card: '#ffffff',
          darkcard: '#111827',
        },
        cyber: {
          bg: '#050505',
          dark: '#0a0a0f',
          panel: '#0d0d14',
          border: 'rgba(0, 255, 204, 0.25)',
          teal: '#00ffcc',
          crimson: '#ff0055',
          violet: '#9d00ff',
          dim: '#4b5563',
          muted: '#1e293b'
        },
        gothic: {
          bg: '#070707',
          panel: '#0d0b09',
          surface: '#13100e',
          bone: '#cfc4b2',
          parchment: '#bfae95',
          blood: '#781414',
          crimson: '#9e1c1c',
          rust: '#8c6136',
          patina: '#3c5249',
          amber: '#b58b45',
          dim: '#544c42',
          border: 'rgba(140, 97, 54, 0.3)'
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Courier New"',
          'monospace',
        ],
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flicker': 'flicker 0.15s infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.94 },
        }
      }
    },
  },
  plugins: [],
};
