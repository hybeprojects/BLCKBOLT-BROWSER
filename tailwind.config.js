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
        background: '#0b0d12',
        surface: '#111827',
        surface2: '#161b2a',
        panel: '#1f2937',
        accent: '#7c3aed',
        accentSoft: '#8b5cf6',
        glow: '#38bdf8',
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
        bgDark: '#05070d',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 80px rgba(15, 23, 42, 0.35)',
      },
      backgroundImage: {
        'hero-glow': 'radial-gradient(circle at top left, rgba(124,58,237,0.22), transparent 30%), radial-gradient(circle at bottom right, rgba(56,189,248,0.15), transparent 25%)',
      },
    },
  },
  plugins: [],
}

