# Seppia AI Project Kit

A system for generating tailored web projects using AI — replacing the old monolithic CMS fork model.

**Stack:** Laravel API + React SPA (TypeScript)

---

## How it works

Instead of forking a rigid CMS and modifying it per project, this kit provides a set of markdown documents that define how to write code, what the project does, and how to ask Claude to generate it. Each new project starts from a clean repo, copies the relevant files, fills in a project-specific spec, and lets the AI scaffold everything from there.

---

## Kit structure

```text
CLAUDE.md                   ← copy into every project (Claude reads this automatically)

stacks/
  laravel-react.md          ← full stack definition with patterns and examples

rules/
  backend.md                ← Laravel coding rules
  frontend.md               ← React coding rules
  typescript.md             ← TypeScript rules

specs/
  project.md                ← fill-in template: what the project is
  entity.md                 ← fill-in template: one per domain entity

prompts/
  generate-project.md       ← use once at project start to scaffold the full structure
  generate-entity.md        ← use per entity to generate backend + frontend
  generate-ui-page.md       ← use for custom pages (dashboard, settings, etc.)

agents/
  backend-generator.md      ← AI role definition for backend generation
  frontend-generator.md     ← AI role definition for frontend generation

ui-kit/
  design-system.md          ← spacing, colors, typography, layout tokens
  components.md             ← available UI components and usage patterns

templates/
  laravel-api/              ← real starting code (Model, Action, DTO, Controller, tests)
  react-app/                ← real starting code (axios, queryClient, auth hooks, router)
  admin-layout/             ← AdminLayout, Sidebar, Topbar components

examples/
  booking-system/           ← filled-in spec for a gym booking app
  ecommerce/                ← filled-in spec for a small online shop
  cms-simple/               ← filled-in spec for a studio website CMS
```

---

## Starting a new project

1. Create a new repo for the project
2. Copy into it:
   - `CLAUDE.md`
   - `stacks/laravel-react.md`
   - `rules/` (all three files)
   - `ui-kit/` (both files)
   - `specs/project.md` → fill it in for this project
   - `specs/entity.md` → copy once per entity, rename to `specs/entities/[name].md`, fill in
3. Open Claude Code in the new project
4. Run the prompt from `prompts/generate-project.md` to scaffold the base structure
5. Run the prompt from `prompts/generate-entity.md` for each entity

See `examples/` for complete filled-in specs to use as reference.

---

## Workflow summary

```text
New project brief
      │
      ▼
Fill in specs/project.md
Fill in specs/entities/[entity].md  (one per entity)
      │
      ▼
Run prompts/generate-project.md  →  base scaffold generated
      │
      ▼
Run prompts/generate-entity.md   →  full backend + frontend per entity
      │
      ▼
Run prompts/generate-ui-page.md  →  custom pages (dashboard, etc.)
      │
      ▼
Iterate and refine
```
