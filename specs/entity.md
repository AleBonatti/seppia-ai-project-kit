# Entity Specification Template

> Copy this file to `specs/entities/[entity-name].md` for each domain entity.
> Fill in every section. Claude reads this before generating backend + frontend code for the entity.

---

## Entity name

**Name:** [e.g. Product, Order, Appointment, Post]
**Description:** [One sentence explaining what this entity represents in the domain]

---

## Fields

List every field. Be precise — these map directly to database columns, DTOs, and TypeScript types.

| Field         | Type       | Required | Validation                        | Notes                                 |
| ------------- | ---------- | -------- | --------------------------------- | ------------------------------------- |
| `id`          | integer    | auto     | —                                 | Primary key, auto-increment           |
| `title`       | string     | yes      | max:255                           |                                       |
| `slug`        | string     | auto     | unique, generated from title      | Auto-generated in CreateAction        |
| `body`        | text       | yes      | min:10                            |                                       |
| `status`      | enum       | yes      | draft \| published \| archived    |                                       |
| `price`       | decimal    | no       | min:0, 2 decimal places           | Nullable if not always applicable     |
| `user_id`     | foreignId  | yes      | exists:users,id                   | Belongs to User                       |
| `published_at`| timestamp  | no       | nullable                          |                                       |
| `created_at`  | timestamp  | auto     | —                                 |                                       |
| `updated_at`  | timestamp  | auto     | —                                 |                                       |

---

## Relationships

| Relation   | Type        | Target entity | Notes                              |
| ---------- | ----------- | ------------- | ---------------------------------- |
| `author`   | belongsTo   | User          | The user who created this entity   |
| `tags`     | belongsToMany | Tag         | Via pivot table `[entity]_tag`     |
| `images`   | hasMany     | Image         | Polymorphic if shared across types |

---

## Permissions

Who can do what with this entity?

| Action    | Admin | User (owner) | User (other) | Public |
| --------- | ----- | ------------ | ------------ | ------ |
| list      | ✅     | ✅ (own only) | ❌            | ❌      |
| view      | ✅     | ✅            | ❌            | ✅      |
| create    | ✅     | ✅            | ❌            | ❌      |
| update    | ✅     | ✅ (own only) | ❌            | ❌      |
| delete    | ✅     | ❌            | ❌            | ❌      |

---

## API endpoints

| Method | Path                   | Description           | Auth required |
| ------ | ---------------------- | --------------------- | ------------- |
| GET    | `/api/v1/[entities]`   | Paginated list        | yes           |
| GET    | `/api/v1/[entities]/{id}` | Single resource    | yes           |
| POST   | `/api/v1/[entities]`   | Create                | yes           |
| PATCH  | `/api/v1/[entities]/{id}` | Update             | yes           |
| DELETE | `/api/v1/[entities]/{id}` | Delete             | yes (admin)   |

---

## Admin UI

What screens should the admin panel have for this entity?

- [ ] **List page** — table with columns: [list which fields to show], pagination, search by [field]
- [ ] **Create page** — form with all required fields
- [ ] **Edit page** — same form pre-filled, with delete button
- [ ] **Detail/view page** — read-only view (only if needed beyond list + edit)

Filters on list page:

- [ ] Filter by status
- [ ] Filter by [field]
- [ ] Search by [field]
- [ ] Date range filter on `created_at`

---

## Business rules

List any logic that goes beyond simple CRUD — these become methods in the Action classes.

- [e.g. "Slug must be auto-generated from title and guaranteed unique"]
- [e.g. "Status can only move forward: draft → published → archived, never backward"]
- [e.g. "When published_at is set, status must be 'published'"]
- [e.g. "Price must be stored in cents (integer) and divided by 100 for display"]

---

## Notes for code generation

Any additional context Claude should know when generating code for this entity.

- [e.g. "Use soft deletes (SoftDeletes trait)"]
- [e.g. "Images are stored via Spatie Media Library"]
- [e.g. "This entity is publicly visible — include a public API endpoint without auth"]
