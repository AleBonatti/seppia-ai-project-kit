# Auth Spec

This document describes the complete authentication system used in every project generated from this kit.
Read this before generating or modifying any auth-related code.

---

## Mechanism

**Laravel Sanctum — SPA cookie auth.**

The frontend and API share the same domain (proxied via Vite in dev, nginx in production).
Sanctum issues an HTTP-only session cookie on login; subsequent requests attach it automatically.
No JWT tokens, no `Authorization` headers, no token storage in JS.

The axios instance is configured with:

- `withCredentials: true` — sends the session cookie on every request
- `withXSRFToken: true` — axios reads the `XSRF-TOKEN` cookie and sends it as a header automatically

---

## Backend

### Laravel config (`api/.env`)

```env
SESSION_DRIVER=cookie
SESSION_DOMAIN=localhost
SANCTUM_STATEFUL_DOMAINS=localhost:5173
FRONTEND_URL=http://localhost:5173
```

### Routes (`routes/api.php`)

All auth routes are public (no middleware). All other routes are protected with `auth:sanctum`.

```php
// Public
Route::post('/login',           [AuthController::class, 'login'])
Route::post('/logout',          [AuthController::class, 'logout'])
Route::get('/me',               [AuthController::class, 'me'])
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink'])
Route::post('/reset-password',  [PasswordResetController::class, 'reset'])

// Protected
Route::middleware('auth:sanctum')->group(function () {
    // entity routes go here
});
```

### AuthController

Three methods, no business logic:

| Method     | Endpoint              | Description                                                                               |
| ---------- | --------------------- | ----------------------------------------------------------------------------------------- |
| `login()`  | `POST /api/v1/login`  | Validates credentials, records the attempt, applies rate limiting, returns `UserResource` |
| `logout()` | `POST /api/v1/logout` | Calls `Auth::guard('web')->logout()`, invalidates session                                 |
| `me()`     | `GET /api/v1/me`      | Returns the authenticated `UserResource` — used to rehydrate auth state on page load      |

`login()` responses:

| Status | Condition         | Body                                                                     |
| ------ | ----------------- | ------------------------------------------------------------------------ |
| 200    | Credentials valid | `{ data: UserResource }`                                                 |
| 422    | Wrong credentials | `{ message: 'These credentials do not match our records.' }`             |
| 429    | Too many attempts | `{ message: 'Too many login attempts. Please try again in N seconds.' }` |

### Login attempt logging

Every login attempt (successful or failed) is recorded in the `login_attempts` table.

**Table: `login_attempts`**

| Column       | Type       | Notes                          |
| ------------ | ---------- | ------------------------------ |
| `id`         | bigint     | Primary key                    |
| `email`      | string     | The submitted email            |
| `ip_address` | string(45) | Client IP — supports IPv6      |
| `user_agent` | text       | Browser / client string        |
| `successful` | boolean    | `true` on valid credentials    |
| `created_at` | timestamp  | Set at insert, no `updated_at` |

No updates are ever made to this table — rows are append-only.

**Files:**

- `app/Models/LoginAttempt.php`
- `app/DTOs/Auth/LoginAttemptData.php`
- `app/Actions/Auth/RecordLoginAttemptAction.php`
- `database/migrations/..._create_login_attempts_table.php`

### Rate limiting (lockout)

Implemented directly in `AuthController` using Laravel's `RateLimiter` facade — no extra packages or middleware.

- **Threshold:** 5 failed attempts
- **Window:** 60 seconds
- **Key:** `lowercased_email|ip_address` — combines both so one IP cannot lock out another user's account, and the same email from different IPs gets separate counters
- On success: counter is cleared with `RateLimiter::clear()`
- On lockout: returns 429 before `Auth::attempt()` is even called — no DB query, no attempt recorded

### PasswordResetController

Uses Laravel's built-in `Password` broker — no extra packages.

| Method            | Endpoint                       | Description                                                                                                                                                                                                                    |
| ----------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `sendResetLink()` | `POST /api/v1/forgot-password` | Validates `email`, calls `Password::sendResetLink()`. Returns 200 on success, 422 on failure. Laravel sends the reset email via the configured mailer (in dev: `MAIL_MAILER=log`, link appears in `storage/logs/laravel.log`). |
| `reset()`         | `POST /api/v1/reset-password`  | Validates `token`, `email`, `password`, `password_confirmation`. Calls `Password::reset()` with a closure that updates the password and fires `PasswordReset`. Returns 200 on success, 422 on failure.                         |

### User model

The `users` table has a `role` column (string, default `'user'`). Two roles are used across all projects:

| Role    | Access                                        |
| ------- | --------------------------------------------- |
| `admin` | Full access to admin panel                    |
| `user`  | No admin access (can be extended per project) |

Helper methods on the model:

- `isAdmin(): bool` — returns `true` if role is `admin`
- `isSuperAdmin(): bool` — returns `true` if role is `superadmin` (optional, project-specific)

---

## Frontend

### File structure

```text
src/features/auth/
  types.ts                     ← AuthUser, LoginPayload, ForgotPasswordPayload, ResetPasswordPayload
  api.ts                       ← authApi (login, logout, me, forgotPassword, resetPassword)
  AuthGuard.tsx                ← route wrapper: redirects to /login if not authenticated
  hooks/
    useAuth.ts                 ← useQuery(['auth', 'me']) — the source of truth for auth state
    useLogin.ts                ← useMutation — calls login, seeds query cache, navigates to /admin/dashboard
    useLogout.ts               ← useMutation — calls logout, clears query cache, navigates to /login
    useForgotPassword.ts       ← useMutation — calls forgotPassword
    useResetPassword.ts        ← useMutation — calls resetPassword, navigates to /login on success
  pages/
    LoginPage.tsx
    ForgotPasswordPage.tsx
    ResetPasswordPage.tsx
```

### Auth state (`useAuth`)

`useAuth` is the single source of truth. It calls `GET /me` via React Query with:

- `retry: false` — a 401 means the user is not logged in, not a transient error
- `staleTime: Infinity` — auth state never goes stale on its own; it's updated explicitly on login/logout

````ts
const { user, isLoading, isAuthenticated } = useAuth();

On login success, `useLogin` seeds the cache directly with `queryClient.setQueryData(['auth', 'me'], user)` — no extra `/me` round-trip needed.

On logout, `useLogout` calls `queryClient.clear()` to wipe all cached data, then navigates to `/login`.

### 401 global handler

The axios instance has a response interceptor that redirects to `/login` on any 401:

```ts
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            window.location.href = "/login";
        }
        return Promise.reject(error);
    },
);
````

This catches session expiry anywhere in the app, not just on auth routes.

### AuthGuard

`AuthGuard` wraps the `/admin` route tree in `router.tsx`. It:

1. Shows a full-screen spinner while `useAuth` is loading
2. Redirects to `/login` (with `replace`) if no user is returned
3. Renders children if authenticated

```tsx
// router.tsx
{ path: '/admin', element: <AuthGuard><AdminLayout /></AuthGuard> }
```

### Routes

| Path               | Page                           | Layout                        | Protected |
| ------------------ | ------------------------------ | ----------------------------- | --------- |
| `/login`           | `LoginPage`                    | `AuthLayout`                  | No        |
| `/forgot-password` | `ForgotPasswordPage`           | `AuthLayout`                  | No        |
| `/reset-password`  | `ResetPasswordPage`            | `AuthLayout`                  | No        |
| `/admin/*`         | Admin pages                    | `AdminLayout` via `AuthGuard` | Yes       |
| `*`                | Redirect to `/admin/dashboard` | —                             | —         |

### Password reset flow

1. User visits `/forgot-password`, submits email
2. `useForgotPassword` calls `POST /forgot-password` — backend sends email
3. In dev, the reset link appears in `api/storage/logs/laravel.log`
4. User clicks the link → lands on `/reset-password?token=...&email=...`
5. `ResetPasswordPage` reads `token` and `email` from query params, pre-fills the form
6. `useResetPassword` calls `POST /reset-password`
7. On success, navigates to `/login` with `state: { passwordReset: true }`
8. `LoginPage` reads that state and shows a success message

### Default admin credentials (seeded)

Every project seeds one admin user via `AdminUserSeeder`:

| Field    | Value                 |
| -------- | --------------------- |
| Name     | Admin                 |
| Email    | `la.seppia@gmail.com` |
| Password | `password`            |
| Role     | `superadmin`          |

### UX behaviour

These rules apply to the auth pages and hooks — implement them when generating auth files:

- Add a 500ms artificial delay before every auth API call (login attempt, send reset email, password reset). Use `await new Promise(r => setTimeout(r, 500))` at the start of each `mutationFn`.
- On login failure (any non-200 response), clear the password field by calling `setValue('password', '')` via React Hook Form.

---

## What never to do

- ❌ Store tokens or session data in `localStorage` or `useState`
- ❌ Use `Authorization: Bearer` headers — Sanctum SPA auth uses cookies only
- ❌ Call `/me` directly in components — always use `useAuth()`
- ❌ Add retry logic on 401 — a 401 always means redirect to login
- ❌ Put auth logic in controllers — use `auth:sanctum` middleware and Policies
