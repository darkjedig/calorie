import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'waggel-blue': '#56EBFF',
        'sailor-gold': '#FEE040',
        'nacho-orange': '#FBBC43',
        'glam-pink': '#E95F94',
        'cold-storm': '#C1D8EE',
        'first-frost': '#EEF7FD',
      },
    },
  },
  plugins: [],
} satisfies Config