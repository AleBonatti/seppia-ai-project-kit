# Prompt: Generate Entity (Backend + Frontend)

Use this prompt to generate all code for one or more domain entities.
You can either name a specific entity or let Claude discover them automatically.

---

## When to use

- The project scaffold already exists (run `generate-project.md` first)
- You have filled in the relevant `.claude/specs/entities/[entity].md` files
- You want to generate the full backend + frontend for one entity or all remaining entities

---

## Prompt

```text
IMPORTANT: All files you read, create, or modify must be inside this project folder.
Never read files from parent directories or sibling folders. The kit docs listed below
are already present inside this project under .claude/ — read them from there.

Read the following files before doing anything:
- CLAUDE.md
- .claude/specs/project.md
- .claude/specs/style.md
- .claude/stacks/laravel-react.md
- .claude/rules/backend.md
- .claude/rules/frontend.md
- .claude/rules/typescript.md

## Which entity to generate

If this prompt names a specific entity (e.g. "generate the Product entity"), generate that one.

Otherwise, list all files in `.claude/specs/entities/` to discover available entities,
then check `api/database/migrations/` to identify which ones have not been generated yet.
Generate all remaining entities, one at a time, in the order defined in the
"Entity generation order" section of `.claude/specs/project.md`.

For each entity, read its spec file at `.claude/specs/entities/[entity-name].md` before generating.

## Dependency check

Before generating each entity, verify that any entity it depends on (foreign key relationship)
already has a migration file in `api/database/migrations/`. If a dependency is missing,
generate it first, then continue with the originally requested entity.

## Media / Attachment special case

`Media` and `Attachment` entities are NOT generic CRUD entities — do not run them through the
generic Frontend steps below (no `[Entity]ListPage.tsx` built from `EntityListPage.tsx`, no
`[Entity]EditPage.tsx` built from `EntityEditPage.tsx`, no `[Entity]Form.tsx`). A file library
has fundamentally different UI (grid of thumbnails, drag-and-drop upload, detail drawer) that
the generic table/form templates cannot produce.

If the entity being generated is `Media` (or the spec describes a standalone file library):
- Generate the backend normally (migration, model, DTO, Actions, Requests, Controller, Resource,
  Policy, routes, tests) per its spec — Media's backend still follows the standard rules, except
  there is no `Update[Entity]Action` / `UpdateMediaRequest` (Media is immutable after upload; see
  the spec's "no PATCH/update" note).
- For the frontend, copy `.claude/templates/react-app/src/features/media/pages/MediaLibraryPage.tsx`
  verbatim into `src/features/media/pages/MediaLibraryPage.tsx` if it is not already present, then
  wire the placeholder data to real `useMediaList` / `useUploadMedia` / `useDeleteMedia` hooks.
- Do not generate a `MediaForm.tsx` or `MediaEditPage.tsx`.

If the entity being generated is `Attachment` (or the spec describes a pivot linking another
entity to Media, e.g. `page_id` + `media_id`):
- There is no standalone Attachment list/edit page. Generate the backend (model, DTO, Actions,
  Requests, Controller, Resource, Policy, routes) per its spec, but skip the frontend
  `[Entity]ListPage.tsx` / `[Entity]EditPage.tsx` / `[Entity]Form.tsx` steps entirely.
- Instead, ensure the owning entity's edit page (e.g. `PageEditPage.tsx`) includes the
  `AttachmentManager` component from `.claude/templates/react-app/src/components/ui/AttachmentManager.tsx`
  (drop-zone + thumbnail grid + detail drawer), wired to `use[Owner]` for the current attachments
  and to `useCreateAttachment` / `useDeleteAttachment` (or `useDetachAttachment`) mutations.

For every other entity, generate all backend and frontend code as described below and in its spec file.

## Backend — generate these files (inside api/)

1. `database/migrations/[timestamp]_create_[entities]_table.php`
   - All columns from the spec
   - Foreign keys with proper indexes
   - Soft deletes if specified in the spec

2. `app/Models/[Entity].php`
   - $fillable with all writable fields
   - $casts for dates, booleans, enums
   - All relationships from the spec
   - Scopes if needed

3. `app/DTOs/[Entity]/[Entity]Data.php`
   - All input fields as readonly constructor properties
   - fromRequest() static factory
   - fromArray() static factory for tests

4. `app/Actions/[Entity]/Create[Entity]Action.php`
5. `app/Actions/[Entity]/Update[Entity]Action.php`
6. `app/Actions/[Entity]/Delete[Entity]Action.php`
   - Any additional actions from business rules in the spec

7. `app/Http/Requests/Store[Entity]Request.php`
8. `app/Http/Requests/Update[Entity]Request.php`
   - Validation rules matching the spec fields

9. `app/Http/Controllers/[Entity]Controller.php`
   - index, show, store, update, destroy methods
   - Thin — delegates to Actions

10. `app/Http/Resources/[Entity]Resource.php`
    - All fields from the spec
    - Nested resources for relationships

11. `app/Policies/[Entity]Policy.php`
    - viewAny, view, create, update, delete
    - Permissions as defined in the spec

12. Routes to add in `routes/api.php`:
    - Resource routes for the entity
    - Any custom routes from the spec

13. `tests/Feature/[Entity]/[Entity]CrudTest.php`
    - Tests for: list, show, create, update, delete
    - Tests for validation errors
    - Tests for authorization (forbidden cases)

## Frontend — generate these files (inside frontend/)

> Skip this entire section for `Media` and `Attachment` — see "Media / Attachment special case" above.

1. `src/features/[entity]/types.ts`
   - [Entity] interface matching all spec fields (camelCase)
   - [Entity]Payload interface for create/update forms
   - Status enum types if applicable

2. `src/features/[entity]/api.ts`
   - list(), show(), create(), update(), delete() functions
   - Typed with interfaces from types.ts

3. `src/features/[entity]/hooks/use[Entity]List.ts`
4. `src/features/[entity]/hooks/use[Entity].ts`
5. `src/features/[entity]/hooks/useCreate[Entity].ts`
6. `src/features/[entity]/hooks/useUpdate[Entity].ts`
7. `src/features/[entity]/hooks/useDelete[Entity].ts`

8. `src/features/[entity]/components/[Entity]Form.tsx`
   - React Hook Form + Zod validation
   - All fields from the spec
   - Works for both create and edit (optional id prop)

9. `src/features/[entity]/components/[Entity]Table.tsx`
   - Columns from the spec's "List page" section
   - Pagination controls
   - Row actions (edit, delete)

10. `src/features/[entity]/pages/[Entity]ListPage.tsx`
    - Start from `.claude/templates/react-app/src/features/entity/pages/EntityListPage.tsx`
    - Replace "Entity/entity/entities" with the real entity name throughout
    - Adapt columns, filter tabs, and badge logic to match the entity spec
    - Wire the placeholder data to the real `use[Entity]List` hook

11. `src/features/[entity]/pages/[Entity]CreatePage.tsx` (if in spec)
12. `src/features/[entity]/pages/[Entity]EditPage.tsx`
    - Start from `.claude/templates/react-app/src/features/entity/pages/EntityEditPage.tsx`
    - Replace "Entity/entity" with the real entity name throughout
    - Add/remove cards in left and right columns to match the entity spec fields
    - Wire to the real `use[Entity]` and `use[Entity]Form` hooks

## Rules

- Follow all rules in .claude/rules/backend.md and .claude/rules/frontend.md
- Generate complete, working files — no stubs or TODOs
- Use explicit types everywhere — no `any`
- Business rules from the spec must be implemented in Actions, not controllers
- Permissions from the spec must be implemented in the Policy
- Match the UI style described in .claude/specs/style.md

## After generating all files

Run the migration immediately:

```bash
cd api && php artisan migrate
```

Then confirm the new table exists and the migration ran without errors before reporting done.

```

---

## After running this prompt

For each generated entity:

1. Add its routes to `frontend/src/app/router.tsx`
2. Add it to `frontend/src/components/layout/Sidebar.tsx`
3. Register its Policy in `api/app/Providers/AuthServiceProvider.php`
4. Run migrations: `cd api && php artisan migrate`
5. Run tests: `cd api && php artisan test --filter=[Entity]`
