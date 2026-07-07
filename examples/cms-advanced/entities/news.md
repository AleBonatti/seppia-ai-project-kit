# Entity Specification — News

## Entity name

**Name:** News
**Description:** A content page managed in the CMS. Has locale-specific text fields stored in a separate translations table. Can have multiple media files attached to it. No soft deletes — deletion is permanent.

---

## Fields

### `news` table (locale-independent data)

| Field          | Type      | Required | Validation                | Notes                                                  |
| -------------- | --------- | -------- | ------------------------- | ------------------------------------------------------ |
| `id`           | integer   | auto     | —                         | Primary key                                            |
| `date`         | date      | no       | nullable                  | Optional editorial date (e.g. publication date)        |
| `order_column` | integer   | yes      | min:0, default:0          | Used for manual sorting in lists                       |
| `date`         | datetime  | No       | nullable.                 | Used in news or post type, will be remove              |
| `active`       | boolean   | yes      | default:false             | Only active news are visible in the public API         |
| `created_by`   | foreignId | no       | nullable, exists:users,id | Set to NULL if the user is deleted (onDelete:SET NULL) |
| `created_at`   | timestamp | auto     | —                         |                                                        |
| `updated_at`   | timestamp | auto     | —                         |                                                        |

### `news_translations` table (locale-specific data)

| Field        | Type      | Required | Validation        | Notes                                              |
| ------------ | --------- | -------- | ----------------- | -------------------------------------------------- |
| `id`         | integer   | auto     | —                 | Primary key                                        |
| `news_id`    | foreignId | yes      | exists:news,id    | Foreign key, cascade on delete                     |
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
| `translations` | hasMany   | NewsTranslation | All locale translations for this news              |
| `translation`  | hasOne    | NewsTranslation | Single translation — used with `locale` scope      |
| `attachments`  | hasMany   | Attachment      | Media items attached to this news (via pivot data) |
| `creator`      | belongsTo | User            | The admin who created the news (`created_by` FK)   |

---

## Permissions

| Action | Superadmin | Admin | Public           |
| ------ | ---------- | ----- | ---------------- |
| list   | ✅         | ✅    | ✅ (active only) |
| view   | ✅         | ✅    | ✅ (active only) |
| create | ✅         | ✅    | ❌               |
| update | ✅         | ✅    | ❌               |
| delete | ✅         | ✅    | ❌               |

> Future: superadmin may have additional restrictions on which news admin can edit.
> For now both roles have equal access to news CRUD.

---

## API endpoints

### Admin (authenticated)

| Method | Path                          | Description                                     | Auth  |
| ------ | ----------------------------- | ----------------------------------------------- | ----- |
| GET    | `/api/v1/admin/newsnews`      | Paginated list (all news, any locale)           | admin |
| GET    | `/api/v1/admin/newsnews/{id}` | Single news with all translations + attachments | admin |
| POST   | `/api/v1/admin/newsnews`      | Create news with translations                   | admin |
| PATCH  | `/api/v1/admin/newsnews/{id}` | Update news + translations                      | admin |
| DELETE | `/api/v1/admin/newsnews/{id}` | Permanently delete news                         | admin |

### Public (no auth)

| Method | Path                           | Description                                   | Auth |
| ------ | ------------------------------ | --------------------------------------------- | ---- |
| GET    | `/api/v1/news`                 | Active news, specific locale via `?locale=it` | no   |
| GET    | `/api/v1/news/{locale}/{slug}` | Single active news by locale + slug           | no   |

---

## Admin UI

### List news

- Table columns: title (default locale), active badge, date, order, creator name, actions
- Default locale shown in list: `it` (fallback to `en` if IT translation missing)
- Sortable by `order_column` — drag to reorder or inline numeric input
- Filters:
    - [ ] Filter by active / inactive
    - [ ] Search by title (searches across all locales. should start searching on typing, with 300ms debounce)

Attachments:

- [x] **Yes** — include the `AttachmentManager` card on the edit news

### Create / Edit news

The edit form is a single news with two main sections: a left column and a right column (check layout news). Each column is divided in multiple Cards blocks

**Left column**

- Card 1 (locale dependent):
    - Tab switcher: `IT` | `EN`
    - Title (textbox)
    - Slug (textbox)
    - Short text (2 rows textarea)
    - Full text (5 rows rich text / textarea)

- Card 2 - Media:
    - File upload
    - Grid of currently attached media (thumbnail + title + delete button)

**Right column**

- Active (toggle, default to true on create)
- Date (datetime field)

---

## Business rules

- `created_by` is set automatically to the authenticated user on creation; never editable
- `order_column` defaults to the current max + 1 (so new news go to the end)
- Slug is auto-generated from the title. Text field is filled when title is blurred; can be manually overridden
- Slug must be unique per locale — validate in `StoreNewsRequest` and `UpdateNewsRequest`
- Deleting a news permanently deletes all its translations and attachments (DB cascade)
- Deleting a news does NOT delete the media files — only the attachment records are removed
- The public API never returns inactive news
- When the public API is called without `?locale`, default to `it`

---

## Notes for code generation

### Backend

- The `News` model has a `translations()` hasMany and a scoped `translation(string $locale)` hasOne
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
- `CreateNewsAction` saves the news then iterates `$data->translations` to upsert each `NewsTranslation`
- `UpdateNewsAction` uses `updateOrCreate(['news_id' => $news->id, 'locale' => $locale], [...])` for each translation
- `NewsResource` always includes all translations and attachments (with their media)

### Frontend

- The edit news uses a tab component to switch between `IT` and `EN` translation forms
- Both language forms are submitted together in one API call — not separately
- **Validation:** only `it` fields are required. The `en` Zod schema is fully optional — no `superRefine`, no conditional required rules. The submit handler omits `en` from the payload when all its fields are empty. See `rules/frontend.md` § Multi-language forms.
- The attachment section is a sub-component `NewsAttachments` that manages its own state
- Opening the media picker shows a modal with the full media library grid (paginated, searchable)
- After selecting a media from the picker, a new attachment record is created via `POST /api/v1/admin/attachments`
