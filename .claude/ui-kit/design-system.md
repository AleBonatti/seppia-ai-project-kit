# Design System

This file defines the visual foundations for all projects generated from this kit.
Claude must follow these tokens when generating any UI code.

---

## Spacing

All spacing uses an 8px base grid.

Use Tailwind's spacing scale — every value maps to a multiple of 4px (Tailwind default):

| Token    | Value | Use                                      |
| -------- | ----- | ---------------------------------------- |
| `p-1`    | 4px   | Tight padding inside small elements      |
| `p-2`    | 8px   | Standard padding for chips, badges       |
| `p-3`    | 12px  | Compact padding for inputs, small cards  |
| `p-4`    | 16px  | Default padding for cards, modals        |
| `p-6`    | 24px  | Section padding, page content areas      |
| `p-8`    | 32px  | Large section padding                    |
| `gap-2`  | 8px   | Tight gap between related elements       |
| `gap-4`  | 16px  | Standard gap between form fields         |
| `gap-6`  | 24px  | Gap between sections                     |

---

## Typography

- **Font family:** Inter (default system font stack as fallback)
- **Scale:** Use Tailwind defaults (`text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`)

| Role             | Class                              |
| ---------------- | ---------------------------------- |
| Page title       | `text-2xl font-semibold`           |
| Section heading  | `text-lg font-semibold`            |
| Card title       | `text-base font-medium`            |
| Body text        | `text-sm text-gray-700 dark:text-gray-300` |
| Caption / label  | `text-xs text-gray-500 dark:text-gray-400` |
| Input label      | `text-sm font-medium text-gray-700 dark:text-gray-300` |

---

## Colors

Use Tailwind semantic color names. Avoid hardcoded hex values in classes.

### Neutral palette (base for all UI)

- Background: `bg-white dark:bg-gray-900`
- Surface (cards, panels): `bg-gray-50 dark:bg-gray-800`
- Border: `border-gray-200 dark:border-gray-700`
- Subtle text: `text-gray-500 dark:text-gray-400`
- Body text: `text-gray-900 dark:text-gray-100`

### Primary (actions, links, focus)

- Default: `bg-blue-600 hover:bg-blue-700`
- Text: `text-blue-600 dark:text-blue-400`
- Border: `border-blue-500`
- Focus ring: `focus:ring-2 focus:ring-blue-500`

### Semantic colors

| State   | Background      | Text                | Border               |
| ------- | --------------- | ------------------- | -------------------- |
| Success | `bg-green-50`   | `text-green-700`    | `border-green-200`   |
| Warning | `bg-yellow-50`  | `text-yellow-700`   | `border-yellow-200`  |
| Error   | `bg-red-50`     | `text-red-700`      | `border-red-200`     |
| Info    | `bg-blue-50`    | `text-blue-700`     | `border-blue-200`    |

> Note: project-specific primary colors are defined in `specs/project.md`.
> When a project has a custom primary color, extend `tailwind.config.ts` with a `brand` color token.

---

## Border radius

- Default for cards, panels: `rounded-lg` (8px)
- Default for inputs, buttons: `rounded-md` (6px)
- Chips, badges: `rounded-full`
- No sharp corners (`rounded-none`) unless specifically needed

---

## Shadows

Soft shadows only — no heavy drop shadows.

| Use                | Class                     |
| ------------------ | ------------------------- |
| Cards, panels      | `shadow-sm`               |
| Dropdowns, modals  | `shadow-md`               |
| Elevated dialogs   | `shadow-lg`               |

---

## Dark mode

- Always include dark mode variants on color classes
- Use the `dark:` Tailwind prefix
- Never assume light-only — every component must work in both modes
- Dark mode is triggered by the `dark` class on `<html>` (Tailwind `darkMode: 'class'`)

---

## Borders

- Minimal borders — use borders to separate, not to decorate
- Standard divider: `border-b border-gray-200 dark:border-gray-700`
- Table row divider: `divide-y divide-gray-100 dark:divide-gray-800`
- Card border (optional): `border border-gray-200 dark:border-gray-700`

---

## Icons

- Library: **Lucide React** — no other icon libraries
- Size scale:
  - Inline with text: `size={14}` or `size={16}`
  - Buttons: `size={16}` or `size={18}`
  - Navigation items: `size={20}`
  - Page headings / empty states: `size={24}` or `size={32}`
- Stroke width: always default (1.5) — never override
- Color: inherit from text color via `currentColor`

---

## Motion

- Keep animations subtle and fast
- Use Tailwind `transition` utilities — no custom keyframes unless strictly needed
- Standard transition: `transition-colors duration-150`
- Hover states on interactive elements: always include a visual response

---

## Layout

### Admin panel layout

```text
┌─────────────────────────────────────────────┐
│  Topbar (h-14, border-b)                    │
├───────────┬─────────────────────────────────┤
│           │                                 │
│  Sidebar  │  Main content area              │
│  (w-56)   │  (p-6, scrollable)              │
│           │                                 │
└───────────┴─────────────────────────────────┘
```

- Sidebar width: `w-56` (224px)
- Topbar height: `h-14` (56px)
- Content padding: `p-6`
- Max content width: `max-w-5xl` (for readability on wide screens)

### Page header pattern

Every admin page starts with:

```text
Page title                         [Primary action button]
Subtitle or breadcrumb
──────────────────────────────────────────────
[Content]
```
