import React, { createContext, useContext, useEffect, useState } from 'react'
import tokens from '../design-tokens.json'

type ThemeName = 'dark' | 'light' | 'system'

interface ThemeContextType {
  theme: ThemeName
  setTheme: (t: ThemeName) => void
  tokens: any
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  setTheme: () => {},
  tokens,
})

export const useTheme = () => useContext(ThemeContext)

const getEffectiveTokens = (theme: ThemeName) => {
  if (theme === 'dark') return tokens
  // merge base tokens with light overrides
  const light = (tokens as any).light || {}
  return {
    ...tokens,
    ...light,
    colors: {
      ...(tokens as any).colors,
      ...(light.colors || {}),
    },
  }
}

const mapTokensToCSSVars = (toks: any) => ({
  '--surface': toks.colors.surface,
  '--surface-soft': toks.colors.surfaceSoft,
  '--border': toks.colors.border,
  '--shadow': toks.elevation?.shadowSoft || '0 30px 80px rgba(15,23,42,0.35)',
  '--accent': toks.colors.accent,
  '--accent-soft': toks.colors.accentSoft,
  '--glow': toks.colors.glow,
  '--text': toks.colors.text,
  '--muted': toks.colors.muted,
  '--bg': toks.colors.background,
  '--radius-sm': toks.radius.sm,
  '--radius-md': toks.radius.md,
  '--radius-lg': toks.radius.lg,
  '--motion-fast': toks.motion.fast,
  '--motion-base': toks.motion.base,
  '--motion-slow': toks.motion.slow,
  '--font-body': toks.font.body,
  '--font-display': toks.font.display,
})

const applyVars = (vars: Record<string, string>) => {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  Object.entries(vars).forEach(([k, v]) => {
    if (v !== undefined && v !== null) root.style.setProperty(k, String(v))
  })
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>('dark')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = window.localStorage.getItem('bb_theme') as ThemeName | null
    if (stored) setThemeState(stored)
    else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      setThemeState(prefersDark ? 'dark' : 'light')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const effective = getEffectiveTokens(theme as ThemeName)
    const vars = mapTokensToCSSVars(effective)
    applyVars(vars)
    try {
      window.localStorage.setItem('bb_theme', theme)
    } catch (e) {}
    if (typeof document !== 'undefined') {
      if (theme === 'dark') document.documentElement.classList.add('dark')
      else document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const setTheme = (t: ThemeName) => setThemeState(t)

  return <ThemeContext.Provider value={{ theme, setTheme, tokens }}>{children}</ThemeContext.Provider>
}
