# Prompt: Generate Project Scaffold

Use this prompt at the start of a new project to generate the initial structure.

---

## When to use

- You have filled in `specs/project.md`
- You want Claude to scaffold the full project structure before writing individual entities
- Run this once, at the beginning, before `generate-entity.md`

---

## Prompt

```
Read the following files before doing anything:
- CLAUDE.md
- specs/project.md
- stacks/laravel-react.md
- rules/backend.md
- rules/frontend.md
- rules/typescript.md

Then generate the initial project scaffold for the Laravel API + React SPA stack.

## What to generate

### Laravel API

1. Directory structure (create all folders listed in stacks/laravel-react.md)
2. `routes/api.php` — base route file with auth routes and a placeholder for each entity listed in specs/project.md
3. `app/Http/Controllers/AuthController.php` — login, logout, me endpoints using Sanctum
4. `app/Models/User.php` — with role enum cast, fillable fields
5. `database/migrations/[timestamp]_create_users_table.php` — with role column
6. `config/cors.php` — configured for SPA frontend on localhost:5173
7. `.env.example` — with all required keys (APP_*, DB_*, FRONTEND_URL)

### React App

1. Directory structure (create all folders listed in stacks/laravel-react.md)
2. `src/app/App.tsx` — router setup with React Router v6, QueryClientProvider, protected routes
3. `src/app/router.tsx` — route definitions (admin layout route + auth routes + placeholder entity routes)
4. `src/app/queryClient.ts` — React Query client config
5. `src/lib/axios.ts` — configured axios instance with base URL from env, CSRF handling for Sanctum
6. `src/types/api.ts` — shared API response types (ApiResponse<T>, PaginatedResponse<T>)
7. `src/features/auth/` — complete auth feature: LoginPage, useLogin hook, useAuth hook, auth types
8. `src/components/layout/AdminLayout.tsx` — sidebar + topbar shell
9. `src/components/layout/Sidebar.tsx` — navigation using the entities from specs/project.md
10. `src/components/layout/Topbar.tsx` — user menu, logout button
11. `src/components/ui/` — base components: Button, Input, Card, Badge, Spinner, Table

## Rules

- Follow all rules in rules/backend.md and rules/frontend.md
- Follow TypeScript rules in rules/typescript.md
- Generate complete, working files — no stubs or TODOs
- Keep code explicit and readable
- Use the entity names from specs/project.md for the sidebar navigation
- Match the UI style described in specs/project.md
```

---

## After running this prompt

Once the scaffold is generated:

1. Review the folder structure and base files
2. Run `generate-entity.md` for each entity listed in `specs/project.md`
3. Wire up entity routes in `routes/api.php` and `src/app/router.tsx`
