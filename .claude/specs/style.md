# Project Style

> Copy this file into your project and fill in the relevant fields.
> Claude will read this when generating any frontend code.
> Leave a field blank or delete it to use the kit default.

---

## Visual style

- **Aesthetic:** [e.g. "clean and minimal", "bold and editorial", "friendly and colorful"]
- **Reference:** [e.g. "similar to Linear", "inspired by Stripe dashboard", "warm tones like Notion"]

---

## Accent color

The kit default is `#66FF4C` (lime green). Override here only if the project requires a different brand color.

```css
:root {
  --accent: #66FF4C;       /* primary actions, active states */
  --accent-ink: #06210a;   /* text on accent background — update when changing accent */
}
```

Leave this section unchanged to use the kit default.

---

## Font

Default is **Figtree** (see `design-system.md`). Override here if the project requires a different typeface.

- **Font family:** [e.g. "Inter" or "Geist" — leave blank for Figtree]

---

## Dark mode

- **Default theme:** [dark | light] — kit default is dark
