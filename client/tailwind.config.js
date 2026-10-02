/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#060e1a',
          800: '#0c1b33',
          700: '#15294a',
          600: '#1e3866'
        },
        signal: {
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8'
        },
        fog: {
          100: '#f1f5f9',
          200: '#e8eef8',
          300: '#cbd5e1'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif']
      }
    },
  },
  plugins: [],
}
