# Entity Specification — User (Admin)

## Entity name

**Name:** User
**Description:** An admin account with a role of either `superadmin` or `admin`. Managed exclusively by superadmins. There is no public registration.

---

## Fields

| Field                | Type      | Required | Validation                         | Notes                           |
| -------------------- | --------- | -------- | ---------------------------------- | ------------------------------- |
| `id`                 | integer   | auto     | —                                  | Primary key                     |
| `name`               | string    | yes      | max:255                            |                                 |
| `email`              | string    | yes      | email, unique:users,email, max:255 |                                 |
| `password`           | string    | yes      | min:8 (hashed)                     | Never returned in API responses |
| `role`               | enum      | yes      | `superadmin` \| `admin`            | Default: `admin`                |
| `profile_photo_path` | string    | no       | nullable                           | Relative path inside `avatars/` on the public disk |
| `created_at`         | timestamp | auto     | —                                  |                                 |
| `updated_at`         | timestamp | auto     | —                                  |                                 |

---

## Relationships

None

---

## Permissions

| Action | Superadmin | Admin |
| ------ | ---------- | ----- |
| list   | ✅         | ✅    |
| view   | ✅         | ✅    |
| create | ✅         | ✅    |
| update | ✅         | ✅    |
| delete | ✅         | ✅    |

A user cannot delete their own account (prevent accidental lockout).

---

## API endpoints

| Method | Path                       | Description              | Auth       |
| ------ | -------------------------- | ------------------------ | ---------- |
| GET    | `/api/v1/admin/users`      | Paginated list           | superadmin |
| GET    | `/api/v1/admin/users/{id}` | Single user              | superadmin |
| POST   | `/api/v1/admin/users`      | Create new admin         | superadmin |
| PATCH  | `/api/v1/admin/users/{id}` | Update name, email, role | superadmin |
| DELETE | `/api/v1/admin/users/{id}` | Delete admin             | superadmin |

---

## Admin UI

- **List page** — table: name, email, role badge, created date, actions (edit, delete)
    - Delete button disabled/hidden for the currently logged-in user
- **Create page** — form: name, email, password, role selector
- **Edit page** — form: name, email, role selector; password change not allowed: user itself can change from its settings page

Filters:

- [ ] Filter by role

---

## Business rules

- All admin roles can access the Users section — only superadmin can create other superadmins
- A user cannot delete their own account
- Password is hashed with bcrypt; never returned in any API response
- When updating a user, the password field is never touched — password changes go through a dedicated endpoint
- When deleting a user, if they have a `profile_photo_path`, delete the file from disk first, then delete the user record
- Avatar upload rules (enforced in `UploadAvatarAction`):
  - Only `image/jpeg` and `image/png` are accepted — reject other types with a 422
  - Maximum file size: 2 MB
  - Resize to fit within 500 × 500 px, preserving aspect ratio (scale the longer side down to 500, the other side scales proportionally)
  - Store in the `avatars/` folder on the public disk (`storage/app/public/avatars/`). Create the folder if it does not exist.
  - Filename: `{userId}.{ext}` — overwrites any previous avatar for that user
  - Save the relative path (`avatars/{userId}.{ext}`) in `profile_photo_path`
- Avatar delete (`DeleteAvatarAction`): delete the file from disk and set `profile_photo_path` to null

---

## Notes for code generation

- Use Laravel's built-in `User` model as the base — add `role` cast as a string enum
- `profile_photo_path` stores the relative path inside the public disk (e.g. `avatars/42.jpg`); `UserResource` appends a computed `avatarUrl` via `Storage::url($this->profile_photo_path)`
- Avatar upload/delete is handled by dedicated actions (`UploadAvatarAction`, `DeleteAvatarAction`) called from the account settings endpoint — not part of the standard user CRUD
- Use `Intervention\Image` (or `GD` via `imagecreatefromjpeg` / `imagecreatefrompng`) for resizing; ensure the `avatars/` directory exists before writing (`Storage::makeDirectory('avatars')`)
- `DeleteUserAction` must check for `profile_photo_path` and delete the file from disk before deleting the user record
- `role` is checked in middleware/policies — define an `isSuperAdmin()` helper method on the model
- The `UserResource` must never include the `password` field
