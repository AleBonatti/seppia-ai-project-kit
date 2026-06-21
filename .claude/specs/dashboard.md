# Dashboard Specification

> Copy this file into your project as `.claude/specs/dashboard.md` and fill in every section.
> Claude will read this before generating the dashboard page.
> Delete sections that are not applicable. Do not leave placeholder text.

---

## Stats cards

Each card uses the `StatCard` component (`label`, `value`, `icon`, `delta`, `deltaUp`).
List each metric you want displayed at the top of the dashboard.

| Metric              | Value source                        | Notes                           |
| ------------------- | ----------------------------------- | ------------------------------- |
| [e.g. Total pages]  | `COUNT(pages)`                      | [e.g. clicking links to /pages] |
| [e.g. Total media]  | `COUNT(media)`                      |                                 |
| [e.g. Total users]  | `COUNT(users)`                      | [e.g. superadmin only]          |

Stats are fetched from a dedicated `/api/v1/admin/dashboard` endpoint (generated alongside the page).

---

## Recent activity

List any recent-item feeds to show below the stat cards.
Each feed becomes a small table or list inside the dashboard.

- [ ] [e.g. Last 5 pages created — show title, author, date]
- [ ] [e.g. Last 5 media uploads — show filename, size, date]
- [ ] [e.g. Last 5 login attempts — show user, IP, date, success/fail]
- [ ] None

---

## Quick actions (optional)

Buttons or links displayed prominently on the dashboard to let admins jump to common tasks.

- [ ] [e.g. "New page" → /admin/pages/create]
- [ ] [e.g. "Upload media" → /admin/media]
- [ ] None

---

## Notes

Any additional requirements for the dashboard.

- [e.g. "Stats are not real-time — standard React Query polling is fine"]
- [e.g. "Show a welcome message with the logged-in user's name"]
