# Seppia AI Project Kit — Master Guide

This file is the entry point for Claude Code when working on any project generated from this kit.

Copy this file (and the relevant stack/specs/rules files) into a new project repo.
Claude Code will read it automatically at session start.

---

## What this kit is

A set of markdown documents that define:
- **How to write code** (`rules/`)
- **What the project is** (`specs/`)
- **Which tech stack to use** (`stacks/`)
- **How to ask AI to generate code** (`prompts/`)
- **What the UI looks like** (`ui-kit/`)

This is NOT a framework. There is no runtime dependency on this kit.
The kit exists only to give Claude consistent instructions.

---

## How to use this kit in a new project

1. Create a new repo for the project
2. Copy into it:
   - `CLAUDE.md` (this file)
   - `stacks/laravel-react.md`
   - `rules/backend.md`
   - `rules/frontend.md`
   - `rules/typescript.md`
   - `ui-kit/design-system.md`
   - `ui-kit/components.md`
   - `specs/project.md` ← **fill this in for the specific project**
3. For each domain entity, copy `specs/entity.md` from the kit into `specs/entities/[entity-name].md` and fill it in
   - Example: `specs/entities/product.md`, `specs/entities/order.md`, `specs/entities/category.md`
   - The original `specs/entity.md` in the kit is a blank template — never copy it as-is
4. Open Claude Code in the new project
5. Use the prompts in `prompts/` to start generating code

---

## Project context (fill in per project)

> When copying this file into a new project, replace this section with the project name and a one-line description.

**Project:** _[project name]_
**Description:** _[one sentence about what this project does]_
**Stack:** Laravel API + React SPA (TypeScript)
**Spec file:** `specs/project.md`

---

## Rules Claude must always follow

When generating or modifying code in this project:

### Backend (Laravel)
- Read and follow `rules/backend.md`
- Read and follow `stacks/laravel-react.md` § Backend
- Controllers must be thin — no business logic
- All business logic lives in `app/Actions/`
- All input/output passes through DTOs in `app/DTOs/`
- Validation lives in `app/Http/Requests/`
- Authorization lives in `app/Policies/`
- No dynamic schema systems, no JSON-driven entities
- Use Pest PHP for tests — feature tests preferred

### Frontend (React + TypeScript)
- Read and follow `rules/frontend.md`
- Read and follow `rules/typescript.md`
- Read and follow `stacks/laravel-react.md` § Frontend
- Feature-based folder structure under `src/features/`
- No `any` in TypeScript — ever
- Server state via React Query only
- Local state via React hooks only
- Zustand only if strictly necessary
- UI components from `ui-kit/components.md`

### UI / Design
- Read and follow `ui-kit/design-system.md`
- Tailwind CSS utility-first
- 8px spacing grid
- Lucide Icons only — consistent stroke width
- Dark mode supported by default

---

## Folder structure to generate

### Laravel API (`/api` or repo root)

```
app/
  Actions/          ← business logic, one class per action
  DTOs/             ← input/output data objects
  Http/
    Controllers/    ← thin, delegates to Actions
    Requests/       ← FormRequest validation
  Models/           ← Eloquent models
  Policies/         ← authorization
  Queries/          ← complex query builders (optional)
routes/
  api.php
tests/
  Feature/
```

### React App (`/frontend` or repo root)

```
src/
  app/              ← router, providers, global setup
  features/
    auth/
    dashboard/
    [entity]/       ← one folder per domain entity
      components/
      hooks/
      pages/
      types.ts
      api.ts
  components/       ← shared UI components
  hooks/            ← shared hooks
  lib/              ← utilities, axios instance, query client
  types/            ← global types
```

---

## How Claude should behave in this project

- Always read `specs/project.md` before generating anything
- Always read the relevant entity spec in `specs/` before generating entity code
- Follow the stack and rules docs — do not invent patterns not defined there
- Generate complete, working files — no `// TODO` stubs unless explicitly asked
- Prefer explicit code over abstractions
- When in doubt, do less and ask rather than assume
