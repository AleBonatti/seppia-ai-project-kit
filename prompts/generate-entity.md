# Prompt: Generate Entity (Backend + Frontend)

Use this prompt to generate all code for a single domain entity.

---

## When to use

- The project scaffold already exists (run `generate-project.md` first)
- You have filled in `specs/entities/[entity].md`
- You want to generate the full backend + frontend for one entity

---

## Prompt

```text
Read the following files before doing anything:
- CLAUDE.md
- specs/project.md
- specs/entities/[ENTITY_NAME].md   ← replace with the actual entity file
- stacks/laravel-react.md
- rules/backend.md
- rules/frontend.md
- rules/typescript.md

Generate all backend and frontend code for the [ENTITY_NAME] entity
as described in its spec file.

## Backend — generate these files

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

## Frontend — generate these files

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
   - Works for both create and edit (optional postId prop)

9. `src/features/[entity]/components/[Entity]Table.tsx`
   - Columns from the spec's "List page" section
   - Pagination controls
   - Row actions (edit, delete)

10. `src/features/[entity]/pages/[Entity]ListPage.tsx`
    - AdminLayout wrapper
    - [Entity]Table with pagination
    - "Create new" button linking to create page
    - Filters defined in the spec

11. `src/features/[entity]/pages/[Entity]CreatePage.tsx` (if in spec)
12. `src/features/[entity]/pages/[Entity]EditPage.tsx`
    - AdminLayout wrapper
    - [Entity]Form pre-filled with existing data

## Rules

- Follow all rules in rules/backend.md and rules/frontend.md
- Generate complete, working files — no stubs or TODOs
- Use explicit types everywhere — no `any`
- Business rules from the spec must be implemented in Actions, not controllers
- Permissions from the spec must be implemented in the Policy
- Match the UI style described in specs/project.md
```

---

## After running this prompt

1. Add the new entity routes to `src/app/router.tsx`
2. Add the new entity to the `Sidebar.tsx` navigation
3. Register the Policy in `AuthServiceProvider`
4. Run migrations: `php artisan migrate`
5. Run tests: `php artisan test --filter=[Entity]`
