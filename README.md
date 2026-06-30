# Seppia AI Project Kit

A system for generating tailored web projects using AI — replacing the old monolithic CMS fork model.

**Stack:** Laravel API + React SPA (TypeScript)

---

## How it works

Instead of forking a rigid CMS and modifying it per project, this kit provides a set of markdown documents that define how to write code, what the project does, and how to ask Claude to generate it. Each new project starts from a clean repo, copies the relevant files from this kit, fills in a project-specific spec, and lets the AI scaffold everything from there — including installing Laravel and React.

---

## Kit structure

Everything lives under `.claude/` to keep the repo root clean. `CLAUDE.md` is the only exception — it must stay at the root so Claude Code picks it up automatically.

```text
CLAUDE.md                        ← copy to every project root (auto-read by Claude Code)

.claude/
  stacks/
    laravel-react.md             ← full stack definition: packages, patterns, code examples

  rules/
    backend.md                   ← Laravel coding rules
    frontend.md                  ← React coding rules
    typescript.md                ← TypeScript rules

  specs/
    project.md                   ← fill-in template: describes the project
    entity.md                    ← fill-in template: describes one domain entity (copy per entity)
    agents/
      translation-agent.md       ← OPTIONAL feature: auto-translates entity content via Claude API

  prompts/
    generate-project.md          ← installs Laravel + React, then scaffolds the full base project
    generate-entity.md           ← generates backend + frontend for one entity
    generate-ui-page.md          ← generates a custom page (dashboard, settings, etc.)

  agents/
    backend-generator.md         ← AI role definition for backend generation
    frontend-generator.md        ← AI role definition for frontend generation

  ui-kit/
    design-system.md             ← spacing, colors, typography, layout tokens
    components.md                ← shared UI components and usage patterns

  templates/
    laravel-api/                 ← reference code: Action, DTO, Controller, Model, tests
      app/
        Jobs/
          TranslateEntityJob.php       ← OPTIONAL: queued translation job (translation agent)
        Actions/
          TranslateEntityAction.php    ← OPTIONAL: the translation agent (Claude API tool-use)
    react-app/
      src/
        index.css                ← design system CSS tokens (Tailwind v4)
        types/api.ts             ← shared API response types
        lib/
          axios.ts               ← Axios instance with Sanctum config
          icons.tsx              ← Hugeicons adapter (all icons imported from here)
        app/
          queryClient.ts         ← React Query client
          router.tsx             ← route definitions
        layouts/
          AdminLayout.tsx        ← CSS Grid shell (sidebar + main)
          AuthLayout.tsx         ← centered card shell (login, forgot, reset)
          PublicLayout.tsx       ← placeholder for public-facing frontend
          Sidebar.tsx            ← left nav with theme toggle and user card
          Breadcrumb.tsx         ← floating pill breadcrumb above page content
          Pagination.tsx         ← page window with prev/next and ellipsis
          useTheme.ts            ← data-theme attribute manager (shared by all layouts)
        components/
          ui/
            Button.tsx           ← variants: primary, secondary, danger, ghost
            Input.tsx            ← label, error, hint props; forwards ref
            Textarea.tsx         ← same interface as Input
            Select.tsx           ← label, error, options props; caret icon
            Spinner.tsx          ← sizes: sm, md, lg
            Checkbox.tsx         ← forwardRef; peer-checked accent fill
            Badge.tsx            ← success/warning/error/info/neutral; dot + pill
            Card.tsx             ← Card, CardHeader, CardFooter; flush prop
            Calendar.tsx         ← DatePicker (popover) + InlineCalendar; react-day-picker v9
            Table.tsx            ← Table, TableHeader/Body/Row/Head/Cell, TableCheckCell, RowTitle
            Chip.tsx             ← filter toggle; active uses color-mix accent tint
            Avatar.tsx           ← initials circle; sm/md/lg; optional src image
            Tabs.tsx             ← underline style; active tab accent border-b
            Modal.tsx            ← backdrop + panel; Escape to close; sm/md/lg sizes
            EmptyState.tsx       ← icon, title, description, action
            PageHeader.tsx       ← title, description, action, backHref
            StatCard.tsx         ← label, value, icon, delta, deltaUp
            SaveBar.tsx          ← lastSaved timestamp + Cancel / Save actions
            Dropzone.tsx         ← drag-and-drop; click-to-browse fallback
        features/
          auth/
            types.ts             ← auth types + password reset payloads
            api.ts               ← login, logout, me, forgotPassword, resetPassword
            AuthGuard.tsx        ← redirects to /login if unauthenticated
            hooks/               ← useAuth, useLogin, useLogout, useForgotPassword, useResetPassword
            pages/
              LoginPage.tsx      ← email + password + Google button + remember me
              ForgotPasswordPage.tsx
              ResetPasswordPage.tsx

examples/
  booking-system/                ← complete filled-in spec: gym booking app
  ecommerce/                     ← complete filled-in spec: small online shop
  cms-simple/                    ← complete filled-in spec: studio website CMS
  cms-advanced/                  ← complete filled-in spec: multi-admin CMS with media library

jsx/
  SeppiaCms.html                 ← hi-fi admin layout prototype
  Login.html                     ← login page prototype
  SeppiaCms Wireframe.html       ← wireframe variant
  hf-shell.jsx / hf-pages.jsx    ← component source loaded by the HTML files
  wf-shell.jsx / wf-pages.jsx    ← wireframe component source
  tweaks-panel.jsx               ← live customisation panel
```

---

## Template files

The `templates/` folder contains concrete source files that Claude copies verbatim when
scaffolding a project. This eliminates drift — tokens, focus styles, `forwardRef` wiring,
and component APIs are frozen in code, not reconstructed from prose on each generation.

**Copied verbatim** (never regenerated from prose):

| Template file | Destination in generated project |
| --- | --- |
| `react-app/src/index.css` | `frontend/src/index.css` |
| `react-app/src/types/api.ts` | `frontend/src/types/api.ts` |
| `react-app/src/lib/axios.ts` | `frontend/src/lib/axios.ts` |
| `react-app/src/lib/icons.tsx` | `frontend/src/lib/icons.tsx` |
| `react-app/src/app/queryClient.ts` | `frontend/src/app/queryClient.ts` |
| `react-app/src/app/router.tsx` | `frontend/src/app/router.tsx` |
| `react-app/src/layouts/AdminLayout.tsx` | `frontend/src/layouts/AdminLayout.tsx` |
| `react-app/src/layouts/AuthLayout.tsx` | `frontend/src/layouts/AuthLayout.tsx` |
| `react-app/src/layouts/PublicLayout.tsx` | `frontend/src/layouts/PublicLayout.tsx` |
| `react-app/src/layouts/Sidebar.tsx` | `frontend/src/layouts/Sidebar.tsx` |
| `react-app/src/layouts/Breadcrumb.tsx` | `frontend/src/layouts/Breadcrumb.tsx` |
| `react-app/src/layouts/Pagination.tsx` | `frontend/src/layouts/Pagination.tsx` |
| `react-app/src/layouts/useTheme.ts` | `frontend/src/layouts/useTheme.ts` |
| `react-app/src/components/ui/Button.tsx` | `frontend/src/components/ui/Button.tsx` |
| `react-app/src/components/ui/Input.tsx` | `frontend/src/components/ui/Input.tsx` |
| `react-app/src/components/ui/Textarea.tsx` | `frontend/src/components/ui/Textarea.tsx` |
| `react-app/src/components/ui/Select.tsx` | `frontend/src/components/ui/Select.tsx` |
| `react-app/src/components/ui/Spinner.tsx` | `frontend/src/components/ui/Spinner.tsx` |
| `react-app/src/components/ui/Checkbox.tsx` | `frontend/src/components/ui/Checkbox.tsx` |
| `react-app/src/components/ui/Badge.tsx` | `frontend/src/components/ui/Badge.tsx` |
| `react-app/src/components/ui/Card.tsx` | `frontend/src/components/ui/Card.tsx` |
| `react-app/src/components/ui/Calendar.tsx` | `frontend/src/components/ui/Calendar.tsx` |
| `react-app/src/components/ui/Table.tsx` | `frontend/src/components/ui/Table.tsx` |
| `react-app/src/components/ui/Chip.tsx` | `frontend/src/components/ui/Chip.tsx` |
| `react-app/src/components/ui/Avatar.tsx` | `frontend/src/components/ui/Avatar.tsx` |
| `react-app/src/components/ui/Tabs.tsx` | `frontend/src/components/ui/Tabs.tsx` |
| `react-app/src/components/ui/Modal.tsx` | `frontend/src/components/ui/Modal.tsx` |
| `react-app/src/components/ui/EmptyState.tsx` | `frontend/src/components/ui/EmptyState.tsx` |
| `react-app/src/components/ui/PageHeader.tsx` | `frontend/src/components/ui/PageHeader.tsx` |
| `react-app/src/components/ui/StatCard.tsx` | `frontend/src/components/ui/StatCard.tsx` |
| `react-app/src/components/ui/SaveBar.tsx` | `frontend/src/components/ui/SaveBar.tsx` |
| `react-app/src/components/ui/Dropzone.tsx` | `frontend/src/components/ui/Dropzone.tsx` |
| `react-app/src/features/auth/**` | `frontend/src/features/auth/**` |

**Generated from prose** (via `generate-project.md`): the dashboard placeholder page and all entity-specific code.

---

## Optional: background agents

The kit can generate **optional background agents** — runtime features that live inside the
generated project and call the Claude API to do work asynchronously. They are entirely opt-in:
a feature exists in a project only if its spec file is present.

### Translation agent

Auto-translates an entity's content from a primary locale into secondary locales after it is
saved. The save returns immediately; the translation runs on the queue in the background.

**How it works**

1. An entity (e.g. `Page`) is saved in the primary locale (e.g. Italian).
2. The entity's Create/Update action dispatches `TranslateEntityJob` (only when
   `config('agents.translation.enabled')` is true).
3. The job runs `TranslateEntityAction`, which loads the source fields and calls the Claude API
   with a forced `set_translation` tool call — Claude returns structured translations.
4. The action persists each locale onto the entity's translation table via `updateOrCreate`.

**Turning it on for a project**

Copy `.claude/specs/agents/translation-agent.md` into the project and fill it in (locales,
which entities/fields, trigger, style instructions). When that file is present with
`enabled: true`, project generation also produces:

- `app/Jobs/TranslateEntityJob.php` and `app/Actions/TranslateEntityAction.php`
- `config/agents.php` (`translation.enabled`, `translation.model`)
- an `anthropic` block in `config/services.php` (reads `ANTHROPIC_API_KEY`)
- `ANTHROPIC_API_KEY`, `TRANSLATION_AGENT_ENABLED`, `TRANSLATION_AGENT_MODEL` in `.env.example`
- a one-line dispatch hook at the end of each `on_save` entity's Create/Update action
- `composer require anthropic-ai/sdk`

**Turning it off** — simply omit the spec file. When it is absent, nothing agent-related is
generated: no job, no action, no config, no env vars, no dispatch hooks. Default model is
`claude-sonnet-4-6` (a good cost/quality fit for translation), overridable via
`TRANSLATION_AGENT_MODEL`.

See `examples/cms-advanced/` for a complete, filled-in reference.

---

## Previewing the UI prototypes

The `jsx/` folder contains standalone HTML prototypes of the admin layout. They load `.jsx`
component files at runtime, which requires an HTTP server (browsers block `file://`
cross-origin requests).

```bash
cd jsx
python3 -m http.server 8080
```

Then open in your browser:

- `http://localhost:8080/SeppiaCms.html` — hi-fi admin layout
- `http://localhost:8080/Login.html` — login page
- `http://localhost:8080/SeppiaCms%20Wireframe.html` — wireframe variant

To stop the server:

```bash
kill $(lsof -ti:8080)
```

---

## Building a new project — step by step

### Step 1 — Create the project repo

Create a new empty git repository for the project. Open it in your editor.

### Step 2 — Copy the kit files

Copy these files and folders from this kit into the new project, preserving the structure:

```text
CLAUDE.md                        → project root
.claude/
  rules/
    backend.md
    frontend.md
    typescript.md
  specs/
    project.md
    style.md                     ← fill in: accent color, font, dark mode
    dashboard.md                 ← fill in: stat cards, recent activity, quick actions
    auth.md                      ← copy as-is, no edits needed
  stacks/
    laravel-react.md
  templates/                     ← Claude copies these verbatim when generating files
    laravel-api/
    react-app/
  ui-kit/
    design-system.md
    components.md
```

You do **not** need to copy `prompts/`, `agents/`, or `examples/` into the project —
those stay in this kit repo and are used from here.

### Step 3 — Describe the project

Open `.claude/specs/project.md` in the new project and fill in every section:

- Project name, client, type, one-sentence description
- Users and roles (who can do what)
- Core features (checklist of what to build)
- Domain entities (the main "things" — products, posts, orders, etc.)
- Navigation structure (sidebar items for the admin panel)
- Integrations and out-of-scope items

Also fill in `.claude/specs/style.md` (accent color, font, dark mode) and
`.claude/specs/dashboard.md` (stat cards, recent activity, quick actions).

See `examples/` in this kit for complete filled-in examples to use as reference.

### Step 4 — Describe each entity

For each domain entity listed in `.claude/specs/project.md`, copy `.claude/specs/entity.md`
from this kit into the new project as `.claude/specs/entities/[entity-name].md` and fill it in.

```text
.claude/specs/
  project.md
  entities/
    product.md      ← one file per entity
    category.md
    order.md
```

Each entity spec defines fields and types, validation rules, relationships, permissions,
API endpoints, admin UI requirements, and business rules.

See `examples/` for complete entity specs to use as reference.

### Step 5 — Open Claude Code in the new project

Open Claude Code inside the new project repo (not this kit repo).
Claude will automatically read `CLAUDE.md` at session start.

### Step 6 — Run the project scaffold prompt

Open `.claude/prompts/generate-project.md` from this kit, copy the prompt text inside the
code block, and paste it into Claude Code.

Claude will:

1. Install Laravel in `api/` via `composer create-project`
2. Install React + all required packages in `frontend/` via `npm create vite`
3. Configure Tailwind v4, path aliases, and environment files
4. Copy all template files verbatim (layout, auth, base UI components)
5. Generate remaining UI components and the dashboard placeholder
6. Run migrations and seed a default admin user

After the prompt completes, start the servers:

```bash
cd api && php artisan serve       # Laravel on http://localhost:8000
cd frontend && npm run dev        # React on http://localhost:5173
```

Open `http://localhost:5173/login` — you should see the login screen.
Log in with the seeded admin credentials (Claude will tell you what they are).

### Step 7 — Generate each entity

Open `.claude/prompts/generate-entity.md` from this kit, copy the prompt text, and paste it
into Claude Code. There are two ways to use it:

**Generate all remaining entities at once** — paste the prompt as-is, without adding anything.
Claude will list all files in `.claude/specs/entities/`, check which migrations already exist,
and generate every remaining entity in the order defined in the "Entity generation order" section
of `project.md`.

**Generate a specific entity** — append the entity name at the end of the prompt:

```text
generate the Product entity
```

Claude respects dependencies automatically: if the entity you request depends on another that
hasn't been generated yet, it generates the dependency first.

Claude will generate for each entity:

**Backend:** migration, model, DTO, actions (create/update/delete), form requests, controller,
API resource, policy, route registration, Pest feature tests.

**Frontend:** TypeScript types, API functions, React Query hooks, form component, table
component, list page, create/edit pages.

### Step 7.5 — Generate the dashboard

Open `.claude/prompts/generate-dashboard.md` from this kit, copy the prompt text, and paste it
into Claude Code. Claude will read `.claude/specs/dashboard.md` and generate:

- A `DashboardController` with a single `/api/v1/admin/dashboard` endpoint
- A `GetDashboardStatsAction` that runs all the counts and recent-item queries
- `useDashboardStats` React Query hook
- The real `DashboardPage.tsx`, replacing the placeholder generated in Step 6

### Step 8 — Generate custom pages (optional)

For any page that doesn't fit the standard entity CRUD pattern — a dashboard with stats,
a settings screen, a reporting page — use `.claude/prompts/generate-ui-page.md` from this kit.

### Step 9 — Iterate and refine

The project is fully scaffolded. Continue in Claude Code as normal — the `.claude/` rules and
stack files ensure Claude stays consistent with the established patterns throughout.

---

## Workflow summary

```text
New project brief
      │
      ▼
Steps 2–4: Copy .claude/ kit files → fill in specs/project.md → fill in specs/entities/*.md
      │
      ▼
Step 6: Paste generate-project.md prompt
        → Laravel + React installed from scratch
        → template files copied verbatim (layout, auth, core UI components)
        → remaining UI components and dashboard generated
        → login screen working at localhost:5173
      │
      ▼
Step 7: Paste generate-entity.md prompt (once per entity, or all at once)
        → full backend + frontend per entity
      │
      ▼
Step 7.5: Paste generate-dashboard.md prompt
        → real dashboard replacing the placeholder
      │
      ▼
Step 8: Paste generate-ui-page.md prompt (optional)
        → custom pages (dashboard, settings, etc.)
      │
      ▼
Step 9: Iterate and refine in Claude Code
```

---

## Requirements

- PHP 8.2+ and Composer installed locally
- Node.js 18+ and npm installed locally
- A local MySQL (or compatible) database
- Claude Code (CLI or VS Code extension)
