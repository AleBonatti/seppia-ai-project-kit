# Project Specification — CMS Advanced

## Project identity

- **Name:** CMS Advanced
- **Client:** Generic multi-admin CMS
- **Type:** web application with admin backoffice
- **Description:** A headless CMS with a backoffice accessible at `/login`. Admins manage pages with multi-language content and a media library. Pages can have multiple file attachments, each with page-specific metadata.

---

## Stack

- **Stack:** Laravel API + React SPA (TypeScript)
- **Stack file:** `stacks/laravel-react.md`

---

## Users and roles

Two roles exist within the admin system. There is no public registration — admin accounts are created by a superadmin.

- **Superadmin** — full access to everything: manage all pages, all media, all admin users, system settings
- **Admin** — can manage pages and media, but cannot manage other admin accounts or access system settings

Public/unauthenticated access:

- None — `/login` is the only public route; everything else requires authentication
- The CMS exposes a public read-only API for the frontend to consume (pages + media)

---

## Core features

- [x] Authentication — login, logout, password reset (admin only, no self-registration)
- [x] Backoffice at `/login` with redirect to `/admin/dashboard`
- [x] Multiple admin accounts — created by superadmin only
- [x] Role management — two roles: `superadmin` and `admin`
- [x] Pages management — create, edit, delete pages with multi-language fields
- [x] Multi-language content — Italian and English per page (title, short_text, full_text, slug)
- [x] Media library — upload, browse, delete files (images, documents, any file type)
- [x] Page attachments — attach media to a page with title, description, position
- [x] Public read API — pages and media served without auth for frontend consumption

---

## Domain entities

| Entity             | Description                                                         | Admin CRUD         | Public API     |
| ------------------ | ------------------------------------------------------------------- | ------------------ | -------------- |
| User               | Admin accounts with role (superadmin / admin)                       | superadmin only    | ❌              |
| Page               | A content page with multi-language fields and optional attachments  | ✅                  | ✅ (active only)|
| PageTranslation    | Per-language content for a page (title, short_text, full_text, slug)| via Page editing   | via Page       |
| Media              | An uploaded file in the media library (image, document, etc.)       | ✅                  | ✅              |
| Attachment         | A media item attached to a specific page, with page-specific metadata | via Page editing | via Page       |

> `PageTranslation` and `Attachment` are not managed independently — they are always edited
> through their parent (Page). They do not have their own top-level admin screens.

---

## Navigation structure

### Admin panel sidebar

```text
Dashboard
Pages        (list + create + edit)
Media        (library grid + upload)
Users        (superadmin only — list + create + edit)
```

---

## UI style

- **Aesthetic:** clean, professional, neutral — typical backoffice feel
- **Reference:** Ghost CMS admin, Directus
- **Primary color:** `#2563eb` (blue)
- **Font:** Inter
- **Dark mode:** yes (admin panel only)

---

## API notes

- **API prefix:** `/api/v1`
- **Authentication:** Laravel Sanctum (SPA cookie auth)
- **Admin routes:** all under `/api/v1/admin/` — require `auth:sanctum`
- **Public routes:** `/api/v1/pages` and `/api/v1/media` — no auth, active content only

---

## Integrations

- [ ] None

---

## Out of scope

- No public user registration or login
- No comments or user-generated content
- No versioning / revision history for pages
- No scheduled publishing (published = active flag only)
- No nested pages / page tree hierarchy
- No e-commerce
