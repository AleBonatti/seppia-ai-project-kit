# Seppia AI Project Kit

A system for generating tailored web projects using AI — replacing the old monolithic CMS fork model.

**Stack:** Laravel API + React SPA (TypeScript)

---

## How it works

Instead of forking a rigid CMS and modifying it per project, this kit provides a set of markdown documents that define how to write code, what the project does, and how to ask Claude to generate it. Each new project starts from a clean repo, copies the relevant files from this kit, fills in a project-specific spec, and lets the AI scaffold everything from there — including installing Laravel and React.

---

## Kit structure

```text
CLAUDE.md                   ← copy into every project (Claude reads this automatically)

stacks/
  laravel-react.md          ← full stack definition: packages, patterns, code examples

rules/
  backend.md                ← Laravel coding rules
  frontend.md               ← React coding rules
  typescript.md             ← TypeScript rules

specs/
  project.md                ← fill-in template: describes the project
  entity.md                 ← fill-in template: describes one domain entity (copy per entity)

prompts/
  generate-project.md       ← installs Laravel + React, then scaffolds the full base project
  generate-entity.md        ← generates backend + frontend for one entity
  generate-ui-page.md       ← generates a custom page (dashboard, settings, etc.)

agents/
  backend-generator.md      ← AI role definition for backend generation
  frontend-generator.md     ← AI role definition for frontend generation

ui-kit/
  design-system.md          ← spacing, colors, typography, layout tokens
  components.md             ← shared UI components and usage patterns

templates/
  laravel-api/              ← reference code: Action, DTO, Controller, Model, tests
  react-app/                ← reference code: axios, queryClient, auth hooks, router
  admin-layout/             ← reference code: AdminLayout, Sidebar, Topbar

examples/
  booking-system/           ← complete filled-in spec: gym booking app
  ecommerce/                ← complete filled-in spec: small online shop
  cms-simple/               ← complete filled-in spec: studio website CMS
  cms-advanced/             ← complete filled-in spec: multi-admin CMS with media library
```

---

## Building a new project — step by step

### Step 1 — Create the project repo

Create a new empty git repository for the project. Open it in your editor.

### Step 2 — Copy the kit files

Copy these files from the kit into the new project repo, preserving the folder structure:

```text
CLAUDE.md
stacks/
  laravel-react.md
rules/
  backend.md
  frontend.md
  typescript.md
ui-kit/
  design-system.md
  components.md
specs/
  project.md        ← you will fill this in next
```

You do **not** need to copy `prompts/`, `agents/`, `templates/`, or `examples/` into the project —
those stay in this kit repo and are used from here.

### Step 3 — Describe the project

Open `specs/project.md` and fill in every section:

- Project name, client, type, one-sentence description
- Users and roles (who can do what)
- Core features (checklist of what to build)
- Domain entities (the main "things" in the project — products, posts, orders, etc.)
- Navigation structure (sidebar items for the admin panel)
- UI style (aesthetic, primary color, dark mode preference)
- Integrations and out-of-scope items

See `examples/` in this kit for complete filled-in examples to use as reference.

### Step 4 — Describe each entity

For each domain entity listed in your `specs/project.md`, copy `specs/entity.md` from the kit
into the new project as `specs/entities/[entity-name].md` and fill it in.

```text
specs/
  project.md
  entities/
    product.md      ← one file per entity
    category.md
    order.md
```

Each entity spec defines:

- Fields and their types, validation rules, and any special notes
- Relationships to other entities
- Who has permission to do what (list, create, update, delete)
- Which API endpoints to generate
- What the admin UI should show (list columns, form fields, filters)
- Business rules (logic beyond simple CRUD)

See `examples/` for complete entity specs to use as reference.

### Step 5 — Open Claude Code in the new project

Open Claude Code inside the new project repo (not this kit repo).
Claude will automatically read `CLAUDE.md` at session start.

### Step 6 — Run the project scaffold prompt

Open `prompts/generate-project.md` from this kit, copy the prompt text inside the code block,
and paste it into Claude Code.

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

For each entity in your project, open `prompts/generate-entity.md` from this kit,
copy the prompt text, replace `[entity-name]` with your entity's filename, and paste it into Claude Code.

Claude will generate for each entity:

**Backend:** migration, model, DTO, actions (create/update/delete), form requests, controller, API resource, policy, route registration, Pest feature tests.

**Frontend:** TypeScript types, API functions, React Query hooks, form component, table component, list page, create/edit pages.

Run this prompt once per entity, in any order.

### Step 8 — Generate custom pages (optional)

For any page that doesn't fit the standard entity CRUD pattern — a dashboard with stats,
a settings screen, a reporting page — use `prompts/generate-ui-page.md` from this kit.

Describe the page clearly in the prompt: what it shows, which API endpoints it calls,
what the layout should look like.

### Step 9 — Iterate and refine

At this point the project is fully scaffolded. Continue working in Claude Code as normal —
ask for changes, additions, or fixes. The rules and stack files in the project repo
ensure Claude stays consistent with the established patterns throughout.

---

## Workflow summary

```text
New project brief
      │
      ▼
Step 2–4: Copy kit files → fill in specs/project.md → fill in specs/entities/*.md
      │
      ▼
Step 6: Paste generate-project.md prompt → Laravel + React installed + base scaffold generated
      │
      ▼
Step 7: Paste generate-entity.md prompt (once per entity) → full backend + frontend per entity
      │
      ▼
Step 8: Paste generate-ui-page.md prompt (optional) → custom pages
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
