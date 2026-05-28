# Seppia AI Project Kit — Master Guide

This file is the entry point for Claude Code when working on any project generated from this kit.

Copy this file into the root of every new project repo.
Claude Code will read it automatically at session start.

---

## What this kit is

A set of markdown documents that define:
- **How to write code** (`.claude/rules/`)
- **What the project is** (`.claude/specs/`)
- **Which tech stack to use** (`.claude/stacks/`)
- **What the UI looks like** (`.claude/ui-kit/`)

This is NOT a framework. There is no runtime dependency on this kit.
The kit exists only to give Claude consistent instructions.

---

## How to use this kit in a new project

1. Create a new repo for the project
2. Copy into it:
   - `CLAUDE.md` (this file) → place at the repo root
   - `.claude/stacks/laravel-react.md`
   - `.claude/rules/backend.md`
   - `.claude/rules/frontend.md`
   - `.claude/rules/typescript.md`
   - `.claude/ui-kit/design-system.md`
   - `.claude/ui-kit/components.md`
   - `.claude/specs/project.md` ← **fill this in for the specific project**
3. For each domain entity, copy `.claude/specs/entity.md` from the kit into `.claude/specs/entities/[entity-name].md` and fill it in
   - Example: `.claude/specs/entities/product.md`, `.claude/specs/entities/order.md`
   - The original `.claude/specs/entity.md` in the kit is a blank template — never copy it as-is
4. Open Claude Code in the new project
5. Use the prompts in the kit's `.claude/prompts/` to start generating code

---

## Project context (fill in per project)

> When copying this file into a new project, replace this section with the project name and a one-line description.

**Project:** _[project name]_
**Description:** _[one sentence about what this project does]_
**Stack:** Laravel API + React SPA (TypeScript)
**Spec file:** `.claude/specs/project.md`

---

## Rules Claude must always follow

When generating or modifying code in this project:

### Backend (Laravel)
- Read and follow `.claude/rules/backend.md`
- Read and follow `.claude/stacks/laravel-react.md` § Backend
- Controllers must be thin — no business logic
- All business logic lives in `api/app/Actions/`
- All input/output passes through DTOs in `api/app/DTOs/`
- Validation lives in `api/app/Http/Requests/`
- Authorization lives in `api/app/Policies/`
- No dynamic schema systems, no JSON-driven entities
- Use Pest PHP for tests — feature tests preferred

### Frontend (React + TypeScript)
- Read and follow `.claude/rules/frontend.md`
- Read and follow `.claude/rules/typescript.md`
- Read and follow `.claude/stacks/laravel-react.md` § Frontend
- Feature-based folder structure under `frontend/src/features/`
- No `any` in TypeScript — ever
- Server state via React Query only
- Local state via React hooks only
- Zustand only if strictly necessary
- UI components from `.claude/ui-kit/components.md`

### UI / Design
- Read and follow `.claude/ui-kit/design-system.md`
- Tailwind CSS utility-first
- 8px spacing grid
- Lucide Icons only — consistent stroke width
- Dark mode supported by default

---

## Project structure

```text
project-root/
  CLAUDE.md                 ← this file (Claude reads it automatically)
  .claude/
    stacks/
      laravel-react.md      ← stack definition + code patterns
    rules/
      backend.md
      frontend.md
      typescript.md
    ui-kit/
      design-system.md
      components.md
    specs/
      project.md            ← filled in: what this project is
      entities/
        [entity].md         ← one per domain entity, filled in
  api/                      ← Laravel application (generated)
  frontend/                 ← React application (generated)
```

---

## How Claude should behave in this project

- Always read `.claude/specs/project.md` before generating anything
- Always read the relevant entity spec in `.claude/specs/entities/` before generating entity code
- Follow the stack and rules docs — do not invent patterns not defined there
- Generate complete, working files — no `// TODO` stubs unless explicitly asked
- Prefer explicit code over abstractions
- When in doubt, do less and ask rather than assume
