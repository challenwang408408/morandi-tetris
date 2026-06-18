/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        morandi: {
          sand: '#E6E0D5',
          paper: '#EFEAE2',
          stone: '#D2CCC0',
          fog: '#C4BDB0',
          taupe: '#A89F90',
          moss: '#9AA897',
          clay: '#C2A28E',
          dusk: '#8A8B96',
          ink: '#5A544A',
          shadow: '#9C958A',
          dark: '#2F2C28',
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'ui-monospace', 'monospace'],
        terminal: ['"VT323"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
