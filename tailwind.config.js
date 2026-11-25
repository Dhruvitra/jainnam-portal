/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FDF9F0',
          100: '#F4E7C8', // Light Gold
          200: '#E8D19A',
          300: '#DDBB6F',
          400: '#D4A84E',
          500: '#C99532', // Primary Gold
          600: '#A87922', // Dark Gold
          700: '#875F18',
          800: '#67460F',
          900: '#482F08',
        },
        charcoal: {
          50: '#F7F7F7',
          100: '#EDEDED',
          200: '#D9D9D9',
          300: '#B8B8B8',
          400: '#8A8A8A',
          500: '#5C5C5C',
          600: '#424242',
          700: '#333333', // Dark Text
          800: '#292929', // Main Charcoal
          900: '#1C1C1C',
        },
        warm: '#FAF9F6',
        borderLight: '#EAE6DE',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(41, 41, 41, 0.04)',
        'subtle': '0 1px 3px 0 rgba(41, 41, 41, 0.05)',
        'card': '0 2px 6px 0 rgba(41, 41, 41, 0.06), 0 1px 2px -1px rgba(41, 41, 41, 0.04)',
        'card-hover': '0 6px 14px -2px rgba(41, 41, 41, 0.08), 0 2px 4px -2px rgba(41, 41, 41, 0.04)',
        'modal': '0 20px 25px -5px rgba(41, 41, 41, 0.12), 0 8px 10px -6px rgba(41, 41, 41, 0.08)'
      }
    },
  },
  plugins: [],
}
