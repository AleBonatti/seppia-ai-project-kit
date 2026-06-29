# Project Specification

## Project identity

- **Name:** SeppiaCms
- **Client:** Generic multi-admin CMS
- **Type:** web application with admin backoffice
- **Description:** A headless CMS with a backoffice accessible at `/login`. Admins manage pages with multi-language content and a media library. Pages can have multiple file attachments, each with page-specific metadata.

---

## Stack

- **Stack:** Laravel API + React SPA (TypeScript)
- **Stack file:** `stacks/laravel-react.md`

---

## Users and roles

List the types of users and what they can do.

- **Superadmin** — full access to everything: manage all pages, all media, all admin users, system settings
- **Admin** — can manage pages and media, can manage other admin but not superadmin accounts (superadmin role is hidden for them) or access system settings

Public/unauthenticated access:

- None — `/login` is the only public route; everything else requires authentication
- The CMS exposes a public read-only API for the frontend to consume (pages + media)

---

## Core features

List the main features of this project. Be specific — each item here maps to generated code.

- [*] Authentication (login, logout, password reset) (admin only, no self-registration)
- [x] Backoffice at login at `/login` with redirect to `/admin/dashboard` once logged. Everything under `/admin` route is part of the protected backoffice
- [x] Multiple admin accounts — created by superadmin and admin
- [x] Role management — two roles: `superadmin` and `admin`
- [x] Pages management — create, edit, delete pages with multi-language fields
- [x] Multi-language content — Italian and English per page (title, short_text, full_text, slug)
- [x] Media library — upload, browse, delete files (images, documents, any file type)
- [x] Page attachments — attach media to a page with title, description, position
- [x] Public read API — pages and media served without auth for frontend consumption
- [x] Translation agent — after a page is saved in the primary locale (Italian), a background
      agent auto-generates the English translation via the Claude API (see
      `.claude/specs/agents/translation-agent.md`)

---

## Domain entities

List every domain entity. Each entity gets its own `specs/entities/[entity].md` file.

| Entity          | Description                                                           | Admin CRUD       | Public view      |
| --------------- | --------------------------------------------------------------------- | ---------------- | ---------------- |
| User            | Authenticated users and admins                                        | ✅               | ❌               |
| Page            | A content page with multi-language fields and optional attachments    | ✅               | ✅ (active only) |
| PageTranslation | Per-language content for a page (title, short_text, full_text, slug)  | via Page editing | via Page         |
| Media           | An uploaded file in the media library (image, document, etc.)         | ✅               | ✅               |
| Attachment      | A media item attached to a specific page, with page-specific metadata | via Page editing | via Page         |

---

## Navigation structure

### Admin panel sidebar

```
Dashboard
--- Contents (group label separator)
Pages        (list + create + edit)
--- Media (group label separator)
Media        (library grid + upload)
--- Settings (group label separator)
Users        (superadmin only — list + create + edit)
Settings    (user account settings page)
```

### Public site (if applicable)

```
No public site in this version, we are just testing the admin backend.
```

---

## Dashboard

See `.claude/specs/dashboard.md` for the full dashboard specification.

---

## API notes

- **API prefix:** `/api/v1`
- **Authentication:** Laravel Sanctum (SPA cookie)
- **Special requirements:** [any non-standard API needs, e.g. "webhook for payment provider"]

---

## Integrations

List any third-party services this project connects to.

- [x] Anthropic Claude API — powers the translation agent. Requires `ANTHROPIC_API_KEY` in `.env`.
      Configured via `config/agents.php` (`translation.enabled`, `translation.model`).

---

## Background agents

This project enables the optional **translation agent**. Its full configuration lives in
`.claude/specs/agents/translation-agent.md`:

- **Primary locale:** `it` — **secondary:** `[en]`
- **Entity:** Page — translates `title`, `short_text`, `full_text` (never `slug`)
- **Trigger:** `on_save` — `CreatePageAction` and `UpdatePageAction` dispatch `TranslateEntityJob`
  after persisting; the translation runs on the queue, so saves return immediately.

---

## Out of scope

- No public user registration or login
- No comments or user-generated content
- No versioning / revision history for pages
- No scheduled publishing (published = active flag only)
- No nested pages / page tree hierarchy
- No e-commerce
