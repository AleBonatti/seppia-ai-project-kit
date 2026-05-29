# Entity Specification — Page

## Entity name

**Name:** Page
**Description:** A content page managed in the CMS. Has locale-specific text fields stored in a separate translations table. Can have multiple media files attached to it. No soft deletes — deletion is permanent.

---

## Fields

### `pages` table (locale-independent data)

| Field          | Type      | Required | Validation                | Notes                                                  |
| -------------- | --------- | -------- | ------------------------- | ------------------------------------------------------ |
| `id`           | integer   | auto     | —                         | Primary key                                            |
| `date`         | date      | no       | nullable                  | Optional editorial date (e.g. publication date)        |
| `order_column` | integer   | yes      | min:0, default:0          | Used for manual sorting in lists                       |
| `date`         | datetim   | No       | nullable.                 | Used in news or post type, will be remove              |
| `active`       | boolean   | yes      | default:false             | Only active pages are visible in the public API        |
| `created_by`   | foreignId | no       | nullable, exists:users,id | Set to NULL if the user is deleted (onDelete:SET NULL) |
| `created_at`   | timestamp | auto     | —                         |                                                        |
| `updated_at`   | timestamp | auto     | —                         |                                                        |

### `page_translations` table (locale-specific data)

| Field        | Type      | Required | Validation        | Notes                                              |
| ------------ | --------- | -------- | ----------------- | -------------------------------------------------- |
| `id`         | integer   | auto     | —                 | Primary key                                        |
| `page_id`    | foreignId | yes      | exists:pages,id   | Foreign key, cascade on delete                     |
| `locale`     | string    | yes      | in:it,en          | Supported locales: `it`, `en`                      |
| `slug`       | string    | yes      | unique per locale | URL-friendly identifier; unique within each locale |
| `title`      | string    | yes      | max:255           |                                                    |
| `short_text` | text      | no       | nullable          | Summary / intro text                               |
| `full_text`  | longtext  | no       | nullable          | Full body content (HTML)                           |

> Unique constraint on `(locale, slug)` — the same slug can exist in different locales
> but not twice within the same locale.

---

## Relationships

| Relation       | Type      | Target          | Notes                                              |
| -------------- | --------- | --------------- | -------------------------------------------------- |
| `translations` | hasMany   | PageTranslation | All locale translations for this page              |
| `translation`  | hasOne    | PageTranslation | Single translation — used with `locale` scope      |
| `attachments`  | hasMany   | Attachment      | Media items attached to this page (via pivot data) |
| `creator`      | belongsTo | User            | The admin who created the page (`created_by` FK)   |

---

## Permissions

| Action | Superadmin | Admin | Public           |
| ------ | ---------- | ----- | ---------------- |
| list   | ✅         | ✅    | ✅ (active only) |
| view   | ✅         | ✅    | ✅ (active only) |
| create | ✅         | ✅    | ❌               |
| update | ✅         | ✅    | ❌               |
| delete | ✅         | ✅    | ❌               |

> Future: superadmin may have additional restrictions on which pages admin can edit.
> For now both roles have equal access to page CRUD.

---

## API endpoints

### Admin (authenticated)

| Method | Path                       | Description                                     | Auth  |
| ------ | -------------------------- | ----------------------------------------------- | ----- |
| GET    | `/api/v1/admin/pages`      | Paginated list (all pages, any locale)          | admin |
| GET    | `/api/v1/admin/pages/{id}` | Single page with all translations + attachments | admin |
| POST   | `/api/v1/admin/pages`      | Create page with translations                   | admin |
| PATCH  | `/api/v1/admin/pages/{id}` | Update page + translations                      | admin |
| DELETE | `/api/v1/admin/pages/{id}` | Permanently delete page                         | admin |

### Public (no auth)

| Method | Path                            | Description                                    | Auth |
| ------ | ------------------------------- | ---------------------------------------------- | ---- |
| GET    | `/api/v1/pages`                 | Active pages, specific locale via `?locale=it` | no   |
| GET    | `/api/v1/pages/{locale}/{slug}` | Single active page by locale + slug            | no   |

---

## Admin UI

### List page

- Table columns: title (default locale), active badge, date, order, creator name, actions
- Default locale shown in list: `it` (fallback to `en` if IT translation missing)
- Sortable by `order_column` — drag to reorder or inline numeric input
- Filters:
    - [ ] Filter by active / inactive
    - [ ] Search by title (searches across all locales)

### Create / Edit page

The edit form is a single page with two sections:

**Section 1 — Page settings (locale-independent)**

- Date (date picker, optional)
- Order (numeric input)
- Active (toggle)

**Section 2 — Content (locale tabs)**

- Tab switcher: `IT` | `EN`
- Per tab: Slug (auto-generated from title, editable), Title, Short text (textarea), Full text (rich text / textarea)

**Section 3 — Attachments**

- Grid of currently attached media (thumbnail + title + position)
- "Add attachment" button → opens Media Library picker modal
- Inline editing of attachment title, description, position
- Remove attachment button (removes the attachment link, not the media file itself)

---

## Business rules

- `created_by` is set automatically to the authenticated user on creation; never editable
- `order_column` defaults to the current max + 1 (so new pages go to the end)
- Slug is auto-generated from the title when the user starts typing; can be manually overridden
- Slug must be unique per locale — validate in `StorePageRequest` and `UpdatePageRequest`
- Deleting a page permanently deletes all its translations and attachments (DB cascade)
- Deleting a page does NOT delete the media files — only the attachment records are removed
- The public API never returns inactive pages
- When the public API is called without `?locale`, default to `it`

---

## Notes for code generation

### Backend

- The `Page` model has a `translations()` hasMany and a scoped `translation(string $locale)` hasOne
- Create/update accepts a `translations` array in the request body, keyed by locale:
    ```json
    {
        "date": "2024-06-01",
        "active": true,
        "translations": {
            "it": { "slug": "chi-siamo", "title": "Chi siamo", "short_text": "...", "full_text": "..." },
            "en": { "slug": "about-us", "title": "About us", "short_text": "...", "full_text": "..." }
        }
    }
    ```
- `CreatePageAction` saves the page then iterates `$data->translations` to upsert each `PageTranslation`
- `UpdatePageAction` uses `updateOrCreate(['page_id' => $page->id, 'locale' => $locale], [...])` for each translation
- `PageResource` always includes all translations and attachments (with their media)

### Frontend

- The edit page uses a tab component to switch between `IT` and `EN` translation forms
- Both language forms are submitted together in one API call — not separately
- **Validation:** only `it` fields are required. The `en` Zod schema is fully optional — no `superRefine`, no conditional required rules. The submit handler omits `en` from the payload when all its fields are empty. See `rules/frontend.md` § Multi-language forms.
- The attachment section is a sub-component `PageAttachments` that manages its own state
- Opening the media picker shows a modal with the full media library grid (paginated, searchable)
- After selecting a media from the picker, a new attachment record is created via `POST /api/v1/admin/attachments`
