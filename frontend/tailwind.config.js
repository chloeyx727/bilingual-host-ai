/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef3ee',
          100: '#fde4d7',
          200: '#fac5ae',
          300: '#f69e7b',
          400: '#f17046',
          500: '#ee4d22',
          600: '#df3418',
          700: '#b92315',
          800: '#931e19',
          900: '#771c18',
        },
        grade: {
          S: '#f59e0b',
          A: '#10b981',
          B: '#3b82f6',
          C: '#f97316',
          D: '#ef4444',
        },
      },
    },
  },
  plugins: [],
}
