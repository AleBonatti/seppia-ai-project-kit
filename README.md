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
    react-app/                   ← reference code: axios, queryClient, auth hooks, router
    admin-layout/                ← reference code: AdminLayout, Sidebar, Topbar

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

## Previewing the UI prototypes

The `jsx/` folder contains standalone HTML prototypes of the admin layout. They load `.jsx` component files at runtime, which requires an HTTP server (browsers block `file://` cross-origin requests).

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
  stacks/
    laravel-react.md              ← you will fill this in next
  templates/                     ← reference code Claude reads when generating files
    laravel-api/
    react-app/
    admin-layout/
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
- UI style (aesthetic, primary color, dark mode preference)
- Integrations and out-of-scope items

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
3. Configure Tailwind, path aliases, and environment files
4. Generate all base Laravel files (User model, auth controller, routes, migrations, seeder)
5. Generate all base React files (axios, auth feature, layout, all UI components, router)
6. Run migrations and seed a default admin user

After the prompt completes, configure your local database in `api/.env`, then start the servers:

```bash
cd api && php artisan serve       # Laravel on http://localhost:8000
cd frontend && npm run dev        # React on http://localhost:5173
```

Open `http://localhost:5173/login` — you should see the login screen.
Log in with the seeded admin credentials (Claude will tell you what they are).

### Step 7 — Generate each entity

For each entity, open `.claude/prompts/generate-entity.md` from this kit, copy the prompt text,
replace `[entity-name]` with your entity's filename, and paste it into Claude Code.

Claude will generate for each entity:

**Backend:** migration, model, DTO, actions (create/update/delete), form requests, controller,
API resource, policy, route registration, Pest feature tests.

**Frontend:** TypeScript types, API functions, React Query hooks, form component, table
component, list page, create/edit pages.

Run this prompt once per entity, in any order.

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
        → full base scaffold generated
        → login screen working at localhost:5173
      │
      ▼
Step 7: Paste generate-entity.md prompt (once per entity)
        → full backend + frontend per entity
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
