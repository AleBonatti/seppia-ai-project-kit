# Prompt: Generate Account Settings Page

Use this prompt to generate the account settings page (profile photo, personal info, password)
from the kit's fixed `AccountSettingsPage` template.

Unlike `generate-dashboard.md` or `generate-entity.md`, this page has no per-project spec file —
its shape (avatar, name, email, password) is fixed by `.claude/specs/auth.md`, which every
project already copies in as-is. There is nothing project-specific to fill in.

---

## When to use

- The project scaffold already exists (run `generate-project.md` first)
- Auth is wired up per `.claude/specs/auth.md` (`useAuth`, `User` model with `role`, etc.)
- You want to add or replace the account settings page with the real, wired-up version

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
- .claude/specs/auth.md
- .claude/stacks/laravel-react.md
- .claude/rules/backend.md
- .claude/rules/frontend.md
- .claude/rules/typescript.md
- .claude/ui-kit/components.md
- .claude/templates/react-app/src/features/users/pages/AccountSettingsPage.tsx

Generate the real account settings page, starting from the template at
`.claude/templates/react-app/src/features/users/pages/AccountSettingsPage.tsx`. The template's
layout, copy, fields, and behavior (avatar upload, personal info form, password form with
strength meter) are final — do not redesign it. Your job is to wire its placeholder state and
`// Replace with:` comments to real backend endpoints and mutation hooks.

## Backend — generate these files (inside api/), only for what doesn't already exist

1. `app/Http/Requests/UpdateProfileRequest.php`
   - `name` — required, string, max:255
   - `authorize()` returns true (the user updates their own profile)

2. `app/Http/Requests/UpdatePasswordRequest.php`
   - `current_password` — required, must match the authenticated user's password (use the
     `current_password` validation rule)
   - `new_password` — required, string, min:8, `confirmed`
   - `new_password_confirmation` — required

3. `app/Http/Requests/UpdateAvatarRequest.php`
   - `avatar` — required, image, mimes:jpeg,png, max:2048 (2 MB)

4. `app/Actions/User/UpdateProfileAction.php`
   - Updates only `name` on the authenticated user — never touches password or role
5. `app/Actions/User/UpdatePasswordAction.php`
   - Hashes and updates the password; does not touch any other field
6. `app/Actions/User/UpdateAvatarAction.php`
   - Resizes to 500×500px on the server, stores to `storage/app/public/avatars/`, updates the
     user's `avatar_path` (or equivalent) column
7. `app/Actions/User/DeleteAvatarAction.php`
   - Deletes the stored file and clears the avatar column

8. `app/Http/Controllers/AccountSettingsController.php`
   - `updateProfile(UpdateProfileRequest, UpdateProfileAction): UserResource`
   - `updatePassword(UpdatePasswordRequest, UpdatePasswordAction): JsonResponse` (204 on success)
   - `updateAvatar(UpdateAvatarRequest, UpdateAvatarAction): UserResource`
   - `deleteAvatar(UpdateAvatarAction|DeleteAvatarAction): UserResource`
   - Thin — delegates to Actions, all routes scoped to the authenticated user (no `{id}` param)

9. Routes to add in `routes/api.php`, all behind `auth:sanctum`:
   - `PATCH /api/v1/account/profile` → `updateProfile`
   - `POST  /api/v1/account/password` → `updatePassword`
   - `POST  /api/v1/account/avatar` → `updateAvatar`
   - `DELETE /api/v1/account/avatar` → `deleteAvatar`

10. `tests/Feature/Account/AccountSettingsTest.php`
    - Update profile (success + validation error on empty name)
    - Update password (success, wrong current_password rejected, mismatched confirmation rejected)
    - Upload avatar (success, rejects non-image, rejects >2MB)
    - Delete avatar
    - All endpoints reject unauthenticated requests

## Frontend — generate these files (inside frontend/)

1. `src/features/users/api.ts` (add to existing file, or create if missing)
   - `updateProfile(payload)`, `updatePassword(payload)`, `uploadAvatar(file)`, `deleteAvatar()`

2. `src/features/users/hooks/useUpdateProfile.ts`
   - `useMutation` calling `updateProfile`; on success, update the `['auth', 'me']` query cache
     directly (same pattern as `useLogin`) so `useAuth()` reflects the new name immediately

3. `src/features/users/hooks/useUpdatePassword.ts`
   - `useMutation` calling `updatePassword`; surfaces the "wrong current password" 422 error to
     the form

4. `src/features/users/hooks/useUploadAvatar.ts`
   - `useMutation` calling `uploadAvatar`; on success, update the `['auth', 'me']` cache with the
     new avatar URL

5. `src/features/users/hooks/useDeleteAvatar.ts`
   - `useMutation` calling `deleteAvatar`; on success, update the `['auth', 'me']` cache

6. `src/features/users/pages/AccountSettingsPage.tsx`
   - Copy the template verbatim, then:
     - Replace every `// Replace with:` comment with the real hook call it describes
     - Replace `avatarSrc` initial state with `user?.avatarUrl ?? null`
     - Remove the `setTimeout(..., SAVE_DELAY_MS)` placeholders — `isLoading` state comes from
       the real mutations' `isPending` now
   - Do not change layout, copy, or the password strength meter logic

7. Add the route in `src/app/router.tsx`:
   - `/admin/account` → `AccountSettingsPage`, inside the protected admin layout

8. Add a link to it from the user menu / sidebar (wherever the project's account menu lives)

## Rules

- Follow all rules in .claude/rules/backend.md and .claude/rules/frontend.md
- Follow .claude/specs/auth.md — never touch password through the profile update flow, never
  expose password fields on anything but the dedicated password form
- Generate complete, working files — no stubs or TODOs
- Use explicit types everywhere — no `any`
- Server data via React Query only — no useEffect fetching
- Save buttons keep the existing SaveBar `isLoading` wiring — do not remove the 500ms minimum
  spinner behavior that SaveBar already provides
```

---

## After running this prompt

1. Run migrations if a new `avatar_path` column was added: `cd api && php artisan migrate`
2. Run `cd api && php artisan test --filter=AccountSettings`
3. Open `http://localhost:5173/admin/account` and verify: name update, password update
   (including wrong-current-password error), avatar upload, avatar removal
