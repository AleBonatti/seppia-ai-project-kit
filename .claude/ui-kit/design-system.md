# Design System

This file defines the visual foundations for all projects generated from this kit.
Claude must follow these tokens when generating any UI code.

The visual reference is `jsx/SeppiaCms.html` in this kit repo — read it when generating layout and UI components.

---

## Font

**Figtree** — loaded from Google Fonts.

Add to `frontend/index.html` `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
```

Set as base font in global CSS:

```css
body {
  font-family: 'Figtree', system-ui, sans-serif;
  font-size: 14.5px;
  line-height: 1.5;
  letter-spacing: -0.01em;
}
```

---

## Color tokens

Colors are defined as CSS custom properties in `@layer base` and consumed in components via Tailwind's arbitrary value syntax (`bg-[--box]`, `text-[--ink]`). This allows the accent color to be swapped per project without touching component code.

Add to `frontend/src/index.css`:

```css
@import "tailwindcss";

@layer base {
  :root {
    --accent: #66FF4C;
    --accent-ink: #06210a;
    --r: 12px;
    --r-sm: 9px;
    --sb-w: 256px;
  }

  html[data-theme="dark"] {
    --bg: #18181b;
    --box: #09090b;
    --panel: #18181b;
    --surface-2: #1d1d20;
    --ink: #e7e3e4;
    --muted: #a1a1aa;
    --faint: #71717a;
    --border: #232327;
    --border-soft: #1c1c20;
    --field: #18181b;
    --field-border: #3f3f47;
    --selected: #f5f4f4;
    --shadow: 0 16px 40px -12px rgba(0,0,0,.6);
  }

  html[data-theme="light"] {
    --bg: #f4f4f5;
    --box: #ffffff;
    --panel: #f4f4f5;
    --surface-2: #e4e4e7;
    --ink: #18181b;
    --muted: #52525b;
    --faint: #71717a;
    --border: #e4e4e7;
    --border-soft: #f0f0f1;
    --field: #ffffff;
    --field-border: #d4d4d8;
    --selected: #09090b;
    --shadow: 0 16px 40px -12px rgba(0,0,0,.12);
  }
}
```

### Token reference

| Token | Dark | Light | Role |
| --- | --- | --- | --- |
| `--accent` | `#66FF4C` | `#66FF4C` | Primary actions, active states |
| `--accent-ink` | `#06210a` | `#06210a` | Text on accent background |
| `--bg` | `#18181b` | `#f4f4f5` | App gutter, sidebar |
| `--box` | `#09090b` | `#ffffff` | Main content, cards |
| `--surface-2` | `#1d1d20` | `#e4e4e7` | Hover fills, subtle backgrounds |
| `--ink` | `#e7e3e4` | `#18181b` | Primary text |
| `--muted` | `#a1a1aa` | `#52525b` | Secondary text |
| `--faint` | `#71717a` | `#71717a` | Tertiary text, placeholders |
| `--border` | `#232327` | `#e4e4e7` | Dividers, outlines |
| `--field` | `#18181b` | `#ffffff` | Input backgrounds |
| `--field-border` | `#3f3f47` | `#d4d4d8` | Input borders |
| `--selected` | `#f5f4f4` | `#09090b` | Heading text |

### Accent color per project

The default accent is `#66FF4C` (lime green). Each project can override it in `specs/project.md`.
When generating a project, set the override in `index.css`:

```css
:root {
  --accent: #2A6FDB; /* project-specific */
}
```

### Semantic colors (badges, status)

| State | Background class | Text class |
| --- | --- | --- |
| Published / success | `bg-green-500/15` | `text-green-400` |
| Draft / neutral | `bg-zinc-500/15` | `text-zinc-400` |
| Review / warning | `bg-orange-500/15` | `text-orange-400` |
| Error / danger | `bg-red-500/15` | `text-red-400` |
| Info | `bg-blue-500/15` | `text-blue-400` |

---

## Spacing

Two density modes — cozy (default) and compact:

| Token | Cozy | Compact | Use |
| --- | --- | --- | --- |
| `--pad` | 22px | 16px | Card/section padding |
| `--row-h` | 60px | 48px | Table row height |
| `--gap` | 18px | 12px | Grid and flex gaps |

In components, use Tailwind spacing utilities that approximate these:

- `p-5` (20px) ≈ cozy pad — use for cards and sections
- `p-4` (16px) — compact pad / form field spacing
- `gap-4` (16px) — standard gap between elements
- `gap-3` (12px) — tight gap

---

## Border radius

- Default (cards, modals, inputs): `rounded-[12px]` or `rounded-xl`
- Small (badges, chips, buttons): `rounded-[9px]`
- Full (avatars, toggles): `rounded-full`

---

## Icons

**Library: Hugeicons** (`@hugeicons/react`) — the only icon library used in all projects.

Install:
```bash
npm install @hugeicons/react
```

Usage:
```tsx
import { DashboardSquare01Icon, UserGroupIcon } from '@hugeicons/react'

<DashboardSquare01Icon size={20} strokeWidth={1.8} />
```

- Size for nav items: `20`
- Size for inline / buttons: `16`
- Size for page headings / empty states: `24` or `32`
- Stroke width: always `1.8` — never deviate

---

## Dark mode

- Triggered by `data-theme="dark"` attribute on `<html>` (not the `dark` class)
- Default is **dark mode**
- Applied immediately via a module-level statement in `AdminLayout.tsx` before first render
- User preference persisted in `localStorage` under key `theme`
- Toggle lives in `Sidebar.tsx` (user card area)

```ts
// Applied before React renders — prevents flash
const stored = localStorage.getItem('theme')
document.documentElement.setAttribute('data-theme', stored ?? 'dark')
```

---

## Layout

### Admin shell

CSS Grid, not flexbox:

```
┌──────────────────────────────────────────────────┐
│  Sidebar (var(--sb-w) = 256px)  │  Main content  │
│  ─ Brand/logo                   │  ─ Breadcrumb  │
│  ─ Nav groups                   │  ─ Page area   │
│  ─ User card                    │  (scrollable)  │
└──────────────────────────────────────────────────┘
```

```css
.shell {
  display: grid;
  grid-template-columns: var(--sb-w) 1fr;
  height: 100vh;
  overflow: hidden;
}
```

Sidebar widths:
- Comfortable (default): `--sb-w: 256px`
- Compact: `--sb-w: 212px`
- Icon-only: `--sb-w: 62px`

### Sidebar collapse

The sidebar can be toggled between comfortable and icon-only. State persisted in `localStorage` under key `sidebar`.

### Main content area

- No `max-w` cap — content is full width inside padding
- Content padding: `p-5` (cozy) or `p-4` (compact)
- Breadcrumb bar sits at the top of the main column, above the page content

### Page header pattern

```text
← Back (optional)   Page title                [Primary action]
                    Subtitle
─────────────────────────────────────────────────────────────
[Content]
```

---

## Motion

- Transitions: `transition-colors duration-150` for color changes
- Sidebar collapse: `transition-[width] duration-200`
- Keep all animations subtle and fast — no bouncy or decorative effects
