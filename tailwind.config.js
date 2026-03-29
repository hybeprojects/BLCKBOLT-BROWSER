/** @type {import('tailwindcss').Config} */
const tokens = require('./renderer/design-tokens.json')

module.exports = {
  darkMode: 'class',
  content: [
    './src/renderer/**/*.{html,js}',
    './renderer/**/*.{js,jsx,ts,tsx,html}',
  ],
  theme: {
    extend: {
      colors: {
        background: tokens.colors.background,
        surface: tokens.colors.surface,
        surface2: tokens.colors.surfaceSoft,
        panel: '#1f2937',
        accent: tokens.colors.accent,
        accentSoft: tokens.colors.accentSoft,
        glow: tokens.colors.glow,
        success: tokens.colors.success,
        warning: tokens.colors.warning,
        error: tokens.colors.error,
        bgDark: tokens.colors.background,
      },
      spacing: {
        xs: tokens.spacing.xs,
        sm: tokens.spacing.sm,
        md: tokens.spacing.md,
        lg: tokens.spacing.lg,
        xl: tokens.spacing.xl,
      },
      borderRadius: {
        sm: tokens.radius.sm,
        md: tokens.radius.md,
        lg: tokens.radius.lg,
        pill: tokens.radius.pill,
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: tokens.elevation.shadowSoft,
      },
      backgroundImage: {
        'hero-glow': 'radial-gradient(circle at top left, rgba(124,58,237,0.22), transparent 30%), radial-gradient(circle at bottom right, rgba(56,189,248,0.15), transparent 25%)',
      },
    },
  },
  plugins: [],
}

