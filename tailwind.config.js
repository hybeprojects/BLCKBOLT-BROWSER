/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/renderer/**/*.{html,js}',
    './renderer/**/*.{js,jsx,ts,tsx,html}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f0f0f',
        sidebar: '#1a1a1a',
        primary: '#6b21a8',
        accent: '#2563eb',
        bgDark: '#0f0f0f'
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif']
      },
    },
  },
  plugins: [],
}

