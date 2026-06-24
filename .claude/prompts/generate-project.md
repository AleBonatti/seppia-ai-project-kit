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
IMPORTANT: All files you read, create, or modify must be inside this project folder.
Never read files from parent directories or sibling folders. The kit docs listed below
are already present inside this project under .claude/ — read them from there.

Read the following files before doing anything:
- CLAUDE.md
- .claude/specs/project.md
- .claude/specs/style.md
- .claude/specs/auth.md
- .claude/stacks/laravel-react.md
- .claude/rules/backend.md
- .claude/rules/frontend.md
- .claude/rules/typescript.md
- .claude/ui-kit/design-system.md
- .claude/ui-kit/components.md
- .claude/templates/laravel-api/ (all files)
- .claude/templates/react-app/ (all files)

The templates are the source of truth — copy them exactly, adapting only what the project spec
requires (project name, entity names, nav items, etc.).

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
  @hugeicons/core-free-icons \
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

In `frontend/src/index.css`, copy the contents of `.claude/templates/react-app/src/index.css`
exactly — do not paraphrase or reconstruct it.

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

    ```env
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

Generate all auth files as described in `.claude/specs/auth.md`. That document is the single
source of truth for the auth system — follow it exactly. Files to generate:

1. `app/Models/User.php`
2. `database/migrations/[timestamp]_add_role_to_users_table.php`
3. `database/migrations/[timestamp]_create_login_attempts_table.php`
4. `app/Models/LoginAttempt.php`
5. `app/DTOs/Auth/LoginAttemptData.php`
6. `app/Actions/Auth/RecordLoginAttemptAction.php`
7. `app/Http/Controllers/AuthController.php`
8. `app/Http/Controllers/PasswordResetController.php`
9. `app/Http/Requests/LoginRequest.php`

### Directory structure

Create all empty directories (with `.gitkeep`) for:

```text
app/Actions/
app/DTOs/
app/Queries/
app/Policies/
app/Http/Resources/
tests/Feature/
```

### Routes

1. `routes/api.php` — auth routes (login, logout, me, forgot-password, reset-password) + one commented placeholder
   `Route::apiResource` for each entity in `.claude/specs/project.md`

> **STOP — do not generate entity files here.**
> Phase 1 ends here. Do NOT generate migrations, models, controllers, resources, policies,
> DTOs, actions, or any other files for domain entities listed in `.claude/specs/project.md`.
> Those are created exclusively by `generate-entity.md`, one entity at a time, after this
> project scaffold is complete. Generating them now causes schema conflicts because the
> database is migrated in Phase 3 before the entity specs are finalised.
>
> When running `generate-entity.md` later, always follow the order defined in the
> "Entity generation order" section of `.claude/specs/project.md`. Entities with
> foreign-key dependencies must be generated after the entities they depend on.

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

4. `src/lib/icons.tsx` — thin adapter that wraps `@hugeicons/core-free-icons` data objects
   into React components using `HugeiconsIcon` from `@hugeicons/react`. Follow
   `.claude/templates/react-app/src/lib/icons.tsx` exactly.
   Add every icon needed by the project at generation time; additional icons can be added later.
   **All files in this project must import icons from `@/lib/icons`, never directly from
   `@hugeicons/react` or `@hugeicons/core-free-icons`.**

    > **Why:** `@hugeicons/react` v1.x ships only the generic `HugeiconsIcon` renderer.
    > Individual icon data ships in `@hugeicons/core-free-icons`. The adapter hides this
    > split so the rest of the codebase uses familiar named components unchanged.

5. `src/app/queryClient.ts` — React Query client with sensible defaults

6. `src/hooks/useDebounce.ts` — copy verbatim from `.claude/templates/react-app/src/hooks/useDebounce.ts`

7. `frontend/.env.example`:

    ```env
    VITE_API_URL=http://localhost:8000/api/v1
    ```

### App shell

1. `src/app/App.tsx` — `RouterProvider` + `QueryClientProvider`

2. `src/app/router.tsx` — routes:
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

Copy all of the following files from `.claude/templates/react-app/src/features/auth/`,
replacing every occurrence of `"Project Name"` with the project name from `.claude/specs/project.md`.
After copying, apply the UX behaviour rules from `.claude/specs/auth.md` § "UX behaviour" —
these are not in the template files and must be added manually.

1. `src/features/auth/types.ts`
2. `src/features/auth/api.ts`
3. `src/features/auth/hooks/useAuth.ts`
4. `src/features/auth/hooks/useLogin.ts`
5. `src/features/auth/hooks/useLogout.ts`
6. `src/features/auth/hooks/useForgotPassword.ts`
7. `src/features/auth/hooks/useResetPassword.ts`
8. `src/features/auth/AuthGuard.tsx` — renders children if authenticated,
   redirects to `/login`; shows a full-screen spinner while loading
9. `src/features/auth/pages/LoginPage.tsx`
10. `src/features/auth/pages/ForgotPasswordPage.tsx`
11. `src/features/auth/pages/ResetPasswordPage.tsx`

All three pages import `AuthLayout` from `@/layouts/AuthLayout` and use the same
shared `Input` and `Button` components as the admin area.

### Layouts

Copy all of the following files verbatim from `.claude/templates/react-app/src/layouts/`.
These are the application shells — all routes use one or the other.

1. `src/layouts/AdminLayout.tsx` — CSS Grid shell (`grid-template-columns: var(--sb-w) 1fr`).
   Module-level statements before imports apply stored theme and sidebar to avoid flash.
   Structure: `shell → sidebar | main → content (padding: var(--pad)) → pagebox (bg-(--box), rounded-2xl)`.
   `<Breadcrumb />` renders inside the pagebox above `<Outlet />`.

2. `src/layouts/AuthLayout.tsx` — centered card shell for login, forgot-password, reset-password.
   Shows brand mark + project name at the top. Theme toggle fixed top-right.
   Uses global design tokens (`--bg`, `--box`, `--border`, `--shadow`).

3. `src/layouts/PublicLayout.tsx` — placeholder for the public-facing frontend.
   Replace with project-specific design once defined.

4. `src/layouts/Sidebar.tsx` — left nav inside `AdminLayout`:
   - Brand area: project name (large, 24px) + collapse toggle button
   - Nav groups with uppercase group labels; nav items with icon + label
   - **Active item style**: `bg-(--surface-2)` background + a 3px left accent bar
     (`position: absolute; left: -14px; top/bottom: 9px; width: 3px; background: var(--accent)`)
     — NOT a tinted `bg-(--accent)/15` background
   - Collapse toggles `data-sidebar` attribute on `<html>` (comfortable ↔ icononly) and
     persists to `localStorage` — never mutates `--sb-w` via inline style
   - User card at bottom with dropdown menu containing:
     - **Segmented Dark / Light control** (two buttons, active = `bg-(--accent) text-(--accent-ink)`)
     - Sign out button
   - Navigation items from `.claude/specs/project.md`; project name from spec as the brand label
   - Imports `useTheme` from `@/layouts/useTheme` and `useLogout` from `@/features/auth/hooks/useLogout`

5. `src/layouts/Breadcrumb.tsx` — floating pill inside the pagebox above page content.
   Style: `bg-(--panel) rounded-[7px] px-4 py-[11px] mb-[18px]`.
   Derives crumb items from the current route path; Home icon + path segments + arrow separators.
   Current (last) segment: `text-(--ink) font-semibold`. Ancestors: `text-(--muted)` links.

6. `src/layouts/useTheme.ts` — manages `data-theme` attribute on `<html>`;
   default dark; persists to `localStorage` under key `theme`; exports `{ theme, setTheme }`

### Base UI components

Copy the following files verbatim from `.claude/templates/react-app/src/components/ui/` into `src/components/ui/`:

1. `Button.tsx`
2. `Input.tsx`
3. `Textarea.tsx`
4. `Select.tsx`
5. `Spinner.tsx`
6. `Checkbox.tsx` — `forwardRef`; native checkbox hidden with `sr-only peer`; custom 17×17px box with accent fill when checked
7. `Badge.tsx` — variants: `success`, `warning`, `error`, `info`, `neutral`; dot + pill; `color-mix()` tinted borders
8. `Card.tsx` — exports `Card`, `CardHeader`, `CardFooter`; `flush` prop removes padding for list-card use
9. `Calendar.tsx` — exports `DatePicker` (trigger + popover) and `InlineCalendar` (always visible).
   Install `react-day-picker` and `date-fns` before copying this file:

   ```bash
   npm install react-day-picker date-fns
   ```

10. `Table.tsx` — exports `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`,
    `TableCell`, `TableCheckCell`, `RowTitle`. Row height from `--row-h` CSS var.
    Header cells: `bg-(--surface-2)` with rounded pill ends. Row dividers: `border-t border-(--border)`.

Also copy the following files verbatim from `.claude/templates/react-app/src/components/ui/`:

1. `Chip.tsx`
2. `Avatar.tsx`
3. `Tabs.tsx`
4. `Modal.tsx`
5. `EmptyState.tsx`
6. `PageHeader.tsx`
7. `StatCard.tsx`
8. `SaveBar.tsx`
9. `Dropzone.tsx`
10. `Toggle.tsx`

Also copy `Pagination.tsx` verbatim from `.claude/templates/react-app/src/layouts/` into
`src/layouts/Pagination.tsx` (it lives in `layouts/`, not `components/ui/`).

### Dashboard placeholder

1. `src/features/dashboard/pages/DashboardPage.tsx` — a minimal page with a welcome message
   and `PageHeader`; no data fetching — just a static placeholder to confirm routing works

### Page templates

Copy the following page templates verbatim from `.claude/templates/react-app/src/features/`:

1. `media/pages/MediaLibraryPage.tsx` → `src/features/media/pages/MediaLibraryPage.tsx`
   Media Library: grid of file/image thumbnails with search, type filter, and pagination.

2. `entity/pages/EntityListPage.tsx` → use as the base for every entity list page.
   Rename "Entity/entity/entities" to the real entity name. Adapt columns, filters, and
   badge logic to match the entity spec.

3. `entity/pages/EntityEditPage.tsx` → use as the base for every entity create/edit page.
   Two-column layout: content fields left, metadata sidebar right. Add/remove cards to
   match the entity spec.

4. `users/pages/UsersListPage.tsx` → `src/features/users/pages/UsersListPage.tsx`
   Users list with avatar, role badge, search, role filter tabs, and pagination.

5. `users/pages/UserEditPage.tsx` → `src/features/users/pages/UserEditPage.tsx`
   User edit with tabbed layout (Profile / Notifications / Integrations), avatar upload,
   and two-column form rows.

---

## Phase 3 — Wire up Laravel config

### 3a. Collect database credentials

Before running any artisan commands, prompt the user for their local database details:

```text
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

> At this point the database should contain only Laravel's core tables (users, password_reset_tokens,
> sessions, cache, jobs) plus the auth migrations (`add_role_to_users`, `create_login_attempts_table`).
> No entity tables exist yet — those are created later when `generate-entity.md` is run for each entity.

### 3c. Seed the default admin user

Create `database/seeders/AdminUserSeeder.php` using the default admin credentials
defined in `.claude/specs/auth.md` § "Default admin credentials".

Run: `php artisan db:seed --class=AdminUserSeeder`

---

## Rules

- Follow all rules in `.claude/rules/backend.md`, `.claude/rules/frontend.md`, `.claude/rules/typescript.md`
- Generate complete, working files — no stubs or TODOs
- Use entity names from `.claude/specs/project.md` and visual style from `.claude/specs/style.md` throughout
- After completing all phases, confirm:
    1. That migrations ran successfully
    2. The URL to open: `http://localhost:5173/login`
    3. The default admin credentials from the seeder

---

## After running this prompt

1. Start the Laravel dev server: `cd api && php artisan serve`
2. Start the React dev server: `cd frontend && npm run dev`
3. Open `http://localhost:5173/login` — you should see the login page
4. Log in with the seeded admin credentials
5. Then run `generate-entity.md` for each entity in your project
