# Prompt: Generate Dashboard

Use this prompt to generate the admin dashboard page from the project's dashboard spec.

---

## When to use

- The project scaffold already exists (run `generate-project.md` first)
- You have filled in `.claude/specs/dashboard.md`
- You want to replace the placeholder `DashboardPage` with the real dashboard

---

## Prompt

```text
IMPORTANT: All files you read, create, or modify must be inside this project folder.
Never read files from parent directories or sibling folders. The kit docs listed below
are already present inside this project under .claude/ — read them from there.

Read the following files before doing anything:
- CLAUDE.md
- .claude/specs/project.md
- .claude/specs/dashboard.md
- .claude/stacks/laravel-react.md
- .claude/rules/backend.md
- .claude/rules/frontend.md
- .claude/rules/typescript.md
- .claude/ui-kit/components.md

Generate the admin dashboard as described in `.claude/specs/dashboard.md`.

## Backend — generate these files (inside api/)

1. `app/Http/Controllers/DashboardController.php`
   - Single `index()` method returning all dashboard data in one response
   - Thin — delegates counting/querying to the Action
   - Protected by `auth:sanctum` middleware

2. `app/Actions/Dashboard/GetDashboardStatsAction.php`
   - Runs all COUNT queries and recent-item queries defined in the spec
   - Returns a plain array or DTO with all stats and recent items

3. Route to add in `routes/api.php`:
   - `GET /api/v1/admin/dashboard` → `DashboardController@index`
   - Protected by `auth:sanctum`

## Frontend — generate these files (inside frontend/)

1. `src/features/dashboard/types.ts`
   - `DashboardStats` interface matching the API response shape

2. `src/features/dashboard/api.ts`
   - `getDashboardStats()` function calling `/api/v1/admin/dashboard`

3. `src/features/dashboard/hooks/useDashboardStats.ts`
   - `useQuery` hook wrapping `getDashboardStats()`
   - Query key: `['dashboard', 'stats']`

4. `src/features/dashboard/pages/DashboardPage.tsx`
   - Replace the existing placeholder file
   - Stats row at the top using `StatCard` components from `@/components/ui/StatCard`
   - One section per recent-activity feed defined in the spec (small table or list)
   - Quick-action buttons if defined in the spec
   - Use `PageHeader` from `@/components/ui/PageHeader` for the page title
   - Handle `isLoading` and `isError` states

## Rules

- Follow all rules in .claude/rules/backend.md and .claude/rules/frontend.md
- Generate complete, working files — no stubs or TODOs
- Use explicit types everywhere — no `any`
- Use only components from .claude/ui-kit/components.md
- Server data via React Query only — no useEffect fetching
```

---

## After running this prompt

1. Verify the dashboard route is registered in `routes/api.php`
2. Run `cd api && php artisan route:list | grep dashboard` to confirm
3. Open `http://localhost:5173/admin/dashboard` to see the result
