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
| `profile_photo_path` | string    | no       | —                                  |                                 |
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

- All type of admins roles (admins and superadmins) can access the Users section — But only superadmin can create other superadmins
- A user cannot delete their own account
- Password is hashed with bcrypt; never returned in any API response
- When updating a user, if the `password` field is blank or absent, the password is not changed

---

## Notes for code generation

- Use Laravel's built-in `User` model as the base — add `role` cast as a string enum
- add `profile_photo_path` field to store an avatar picture. The upload will be placed in the suer personal settings page, and will be handled by the user itself.
- `role` is checked in middleware/policies — define a `isSuperAdmin()` helper method on the model
- The `UserResource` must never include the `password` field
