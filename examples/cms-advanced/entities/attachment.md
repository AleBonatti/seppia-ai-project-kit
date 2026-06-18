# Entity Specification — Attachment

## Entity name

**Name:** Attachment
**Description:** The relationship between a Media file and a Page. An attachment is not a standalone object — it only exists in the context of a specific page. It carries page-specific metadata: a title, a description, and a display position among other attachments on the same page.

---

## Design note

`Attachment` is a **pivot table with extra columns** — it represents the many-to-many
relationship between `pages` and `media`, enriched with page-specific data.

```
pages ──< attachments >── media
            title
            description
            position
```

A `Media` file can be attached to multiple pages. Each attachment is independent and has its own title, description, and position within the page it belongs to.

---

## Fields

### `attachments` table

| Field         | Type      | Required | Validation        | Notes                                                           |
| ------------- | --------- | -------- | ----------------- | --------------------------------------------------------------- |
| `id`          | integer   | auto     | —                 | Primary key (not a composite key — easier to work with in APIs) |
| `page_id`     | foreignId | yes      | exists:pages,id   | Cascade delete when page is deleted                             |
| `media_id`    | foreignId | yes      | exists:media,id   | Restrict delete — cannot delete media with attachments          |
| `title`       | string    | no       | nullable, max:255 | Override label for this file on this page                       |
| `description` | text      | no       | nullable          | Optional caption or description on this page                    |
| `position`    | integer   | yes      | min:0, default:0  | Display order among attachments on this page                    |
| `created_at`  | timestamp | auto     | —                 |                                                                 |
| `updated_at`  | timestamp | auto     | —                 |                                                                 |

> Unique constraint on `(page_id, media_id)` — the same media cannot be attached
> to the same page twice.

---

## Relationships

| Relation | Type      | Target | Notes                               |
| -------- | --------- | ------ | ----------------------------------- |
| `page`   | belongsTo | Page   | The page this attachment belongs to |
| `media`  | belongsTo | Media  | The underlying media file           |

---

## Permissions

Attachments are managed as part of page editing — no standalone access control beyond page permissions.

| Action | Superadmin | Admin    | Public   |
| ------ | ---------- | -------- | -------- |
| create | ✅         | ✅       | ❌       |
| update | ✅         | ✅       | ❌       |
| delete | ✅         | ✅       | ❌       |
| view   | via Page   | via Page | via Page |

---

## API endpoints

All attachment endpoints are admin-only. There are no standalone public attachment endpoints — attachments are included in the page response.

| Method | Path                                     | Description                         | Auth  |
| ------ | ---------------------------------------- | ----------------------------------- | ----- |
| POST   | `/api/v1/admin/pages/{page}/attachments` | Attach a media to a page            | admin |
| PATCH  | `/api/v1/admin/attachments/{attachment}` | Update title, description, position | admin |
| DELETE | `/api/v1/admin/attachments/{attachment}` | Remove attachment (media file kept) | admin |

> There is no GET endpoint for attachments — they are always loaded as part of
> `GET /api/v1/admin/pages/{id}` (included in the `PageResource`).

### Reorder endpoint

| Method | Path                                             | Description                               | Auth  |
| ------ | ------------------------------------------------ | ----------------------------------------- | ----- |
| POST   | `/api/v1/admin/pages/{page}/attachments/reorder` | Bulk update positions for all attachments | admin |

Reorder request body:

```json
{ "order": [3, 1, 5, 2] }
```

Where the array contains attachment IDs in the desired order — positions are reassigned 0, 1, 2, 3...

---

## Admin UI

The attachment UI lives inside the **Page edit page** — there is no standalone attachment management screen.

### Attachment section (inside Page edit)

```text
── Attachments ─────────────────────────────────────────────

 [thumbnail] photo.jpg         Title: ___________
             image · 1.2 MB    Desc:  ___________
                                Pos:  ↑ ↓  [Remove]

 [icon]      brief.pdf         Title: ___________
             document · 340 KB Desc:  ___________
                                Pos:  ↑ ↓  [Remove]

 [+ Add attachment]
```

- Each attachment row shows: media thumbnail/icon, original filename, type + size, editable title, editable description, reorder controls, remove button
- Clicking "Add attachment" opens the **Media Library picker modal**:
    - Displays the full media library grid (paginated)
    - Includes an "Upload new file" tab for uploading directly from the page editor
    - Single-select: clicking a media item creates the attachment and closes the modal
- Reordering: use up/down buttons or drag-and-drop (positions saved on drop/move)
- Removing: clicking "Remove" deletes the `Attachment` record — the `Media` file is kept
- Changes to attachment metadata (title, description) are auto-saved or saved with the page form

---

## Business rules

- The same media file cannot be attached to the same page twice (unique constraint on `page_id + media_id`)
- `position` is auto-set to `max(position) + 1` when a new attachment is added
- Deleting a page cascades and deletes all its attachments (but NOT the media files)
- Deleting a media file is blocked if any attachments reference it
- Removing an attachment does not delete or modify the underlying media file
- The `PageResource` always includes the `attachments` array, each with the full `media` object nested inside

### Attachment in the PageResource

```json
{
  "id": 1,
  "active": true,
  "translations": { ... },
  "attachments": [
    {
      "id": 10,
      "title": "Floor plan",
      "description": "Ground floor layout",
      "position": 0,
      "media": {
        "id": 42,
        "filename": "floor-plan.pdf",
        "url": "/storage/media/2024/05/abc123.pdf",
        "media_type": "document",
        "size": 348210,
        "size_human": "340 KB"
      }
    }
  ]
}
```

---

## Notes for code generation

### Backend

- `Attachment` is a regular Eloquent model (not just a pivot) — it has its own `id` and dedicated routes
- `AttachmentController` handles store, update, destroy — always scoped to a page
- `CreateAttachmentAction`:
    1. Check the media is not already attached to this page (unique check)
    2. Set `position` to `Attachment::where('page_id', $pageId)->max('position') + 1`
    3. Create the `Attachment` record
- `ReorderAttachmentsAction`: accepts ordered array of IDs, updates `position` on each
- The `PageResource` eager-loads `attachments.media` — always include in the response

### Frontend

- `PageAttachments` component manages the attachment list within the page edit form
- Opening the media picker uses a `useMediaPicker` hook that controls modal open state and selection callback
- After selecting, call `useCreateAttachment` mutation, then invalidate the page query
- Inline editing of title/description: use local state per row, save on blur or with the main form save
- Reorder: on drag-end or button click, call `useReorderAttachments` mutation
