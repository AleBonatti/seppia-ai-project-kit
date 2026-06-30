# Entity Specification — Media

## Entity name

**Name:** Media
**Description:** A file uploaded to the media library. Can be an image, document, or any file type. Exists independently of any page. When attached to a page it gains page-specific metadata, but the Media record itself is never modified by the attachment.

---

## Fields

### `media` table

| Field         | Type      | Required | Validation                                  | Notes                                                   |
| ------------- | --------- | -------- | ------------------------------------------- | ------------------------------------------------------- |
| `id`          | integer   | auto     | —                                           | Primary key                                             |
| `filename`    | string    | yes      | max:255                                     | Original filename as uploaded (e.g. `photo.jpg`)        |
| `disk_name`   | string    | yes      | max:255, unique                             | Stored filename on disk (UUID-based, e.g. `a1b2c3.jpg`) |
| `path`        | string    | yes      | max:500                                     | Full storage path (e.g. `media/2024/05/a1b2c3.jpg`)     |
| `mime_type`   | string    | yes      | max:127                                     | e.g. `image/jpeg`, `application/pdf`                    |
| `media_type`  | enum      | yes      | `image` \| `document` \| `video` \| `other` | Derived from mime_type at upload time                   |
| `size`        | integer   | yes      | min:0                                       | File size in bytes                                      |
| `width`       | integer   | no       | nullable                                    | Image width in px — null for non-images                 |
| `height`      | integer   | no       | nullable                                    | Image height in px — null for non-images                |
| `uploaded_by` | foreignId | no       | nullable, exists:users,id                   | Set to NULL if the user is deleted                      |
| `created_at`  | timestamp | auto     | —                                           |                                                         |
| `updated_at`  | timestamp | auto     | —                                           |                                                         |

---

## Derived / computed attributes

These are appended to the `MediaResource` — not stored in the DB:

| Attribute    | Description                                                   |
| ------------ | ------------------------------------------------------------- |
| `url`        | Public URL to access the file (`/storage/media/2024/05/...`)  |
| `is_image`   | Boolean shortcut — `media_type === 'image'`                   |
| `size_human` | Human-readable size — e.g. `"1.2 MB"` (formatted in Resource) |

---

## Relationships

| Relation      | Type      | Target     | Notes                                          |
| ------------- | --------- | ---------- | ---------------------------------------------- |
| `attachments` | hasMany   | Attachment | All page attachments that reference this media |
| `uploader`    | belongsTo | User       | Admin who uploaded the file                    |

---

## Permissions

| Action | Superadmin | Admin | Public          |
| ------ | ---------- | ----- | --------------- |
| list   | ✅         | ✅    | ✅ (basic info) |
| view   | ✅         | ✅    | ✅              |
| upload | ✅         | ✅    | ❌              |
| delete | ✅         | ✅    | ❌              |

> Deleting a media file automatically removes all its attachment records across all pages (cascade).
> Admins can delete any media (not just their own uploads).

---

## API endpoints

### Admin (authenticated)

| Method | Path                       | Description                             | Auth  |
| ------ | -------------------------- | --------------------------------------- | ----- |
| GET    | `/api/v1/admin/media`      | Paginated library grid (filter by type) | admin |
| GET    | `/api/v1/admin/media/{id}` | Single media item                       | admin |
| POST   | `/api/v1/admin/media`      | Upload a new file (multipart/form-data) | admin |
| DELETE | `/api/v1/admin/media/{id}` | Delete file from disk and DB            | admin |

> There is no PATCH/update for Media — the file itself is immutable once uploaded.
> The only editable metadata lives on the `Attachment`, not the `Media`.

### Public (no auth)

| Method | Path                 | Description                      | Auth |
| ------ | -------------------- | -------------------------------- | ---- |
| GET    | `/api/v1/media`      | Paginated list (basic info only) | no   |
| GET    | `/api/v1/media/{id}` | Single media item                | no   |

---

## Admin UI

### Media library page (`/admin/media`)

- Grid view (not table) — thumbnail for images, file icon for documents
- Each card shows: thumbnail/icon, filename, size, type badge, upload date
- There's no upload in Media Library: file uploads will happen in attachment section, on each specific entity
- Click a media card → opens a detail side panel (not a new page):
    - Full preview (image) or download link (document)
    - Metadata: filename, size, dimensions (if image), mime type, uploaded by, upload date
    - Delete button — always enabled; deleting the media also removes all its attachment records across all pages
- Filters:
    - [ ] Filter by media_type (image / document / video / other)
    - [ ] Search by filename

### Media picker modal (used from Page edit → Add attachment)

- Same grid as the library, but in a modal
- Single-select — clicking a media selects it and closes the modal
- Search by filename

---

## Business rules

- `disk_name` is generated at upload time: `Str::uuid() . '.' . $extension`
- `path` follows `media/{year}/{month}/{disk_name}` — organises files by upload date
- `media_type` is derived from `mime_type` at upload time:
    - `image/*` → `image`
    - `application/pdf`, `application/msword`, `application/vnd.*`, `text/*` → `document`
    - `video/*` → `video`
    - anything else → `other`
- `width` and `height` are extracted at upload time for image files (use PHP `getimagesize()` or Intervention Image)
- Deleting a media file **cascades** — all `Attachment` records referencing it are automatically deleted (DB `onDelete: CASCADE` on `attachments.media_id`). The media file is then removed from disk.
- `uploaded_by` is set automatically from the authenticated user; set to NULL if that user is deleted (onDelete: SET NULL)
- No update endpoint — media is immutable after upload

---

## Notes for code generation

### Backend

- File upload handled in `UploadMediaAction`:
    1. Validate file (max size 20MB, any mime type)
    2. Generate `disk_name` (UUID + extension)
    3. Store file to `storage/app/public/media/{year}/{month}/`
    4. Extract dimensions if image
    5. Derive `media_type` from mime_type
    6. Create `Media` record
- `DeleteMediaAction`:
    1. Delete file from disk (`Storage::delete($media->path)`)
    2. Delete DB record — the `onDelete: CASCADE` on `attachments.media_id` removes all related attachment rows automatically
- `MediaResource` appends `url` via `Storage::url($this->path)`
- The upload endpoint accepts `multipart/form-data` with a `file` field

### Frontend

- The media library page uses a grid layout (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`)
- Image thumbnails use `object-cover` with a fixed aspect ratio container
- The detail side panel slides in from the right — no page navigation
- Upload uses a `<input type="file" multiple>` with drag-and-drop overlay
- Upload progress shown per file (use `onUploadProgress` from axios)
- After upload, the grid is refetched via `queryClient.invalidateQueries(['media'])`
