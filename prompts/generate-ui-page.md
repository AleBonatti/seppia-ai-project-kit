# Prompt: Generate UI Page

Use this prompt to generate a single custom page that doesn't fit the standard entity CRUD pattern.

---

## When to use

- You need a dashboard, analytics page, settings page, or any bespoke screen
- The standard entity list/create/edit pages from `generate-entity.md` are not enough
- You have a specific layout or UX requirement to describe

---

## Prompt

```text
Read the following files before doing anything:
- CLAUDE.md
- specs/project.md
- stacks/laravel-react.md
- rules/frontend.md
- rules/typescript.md
- ui-kit/design-system.md
- ui-kit/components.md

Generate the following page: [PAGE NAME]

## Page description

[Describe the page clearly — what it shows, who uses it, what actions are available]

## Location

- Route: [e.g. /admin/dashboard]
- File: [e.g. src/features/dashboard/pages/DashboardPage.tsx]
- Layout: AdminLayout (sidebar + topbar)

## Content

[Describe what sections, data, or components the page should contain. Be specific.]

Examples:
- A summary row with 4 stat cards: total orders, revenue today, active users, pending items
- A recent activity table showing the last 10 [entity] records
- A chart showing [metric] over the last 30 days
- A quick-action panel with buttons to [action]

## Data sources

[List which API endpoints this page calls, or which hooks it reuses from existing features]

- `GET /api/v1/[entity]?limit=10` — for recent items table
- `GET /api/v1/stats/summary` — for stat cards (define this endpoint too if it doesn't exist)

## UI style notes

[Any specific visual requirements beyond the design system defaults]

## Rules

- Follow all rules in rules/frontend.md and rules/typescript.md
- Use only components from ui-kit/components.md
- Use AdminLayout as the page wrapper
- Server data via React Query hooks only
- Generate complete, working code — no stubs or TODOs
```

---

## Tips

- If the page needs a new API endpoint, describe it clearly and the backend will be generated too
- For dashboard-style pages, be explicit about which metrics and which entities feed them
- Reference the design style in `specs/project.md` — the AI will match it
