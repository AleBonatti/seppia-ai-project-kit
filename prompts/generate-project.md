# Prompt: Generate Project Scaffold

Use this prompt at the start of a new project to bootstrap and scaffold everything from zero.

---

## When to use

- You have a new, empty project repo (just the kit `.md` files — nothing else)
- You have filled in `specs/project.md`
- You have NOT yet run `composer` or `npm` — this prompt handles that too
- Run this once, at the very beginning, before `generate-entity.md`

---

## Prompt

```text
Read the following files before doing anything:
- CLAUDE.md
- specs/project.md
- stacks/laravel-react.md
- rules/backend.md
- rules/frontend.md
- rules/typescript.md

Then bootstrap and scaffold the full project from zero.
Work through the phases below in order. Do not skip any phase.

---

## Phase 0 — Install Laravel and React

### 0a. Install Laravel in the `api/` folder

Run these commands from the project root:

```bash
composer create-project laravel/laravel api
cd api
composer require laravel/sanctum
composer require spatie/laravel-query-builder
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### 0b. Install React in the `frontend/` folder

Run these commands from the project root:

```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install \
  @tanstack/react-query \
  axios \
  react-router-dom \
  react-hook-form \
  @hookform/resolvers \
  zod \
  lucide-react \
  clsx \
  tailwind-merge
npm install -D \
  tailwindcss \
  @tailwindcss/vite \
  autoprefixer \
  @types/node
```

### 0c. Configure Tailwind

In `frontend/vite.config.ts`, add the Tailwind Vite plugin.
In `frontend/src/index.css`, replace the contents with:
```css
@import "tailwindcss";
```

### 0d. Configure Vite path alias

In `frontend/vite.config.ts`, add the `@` alias pointing to `src/`:
```ts
resolve: { alias: { '@': path.resolve(__dirname, 'src') } }
```

In `frontend/tsconfig.app.json`, add:
```json
"paths": { "@/*": ["./src/*"] }
```

---

## Phase 1 — Laravel application files

Generate these files inside `api/`:

### Configuration

1. `config/cors.php` — allow requests from `http://localhost:5173` and the `FRONTEND_URL` env var;
   `supports_credentials: true` for Sanctum cookie auth

2. `.env` (update, do not replace) — set:
   ```
   FRONTEND_URL=http://localhost:5173
   SESSION_DRIVER=cookie
   SESSION_DOMAIN=localhost
   SANCTUM_STATEFUL_DOMAINS=localhost:5173
   ```

3. `.env.example` — same keys as `.env` but with blank sensitive values

### Auth

4. `app/Models/User.php` — add `role` column to `$fillable` and `$casts`;
   add `isSuperAdmin(): bool` and `isAdmin(): bool` helper methods;
   role values: `admin` and `user` (or as defined in specs/project.md)

5. `database/migrations/[timestamp]_add_role_to_users_table.php` — add `role` string column,
   default `'user'`, after `email`

6. `app/Http/Controllers/AuthController.php` — `login()`, `logout()`, `me()` using Sanctum;
   login returns the authenticated user resource

7. `app/Http/Requests/LoginRequest.php` — validate `email` and `password`

### Directory structure

Create all empty directories (with `.gitkeep`) for:
```
app/Actions/
app/DTOs/
app/Queries/
app/Policies/
app/Http/Resources/
tests/Feature/
```

### Routes

8. `routes/api.php` — auth routes (login, logout, me) + one commented placeholder
   `Route::apiResource` for each entity in specs/project.md

---

## Phase 2 — React application files

Generate these files inside `frontend/src/`:

### Foundation

1. `src/types/api.ts` — `ApiResponse<T>`, `PaginatedResponse<T>`, `PaginationMeta`, `ApiError`

2. `src/lib/axios.ts` — axios instance:
   - `baseURL` from `import.meta.env.VITE_API_URL` (default `http://localhost:8000/api/v1`)
   - `withCredentials: true` and `withXSRFToken: true` for Sanctum
   - response interceptor: redirect to `/login` on 401

3. `src/lib/utils.ts` — `cn()` helper using `clsx` + `tailwind-merge`

4. `src/app/queryClient.ts` — React Query client with sensible defaults

5. `frontend/.env.example`:
   ```
   VITE_API_URL=http://localhost:8000/api/v1
   ```

### App shell

6. `src/app/App.tsx` — `RouterProvider` + `QueryClientProvider`

7. `src/app/router.tsx` — routes:
   - `/login` → `LoginPage` (lazy)
   - `/admin` → `AdminLayout` wrapped in `AuthGuard`, with `Outlet` for children
   - `/admin/dashboard` → placeholder `DashboardPage`
   - One commented placeholder route per entity from specs/project.md
   - `*` → redirect to `/admin`

### Auth feature

8. `src/features/auth/types.ts` — `AuthUser`, `UserRole`, `LoginPayload`

9. `src/features/auth/api.ts` — `authApi.login()`, `authApi.logout()`, `authApi.me()`

10. `src/features/auth/hooks/useAuth.ts` — React Query hook, `staleTime: Infinity`

11. `src/features/auth/hooks/useLogin.ts` — mutation, sets query data on success, navigates to `/admin/dashboard`

12. `src/features/auth/hooks/useLogout.ts` — mutation, clears query cache, navigates to `/login`

13. `src/features/auth/components/AuthGuard.tsx` — renders children if authenticated,
    redirects to `/login` while loading shows a full-screen spinner

14. `src/features/auth/pages/LoginPage.tsx` — email + password form, uses `useLogin`,
    styled to match the UI style from specs/project.md

### Layout

15. `src/components/layout/AdminLayout.tsx` — `Sidebar` + `Topbar` + `<Outlet />`

16. `src/components/layout/Sidebar.tsx` — navigation items from specs/project.md (entities + dashboard);
    active route highlighted; project name from specs/project.md as the logo/title

17. `src/components/layout/Topbar.tsx` — logged-in user name + logout button

### Base UI components

Generate complete, working implementations for all of these in `src/components/ui/`:

18. `Button.tsx` — variants: `primary`, `secondary`, `danger`, `ghost`; sizes: `sm`, `md`, `lg`;
    `isLoading` prop shows a spinner and disables the button

19. `Input.tsx` — `label`, `error`, `hint` props; forwards ref; full dark mode support

20. `Textarea.tsx` — same interface as Input

21. `Select.tsx` — `label`, `error`, `options: { value, label }[]` props

22. `Card.tsx` — `title`, `description`, `footer`, `children` props

23. `Badge.tsx` — variants: `success`, `warning`, `error`, `info`, `neutral`

24. `Table.tsx` — composable: `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`

25. `Modal.tsx` — controlled (`isOpen`, `onClose`); `title`, `description`, `footer`, `children`

26. `Spinner.tsx` — sizes: `sm`, `md`, `lg`

27. `EmptyState.tsx` — `icon`, `title`, `description`, `action` props

28. `Pagination.tsx` — `currentPage`, `totalPages`, `onPageChange`; shows prev/next + page numbers

29. `PageHeader.tsx` — `title`, `description`, `action` props; used at the top of every admin page

### Dashboard placeholder

30. `src/features/dashboard/pages/DashboardPage.tsx` — a minimal page with a welcome message
    and `PageHeader`; no data fetching — just a static placeholder to confirm routing works

---

## Phase 3 — Wire up Laravel config

Run these commands from `api/`:

```bash
php artisan key:generate
php artisan migrate
php artisan storage:link
```

Then create a seeder `database/seeders/AdminUserSeeder.php` that creates one default admin user:
- name: Admin
- email: admin@example.com
- password: password (hashed)
- role: admin (or superadmin if the project has that role)

Run: `php artisan db:seed --class=AdminUserSeeder`

---

## Rules

- Follow all rules in rules/backend.md, rules/frontend.md, rules/typescript.md
- Generate complete, working files — no stubs or TODOs
- Use the entity names and UI style from specs/project.md throughout
- After completing all phases, tell me:
  1. Any commands that need to be run manually (e.g. database config)
  2. The URL to open to verify everything works: `http://localhost:5173/login`
  3. The default admin credentials from the seeder
```

---

## After running this prompt

1. Configure your local database in `api/.env` (DB_DATABASE, DB_USERNAME, DB_PASSWORD)
2. Start the Laravel dev server: `cd api && php artisan serve`
3. Start the React dev server: `cd frontend && npm run dev`
4. Open `http://localhost:5173/login` — you should see the login page
5. Log in with the seeded admin credentials
6. Then run `generate-entity.md` for each entity in your project
