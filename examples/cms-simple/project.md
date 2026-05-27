# Project Specification — Studio Architetti Bianchi — Website CMS

## Project identity

- **Name:** Bianchi Architetti CMS
- **Client:** Studio Architetti Bianchi
- **Type:** website with admin CMS
- **Description:** A content-managed website for an architecture studio. The studio manages their project portfolio, news/blog posts, and team members via an admin panel. The public website displays this content.

---

## Stack

- **Stack:** Laravel API + React SPA (TypeScript)
- **Stack file:** `stacks/laravel-react.md`

---

## Users and roles

- **Admin** — full access to all content sections via admin panel (single admin user)

Public/unauthenticated access:

- Full public website: browse portfolio, read news, view team — no login required

---

## Core features

- [x] Authentication (login, logout — single admin user only)
- [x] Admin panel with sidebar navigation
- [x] Portfolio management — admin manages architectural projects with images, description, year
- [x] News/Blog — admin writes and publishes articles
- [x] Team members — admin manages staff profiles (name, role, bio, photo)
- [x] Page content — admin edits static page content (About, Contact)
- [x] Public API endpoints for all content — consumed by the React frontend

---

## Domain entities

| Entity      | Description                                       | Admin CRUD | Public view |
| ----------- | ------------------------------------------------- | ---------- | ----------- |
| User        | Admin users                                       | ✅          | ❌           |
| Project     | Architecture portfolio item                       | ✅          | ✅           |
| Post        | News/blog article                                 | ✅          | ✅ (published only) |
| TeamMember  | Staff profile                                     | ✅          | ✅           |
| PageContent | Editable content blocks for static pages          | ✅          | ✅           |

---

## Navigation structure

### Admin panel sidebar

```text
Dashboard
Portfolio    (list + create + edit)
News         (list + create + edit)
Team         (list + create + edit)
Pages        (edit About, edit Contact)
```

### Public site (consumed by frontend)

All content is served via public API endpoints — the React app handles routing.

---

## UI style

- **Aesthetic:** refined, minimal, architectural — lots of white space
- **Reference:** clean editorial, think Dezeen or similar architecture publications
- **Primary color:** `#1c1c1c` (near-black — sophisticated, typographic)
- **Font:** Inter
- **Dark mode:** admin panel only; public site is light

---

## API notes

- **API prefix:** `/api/v1`
- **Authentication:** Laravel Sanctum (SPA cookie)
- **Public endpoints:** Portfolio, Posts (published), TeamMembers — no auth required
- **Admin endpoints:** all CRUD — auth required

---

## Integrations

- [ ] None

---

## Out of scope

- No comments or user-generated content
- No e-commerce
- No multi-language support
- No media library — images uploaded per entity, stored locally
