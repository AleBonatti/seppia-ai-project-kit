# Prompt: Generate Project Scaffold

Use this prompt at the start of a new project to bootstrap and scaffold everything from zero.

---

## When to use

- You have a new, empty project repo (just `CLAUDE.md` and the `.claude/` kit files — nothing else)
- You have filled in `.claude/specs/project.md`
- You have NOT yet run `composer` or `npm` — this prompt handles that too
- Run this once, at the very beginning, before `generate-entity.md`

---

## Prompt

````text
Read the following files before doing anything:
- CLAUDE.md
- .claude/specs/project.md
- .claude/stacks/laravel-react.md
- .claude/rules/backend.md
- .claude/rules/frontend.md
- .claude/rules/typescript.md
- .claude/ui-kit/design-system.md
- .claude/ui-kit/components.md
- .claude/templates/laravel-api/ (all files)
- .claude/templates/react-app/ (all files)
- .claude/templates/admin-layout/ (all files)
- jsx/SeppiaCms.html (visual reference — read the CSS tokens and component HTML structure)
- jsx/hf-pages.jsx (visual reference — read the page layouts and component patterns)

The templates are reference implementations — generate the project files to match them exactly,
adapting only what the project spec requires (project name, entity names, nav items, etc.).
The jsx files are the visual source of truth — all generated UI must match their look and feel.

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
````

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
  @hugeicons/react \
  clsx \
  tailwind-merge
npm install -D \
  tailwindcss \
  @tailwindcss/vite \
  autoprefixer \
  @types/node
```

### 0c. Configure Tailwind and design tokens

In `frontend/vite.config.ts`, add the Tailwind Vite plugin.

In `frontend/src/index.css`, replace the contents with the full CSS token block from
`.claude/ui-kit/design-system.md` § Color tokens — this includes `@import "tailwindcss"`,
the `:root` accent/radius/sidebar-width vars, and the `html[data-theme]` dark/light palettes.

In `frontend/index.html`, add the Figtree Google Font link tags inside `<head>` as documented
in `.claude/ui-kit/design-system.md` § Font. Also set `data-theme="dark"` on `<html>` as the
default so the page loads with the correct colors before JavaScript runs.

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
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=
    DB_USERNAME=
    DB_PASSWORD=

    FRONTEND_URL=http://localhost:5173
    SESSION_DRIVER=cookie
    SESSION_DOMAIN=localhost
    SANCTUM_STATEFUL_DOMAINS=localhost:5173

    MAIL_MAILER=log
    MAIL_FROM_ADDRESS=noreply@localhost
    MAIL_FROM_NAME="${APP_NAME}"
    ```

    `MAIL_MAILER=log` writes emails to `storage/logs/laravel.log` in development so
    password reset links are visible without configuring a real mail provider.

    Leave `DB_DATABASE`, `DB_USERNAME`, and `DB_PASSWORD` blank for now — they will be
    filled in interactively in Phase 3.

3. `.env.example` — same keys as `.env` but with blank sensitive values

### Auth

4. `app/Models/User.php` — add `role` column to `$fillable` and `$casts`;
   add `isSuperAdmin(): bool` and `isAdmin(): bool` helper methods;
   role values: `admin` and `user` (or as defined in `.claude/specs/project.md`)

5. `database/migrations/[timestamp]_add_role_to_users_table.php` — add `role` string column,
   default `'user'`, after `email`

6. `app/Http/Controllers/AuthController.php` — `login()`, `logout()`, `me()` using Sanctum;
   login returns the authenticated user resource

7. `app/Http/Controllers/PasswordResetController.php` — two methods using Laravel's built-in
   Password broker (no extra packages):
   - `sendResetLink(Request $request)`: validates `email`, calls `Password::sendResetLink()`,
     returns 200 on success or 422 with the error message on failure
   - `reset(Request $request)`: validates `token`, `email`, `password`, `password_confirmation`,
     calls `Password::reset()` with a closure that updates the user's password and fires
     `PasswordReset` event, returns 200 on success or 422 on failure

8. `app/Http/Requests/LoginRequest.php` — validate `email` and `password`

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

9. `routes/api.php` — auth routes (login, logout, me, forgot-password, reset-password) + one commented placeholder
   `Route::apiResource` for each entity in `.claude/specs/project.md`

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
    - `/forgot-password` → `ForgotPasswordPage` (lazy)
    - `/reset-password` → `ResetPasswordPage` (lazy)
    - `/admin` → `AdminLayout` wrapped in `AuthGuard`, with `Outlet` for children
      - index route → redirect to `/admin/dashboard`
      - `/admin/dashboard` → `DashboardPage` (lazy)
      - a `{ path: '*', element: <ComingSoonPage /> }` catch-all as the last child —
        this handles every sidebar link before its real page is generated.
        Do NOT add individual entity routes here — the catch-all covers all of them.
    - `*` → redirect to `/admin/dashboard`

   Also generate `src/features/coming-soon/ComingSoonPage.tsx` — a simple placeholder
   that reads the current path with `useLocation()`, derives the section name from it,
   and shows a "not generated yet" message.

### Auth feature

8. `src/features/auth/types.ts` — `AuthUser`, `UserRole`, `LoginPayload`,
   `ForgotPasswordPayload`, `ResetPasswordPayload`

9. `src/features/auth/api.ts` — `authApi.login()`, `authApi.logout()`, `authApi.me()`,
   `authApi.forgotPassword()`, `authApi.resetPassword()`

10. `src/features/auth/hooks/useAuth.ts` — React Query hook, `staleTime: Infinity`

11. `src/features/auth/hooks/useLogin.ts` — mutation, sets query data on success, navigates to `/admin/dashboard`

12. `src/features/auth/hooks/useLogout.ts` — mutation, clears query cache, navigates to `/login`

13. `src/features/auth/hooks/useForgotPassword.ts` — mutation, on success shows a confirmation
    message ("Check your email for a reset link") in the same page

14. `src/features/auth/hooks/useResetPassword.ts` — mutation, reads `token` and `email` from
    URL query params, on success navigates to `/login` with a success message

15. `src/features/auth/components/AuthGuard.tsx` — renders children if authenticated,
    redirects to `/login` while loading shows a full-screen spinner

16. `src/features/auth/pages/LoginPage.tsx` — email + password form, uses `useLogin`,
    includes a "Forgot password?" link to `/forgot-password`,
    styled to match the UI style from `.claude/specs/project.md`

17. `src/features/auth/pages/ForgotPasswordPage.tsx` — single email field, uses
    `useForgotPassword`, shows inline confirmation on success instead of redirecting

18. `src/features/auth/pages/ResetPasswordPage.tsx` — password + password_confirmation fields,
    reads `token` and `email` from URL query params (Laravel appends these to the reset link),
    uses `useResetPassword`

### Layout

Generate these files by following `.claude/templates/admin-layout/` exactly, and use
`jsx/SeppiaCms.html` as the visual reference for colors, spacing, and structure.

19. `src/components/layout/AdminLayout.tsx` — CSS Grid shell (`grid-template-columns: var(--sb-w) 1fr`);
    apply stored theme before first render at module level:
    `document.documentElement.setAttribute('data-theme', localStorage.getItem('theme') ?? 'dark')`

20. `src/components/layout/Sidebar.tsx` — brand area, nav groups with group labels, nav items
    with active accent highlight, collapsible (comfortable ↔ icon-only), user card with
    dropdown containing theme toggle and logout;
    navigation items from `.claude/specs/project.md`; project name from spec as the brand label;
    uses `useTheme` and `useLogout`

21. `src/components/layout/Breadcrumb.tsx` — derives breadcrumb items from current route path;
    sits at top of main column above page content; home icon + path segments + separators

22. `src/components/layout/useTheme.ts` — manages `data-theme` attribute on `<html>`;
    default dark; persists to `localStorage` under key `theme`; exports `{ theme, toggle }`

### Base UI components

Generate complete, working implementations for all of these in `src/components/ui/`.
Follow `.claude/ui-kit/components.md` for props and styling. Use CSS var tokens
(`bg-[--box]`, `text-[--ink]`, etc.) — never hardcode hex colors. Use `@hugeicons/react`
for all icons. Visual reference: `jsx/SeppiaCms.html`.

23. `Button.tsx` — variants: `primary`, `secondary`, `danger`, `ghost`; sizes: `sm`, `md`, `lg`;
    `isLoading` prop shows a spinner; primary uses `bg-[--accent] text-[--accent-ink]`

24. `Input.tsx` — `label`, `error`, `hint` props; forwards ref;
    field styling: `bg-[--field] border-[--field-border] focus:border-[--accent]`

25. `Textarea.tsx` — same interface as Input

26. `Select.tsx` — `label`, `error`, `options: { value, label }[]` props

27. `Card.tsx` — `title`, `description`, `footer`, `children`; `bg-[--box] border-[--border] rounded-xl`

28. `Badge.tsx` — variants: `success`, `warning`, `error`, `info`, `neutral`;
    colors from semantic palette in `design-system.md`

29. `Chip.tsx` — filter toggle; `active` prop switches to `bg-[--accent] text-[--accent-ink]`;
    optional `count` badge

30. `Avatar.tsx` — initials circle; sizes: `sm` (28px), `md` (34px), `lg` (80px);
    `bg-[--accent] text-[--accent-ink]`

31. `Table.tsx` — composable: `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`;
    rows: `hover:bg-[--surface-2]`; dividers: `divide-y divide-[--border-soft]`

32. `Tabs.tsx` — underline style; `tabs`, `active`, `onChange` props;
    active tab: `border-b-2 border-[--accent] text-[--accent]`

33. `Breadcrumb.tsx` — `items: { label, href?, icon? }[]`; last item non-linked

34. `Modal.tsx` — controlled; backdrop `bg-black/60`; panel `bg-[--box] border-[--border] rounded-xl`

35. `Spinner.tsx` — sizes: `sm`, `md`, `lg`

36. `EmptyState.tsx` — `icon`, `title`, `description`, `action` props

37. `Pagination.tsx` — `currentPage`, `totalPages`, `onPageChange`;
    active page: `bg-[--accent] text-[--accent-ink]`

38. `PageHeader.tsx` — `title`, `description`, `action`, optional `backHref` props;
    back button uses `ArrowLeft01Icon` from `@hugeicons/react`

39. `StatCard.tsx` — `label`, `value`, `icon`, optional `delta` and `deltaUp`;
    icon container: `bg-[--accent]/15 text-[--accent]`

40. `SaveBar.tsx` — sticky bottom bar; `lastSaved`, `onSave`, `onDiscard`, `isLoading` props

41. `Dropzone.tsx` — drag-and-drop file upload area; drag-over state: `border-[--accent] bg-[--accent]/5`

### Dashboard placeholder

30. `src/features/dashboard/pages/DashboardPage.tsx` — a minimal page with a welcome message
    and `PageHeader`; no data fetching — just a static placeholder to confirm routing works

---

## Phase 3 — Wire up Laravel config

### 3a. Collect database credentials

Before running any artisan commands, prompt the user for their local database details:

```
Ask the user:
  "What is your database name? (DB_DATABASE)"
  "What is your database username? (DB_USERNAME)"
  "What is your database password? (DB_PASSWORD, press Enter for empty)"
```

Then write the answers into `api/.env`, replacing the blank values set in Phase 1:

```bash
# Example — use the actual values provided by the user:
sed -i '' "s/^DB_DATABASE=.*/DB_DATABASE=my_project/" api/.env
sed -i '' "s/^DB_USERNAME=.*/DB_USERNAME=root/" api/.env
sed -i '' "s/^DB_PASSWORD=.*/DB_PASSWORD=secret/" api/.env
```

Also update `api/.env` to remove any SQLite remnants:

```bash
sed -i '' "s/^DB_CONNECTION=.*/DB_CONNECTION=mysql/" api/.env
```

### 3b. Generate key, migrate, and link storage

Run these commands from `api/`:

```bash
php artisan key:generate
php artisan migrate
php artisan storage:link
```

### 3c. Seed the default admin user

Create `database/seeders/AdminUserSeeder.php` with one default admin user:

- name: Admin
- email: la.seppia@gmail.com
- password: `password` (hashed with bcrypt)
- role: `admin` (or `superadmin` if the project defines that role)

Run: `php artisan db:seed --class=AdminUserSeeder`

---

## Rules

- Follow all rules in `.claude/rules/backend.md`, `.claude/rules/frontend.md`, `.claude/rules/typescript.md`
- Generate complete, working files — no stubs or TODOs
- Use the entity names and UI style from `.claude/specs/project.md` throughout
- After completing all phases, confirm:
    1. That migrations ran successfully
    2. The URL to open: `http://localhost:5173/login`
    3. The default admin credentials from the seeder

```

---

## After running this prompt

1. Start the Laravel dev server: `cd api && php artisan serve`
2. Start the React dev server: `cd frontend && npm run dev`
3. Open <http://localhost:5173/login> — you should see the login page
4. Log in with the seeded admin credentials
5. Then run `generate-entity.md` for each entity in your project
```
