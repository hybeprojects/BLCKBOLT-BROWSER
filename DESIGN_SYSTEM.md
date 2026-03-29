# BLCKBOLT Browser - Design System & Developer Guide

## Overview

BLCKBOLT is a 2026-grade privacy-first browser built with modern UI/UX principles. This guide documents the design tokens, component patterns, accessibility standards, and performance best practices.

## 1. Design Tokens

### Colors

All colors are centralized in `design-tokens.json` and exposed as CSS variables through the `ThemeProvider`:

```
--bg: #05070d                 /* Main background */
--surface: #111827            /* Card/panel background */
--surface-soft: #161b2a       /* Secondary surface */
--border: rgba(148,163,184,0.16)
--accent: #7c3aed             /* Primary action color */
--accent-soft: #8b5cf6        /* Hover/soft accent */
--glow: #38bdf8               /* Accent glow/highlight */
--text: #f8fafc               /* Primary text */
--muted: #94a3b8              /* Muted text */
--shadow: 0 30px 80px rgba(15,23,42,0.35)
```

### Spacing Scale

Based on 4px baseline:

- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px

### Motion

Fast, delightful animations optimized for 2026 UX:

- `fast`: 120ms (micro-interactions, state changes)
- `base`: 200ms (standard transitions)
- `slow`: 320ms (entrance/exit, full page transitions)

Use `prefer-reduced-motion` for accessibility:

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
```

### Radius

Soft, modern corners throughout:

- `sm`: 6px (small controls)
- `md`: 12px (buttons, inputs)
- `lg`: 16px (modals, panels)
- `pill`: 9999px (badges, toggles)

## 2. Component Patterns

### Glass Panel Utility

Used for card/panel backgrounds with glassmorphic effect:

```html
<div class="glass-panel rounded-3xl border border-white/10 p-6 shadow-soft">
  Content
</div>
```

### Button Hierarchy

**Primary (Action)**
```tsx
<button className="rounded-2xl bg-accent px-6 py-2 text-slate-950 font-semibold hover:bg-accentSoft transition">
  Action
</button>
```

**Secondary (Interactive)**
```tsx
<button className="rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-2 text-slate-200 hover:bg-slate-800 transition">
  Secondary
</button>
```

**Tertiary (Low Emphasis)**
```tsx
<button className="text-sm text-slate-400 hover:text-slate-200 transition">
  Tertiary
</button>
```

### Input Fields

```tsx
<input
  className="rounded-2xl bg-slate-900 border border-white/10 px-4 py-2 text-slate-100 focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition"
/>
```

### Toggle / Switch

```tsx
<button
  className={`rounded-full p-1 transition ${enabled ? 'bg-accent text-slate-950' : 'bg-slate-800'}`}
  role="switch"
  aria-checked={enabled}
>
  {enabled ? '✓' : '○'}
</button>
```

## 3. Animation & Motion Patterns

### Staggered List Animations

```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}
```

### Hover Animations

```tsx
<motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
  Hover me
</motion.button>
```

### Page Transitions

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

## 4. Accessibility

### Focus Management

All interactive elements must have visible focus rings:

```css
focus:ring-2 focus:ring-accent focus:outline-none
```

### ARIA Roles & Labels

```tsx
<button aria-label="Close dialog" onClick={onClose}>✕</button>
<div role="tablist" aria-label="Settings tabs">
  {/* tabs */}
</div>
<input type="text" aria-label="Search" />
```

### Keyboard Navigation

- Tab through all controls
- Enter/Space to activate buttons
- Arrow keys for lists, comboboxes
- Escape to close modals/dropdowns

Implement keyboard handlers:

```typescript
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'ArrowDown') { /* move down */ }
  if (e.key === 'ArrowUp') { /* move up */ }
  if (e.key === 'Enter') { /* activate */ }
  if (e.key === 'Escape') { /* close */ }
}
```

### Screen Reader Support

- Use semantic HTML (`<button>`, `<input>`, `<nav>`, etc.)
- Add aria-labels where needed
- Avoid empty buttons; use text or aria-label
- Test with NVDA/JAWS

## 5. Performance Best Practices

### Component Code Splitting

Use lazy imports for large pages:

```typescript
const PrivacyDashboard = lazy(() => import('./PrivacyDashboard'))
const SettingsModal = lazy(() => import('./SettingsModal'))
```

### WebView Lazy Loading

Use `WebViewLoader` which:
- Observes viewport (IntersectionObserver)
- Shows skeleton UI while loading
- Only renders webview when visible

```tsx
<WebViewLoader src="https://example.com" tabId="tab-1" />
```

### Image Optimization

- Use next/image for automatic optimization
- Specify width/height for layout stability
- Load with `priority="false"` (lazy by default)

### Bundle Optimization

Keep Next.js bundle lean:

```bash
npm run build
```

Analyze with: `npx next-bundle-analyzer`

## 6. Dark/Light Theme

The `ThemeProvider` automatically handles theme switching:

```typescript
const { theme, setTheme } = useTheme()

setTheme('dark')   // Dark theme
setTheme('light')  // Light theme
setTheme('system') // Follow system preference
```

Theme state persists to `localStorage`.

## 7. Keyboard Shortcuts

Implement shortcuts for power users:

| Shortcut | Action |
|----------|--------|
| Ctrl+L / Cmd+L | Focus address bar |
| Ctrl+T | New tab |
| Ctrl+W | Close tab |
| Ctrl+N | New window |
| Ctrl+, | Open settings |
| Ctrl+Shift+P | Privacy dashboard |
| Ctrl+/ | Help/shortcuts |

## 8. Component Library

### Available Components

- `BrowserHeader` — Address bar, secure status, nav buttons
- `TabBar` — Drag-reorderable tabs, grouping, overflow menu
- `SidePanel` — Privacy toggles, quick actions, staggered animations
- `PrivacyDashboard` — Stats cards, activity log, quick actions
- `Onboarding` — First-run setup flow with profile selection
- `SettingsModal` — Settings tabs with theme switching
- `WebViewLoader` — Lazy-loaded webview with skeleton UI
- `ThemeProvider` — Theme context and CSS variable injection
- `FingerprintIndicator` / `VpnToggle` / `TorToggle` / `AdblockToggle` — Privacy controls

### Utility Classes

- `.glass-panel` — Glassmorphic panel style
- `.page-shell` — Full-page layout with background glow
- `.browser-card` — Card with shadow and glow
- `.custom-scrollbar` — Styled scrollbar (dark theme)

## 9. Testing & Quality

### Type Safety

All components use strict TypeScript. No `any` types.

### Accessibility Testing

Run automated checks:

```bash
npm install --save-dev axe-core axe-playwright
```

Manual testing:
- Tab through all pages
- Test with screen reader (NVDA/JAWS)
- Test color contrast (WCAG AA minimum)

### Performance Monitoring

Track Core Web Vitals:

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

getCLS(console.log)
getFID(console.log)
getFCP(console.log)
getLCP(console.log)
getTTFB(console.log)
```

## 10. Code Style

- **Spacing**: 2-space indents (set in `.editorconfig`)
- **Imports**: Group by: React/Framer > utils > components
- **Component Names**: PascalCase, match filename
- **Props**: Alphabetical order, optional props at end
- **Comments**: JSDoc for public functions, explain *why*, not *what*

Example:

```typescript
/**
 * Renders a privacy card with animated entrance.
 * Uses IntersectionObserver for viewport-based animation.
 */
interface PrivacyCardProps {
  icon: string
  label: string
  value: number | string
  delay?: number
}

export default function PrivacyCard({ icon, label, value, delay = 0 }: PrivacyCardProps) {
  // component code
}
```

## 11. Future Enhancements

- **Server-Side Rendering (SSR):** Consider Next.js App Router for incremental SSR
- **Real-time Sync:** Sync settings/bookmarks across devices
- **Plugin System:** Allow extensions (like Chrome Web Store)
- **Machine Learning:** Adaptive privacy recommendations per site
- **Analytics Dashboard:** Full privacy audit with historical trends
- **Export/Import:** Settings, bookmarks, history as JSON/CSV
- **Offline Support:** Cache important pages and preload with Service Worker

## Questions?

For design system updates or questions, reach out to the core team. Always test accessibility before shipping UI changes.

---

**Last Updated:** March 2026  
**Version:** 1.0  
**Maintained by:** BLCKBOLT Design System Team
