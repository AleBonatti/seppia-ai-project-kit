# Entity Specification — Post (News/Blog)

## Entity name

**Name:** Post
**Description:** A news or blog article written by the studio admin and published to the public website.

---

## Fields

| Field          | Type      | Required | Validation                          | Notes                                       |
| -------------- | --------- | -------- | ----------------------------------- | ------------------------------------------- |
| `id`           | integer   | auto     | —                                   | Primary key                                 |
| `title`        | string    | yes      | max:255                             |                                             |
| `slug`         | string    | auto     | unique                              | Auto-generated from title                   |
| `excerpt`      | string    | no       | max:500, nullable                   | Short summary for list views                |
| `body`         | longtext  | yes      | min:1                               | Full article content (HTML or Markdown)     |
| `cover_image`  | string    | no       | nullable                            | Path to uploaded cover image                |
| `status`       | enum      | yes      | `draft` \| `published`              | Default: `draft`                            |
| `published_at` | timestamp | no       | nullable                            | Set automatically when status → published   |
| `created_at`   | timestamp | auto     | —                                   |                                             |
| `updated_at`   | timestamp | auto     | —                                   |                                             |

---

## Relationships

None for this entity.

---

## Permissions

| Action | Admin | Public             |
| ------ | ----- | ------------------ |
| list   | ✅     | ✅ (published only) |
| view   | ✅     | ✅ (published only) |
| create | ✅     | ❌                  |
| update | ✅     | ❌                  |
| delete | ✅     | ❌                  |

---

## API endpoints

| Method | Path                     | Description                        | Auth  |
| ------ | ------------------------ | ---------------------------------- | ----- |
| GET    | `/api/v1/posts`          | Public list (published only)       | no    |
| GET    | `/api/v1/posts/{slug}`   | Public single post by slug         | no    |
| GET    | `/api/v1/admin/posts`    | Admin list (all statuses)          | admin |
| POST   | `/api/v1/admin/posts`    | Create                             | admin |
| PATCH  | `/api/v1/admin/posts/{id}` | Update                           | admin |
| DELETE | `/api/v1/admin/posts/{id}` | Delete                           | admin |

---

## Admin UI

- **List page** — table: title, status badge, published date, actions (edit, delete)
- **Create page** — form: title, excerpt, body (rich text or textarea), cover image upload, status toggle
- **Edit page** — same form pre-filled; show "Publish" button if currently draft

Filters:

- [ ] Filter by status (draft / published)
- [ ] Search by title

---

## Business rules

- When status changes from `draft` to `published`, set `published_at` to current timestamp automatically
- When status changes back to `draft`, set `published_at` to null
- Slug is auto-generated on create; never auto-updated after creation (to preserve public URLs)
- Public API returns only posts where `status = 'published'`

---

## Notes for code generation

- Two separate controller methods for public vs admin: `PostController` (public, read-only) and `Admin\PostController` (admin CRUD)
- Or use a single controller with separate routes and policy checks — admin routes under `/api/v1/admin/` prefix
- `body` field: store raw HTML — no server-side rendering needed
- Cover image: stored at `storage/app/public/posts/`, URL appended to Resource
