/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red:       '#DC2626',
          'red-dark':'#B91C1C',
          orange:    '#EA580C',
          'orange-light': '#FFF7ED',
          dark:      '#111827',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
