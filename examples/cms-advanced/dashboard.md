# Dashboard Specification

---

## Stats cards

| Metric       | Value source   | Notes                      |
| ------------ | -------------- | -------------------------- |
| Total pages  | `COUNT(pages)` | Clicking links to /pages   |
| Total media  | `COUNT(media)` |                            |
| Total users  | `COUNT(users)` | Clicking links to /users   |

---

## Recent activity

- [x] Last 5 pages created — show title, author, date
- [x] Last 5 media uploads — show filename, size, date
- [x] Last 5 successful login attempts — show admin name and datetime

---

## Quick actions

- [ ] None

---

## Notes

- Stats are not real-time — standard React Query polling is fine
- Show a welcome message with the logged-in user's name at the top of the page
