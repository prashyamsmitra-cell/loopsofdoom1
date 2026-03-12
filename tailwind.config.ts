import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#E50914',
          dark: '#111111',
          card: '#1A1A1A',
          card2: '#222222',
          mid: '#2D2D2D',
          lgray: '#B3B3B3',
          dgray: '#555555',
          gold: '#F5C518',
          cyan: '#7EC8E3',
          green: '#A8D5A2',
          purple: '#C9A8E3',
          orange: '#F4A261',
        }
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        pixel: ['"Press Start 2P"', 'monospace'],
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'blink': 'blink 500ms step-end infinite',
        'ticker': 'ticker 30s linear infinite',
        'bar1': 'bar 600ms ease-in-out infinite',
        'bar2': 'bar 500ms ease-in-out infinite 100ms',
        'bar3': 'bar 700ms ease-in-out infinite 200ms',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-33.333%)' },
        },
        bar: {
          '0%, 100%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
