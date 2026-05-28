# Project Specification

> Copy this file into your project and fill in every section.
> Claude will read this before generating any code.
> Delete sections that are not applicable. Do not leave placeholder text.

---

## Project identity

- **Name:** [Project name, e.g. "Floreria Rossi" or "GymBook"]
- **Client:** [Client or company name]
- **Type:** [website | ecommerce | web application | admin tool]
- **Description:** [1–3 sentences describing what this project is and who uses it]

---

## Stack

- **Stack:** Laravel API + React SPA (TypeScript)
- **Stack file:** `stacks/laravel-react.md`

---

## Users and roles

List the types of users and what they can do.

- **Admin** — full access to all content and settings via admin panel
- **[Role 2]** — [what they can do, e.g. "can book appointments, view their own history"]
- **[Role 3 if any]** — [...]

Public/unauthenticated access:

- [What anonymous visitors can see or do, e.g. "browse products, read blog posts"]

---

## Core features

List the main features of this project. Be specific — each item here maps to generated code.

- [ ] Authentication (login, logout, password reset)
- [ ] Admin panel with sidebar navigation
- [ ] [Feature 1, e.g. "Product catalogue with categories and filters"]
- [ ] [Feature 2, e.g. "Shopping cart and checkout"]
- [ ] [Feature 3, e.g. "Order management for admins"]
- [ ] [Feature 4...]

---

## Domain entities

List every domain entity. Each entity gets its own `specs/entities/[entity].md` file.

| Entity       | Description                              | Admin CRUD | Public view |
| ------------ | ---------------------------------------- | ---------- | ----------- |
| User         | Authenticated users and admins           | ✅          | ❌           |
| [Entity 2]   | [Short description]                      | ✅          | ✅           |
| [Entity 3]   | [Short description]                      | ✅          | ❌           |

---

## Navigation structure

### Admin panel sidebar

```
Dashboard
[Entity 1] (list + create + edit)
[Entity 2] (list + create + edit)
Settings
```

### Public site (if applicable)

```
Home
[Section 1]
[Section 2]
Contact
```

---

## Dashboard

The admin dashboard (`/admin/dashboard`) should display:

### Stats cards

| Metric         | Value source                        | Notes                          |
| -------------- | ----------------------------------- | ------------------------------ |
| [e.g. Total pages] | `COUNT(pages)`                  | [e.g. link to pages list]      |
| [e.g. Active pages] | `COUNT(pages WHERE active=true)` | [e.g. highlighted in green]   |
| [e.g. Total users] | `COUNT(users)`                  | [e.g. superadmin only]         |

### Recent activity (optional)

- [ ] [e.g. Last 5 pages created — show title, date, author]
- [ ] [e.g. Last 5 media uploads — show filename, size, date]
- [ ] None — stats only

### Quick actions (optional)

- [ ] [e.g. "New page" button linking to /admin/pages/create]
- [ ] None

### Notes

- [e.g. "Stats are fetched from dedicated `/api/v1/admin/dashboard` endpoint"]
- [e.g. "No real-time updates — standard React Query polling interval"]

---

## UI style

- **Aesthetic:** [e.g. "clean and minimal", "bold and editorial", "friendly and colorful"]
- **Reference:** [e.g. "similar to Linear", "inspired by Stripe dashboard", "warm tones like Notion"]
- **Primary color:** [e.g. "#2563eb" (blue) or "neutral gray with green accents"]
- **Font:** [e.g. "Inter (default)" or "Geist"]
- **Dark mode:** [yes | no | optional]

---

## API notes

- **API prefix:** `/api/v1`
- **Authentication:** Laravel Sanctum (SPA cookie)
- **Special requirements:** [any non-standard API needs, e.g. "webhook for payment provider"]

---

## Integrations

List any third-party services this project connects to.

- [ ] [e.g. Stripe for payments]
- [ ] [e.g. Mailgun for transactional email]
- [ ] [e.g. Cloudinary for image uploads]
- [ ] None

---

## Out of scope

List things that will NOT be built in this project (useful to prevent AI from adding unwanted features).

- [e.g. "No multi-tenancy — single client only"]
- [e.g. "No public-facing API — admin only"]
- [e.g. "No real-time features — no WebSockets"]
