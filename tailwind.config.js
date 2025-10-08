/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/renderer/**/*.{html,js}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#18181b',
        sidebar: '#27272a',
        accent: '#22d3ee',
        status: '#0ea5e9',
      },
    },
  },
  plugins: [],
}

