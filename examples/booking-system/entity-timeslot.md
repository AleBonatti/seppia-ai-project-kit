# Entity Specification — TimeSlot

## Entity name

**Name:** TimeSlot
**Description:** A scheduled instance of a gym class at a specific date and time, with a maximum number of bookable spots.

---

## Fields

| Field        | Type      | Required | Validation                       | Notes                                         |
| ------------ | --------- | -------- | -------------------------------- | --------------------------------------------- |
| `id`         | integer   | auto     | —                                | Primary key                                   |
| `class_id`   | foreignId | yes      | exists:classes,id                | Belongs to Class                              |
| `starts_at`  | datetime  | yes      | after:now                        | Start of the slot                             |
| `ends_at`    | datetime  | yes      | after:starts_at                  | End of the slot                               |
| `capacity`   | integer   | yes      | min:1, max:100                   | Max number of bookings allowed                |
| `created_at` | timestamp | auto     | —                                |                                               |
| `updated_at` | timestamp | auto     | —                                |                                               |

---

## Relationships

| Relation   | Type      | Target | Notes                              |
| ---------- | --------- | ------ | ---------------------------------- |
| `class`    | belongsTo | Class  | The activity this slot belongs to  |
| `bookings` | hasMany   | Booking| All bookings for this slot         |

---

## Computed / virtual attributes

- `bookings_count` — number of confirmed bookings (eager load via `withCount`)
- `available_spots` — `capacity - bookings_count` (append to Resource)
- `is_full` — `available_spots === 0`

---

## Permissions

| Action | Admin | Member        |
| ------ | ----- | ------------- |
| list   | ✅     | ✅ (with filter by class/date) |
| view   | ✅     | ✅             |
| create | ✅     | ❌             |
| update | ✅     | ❌             |
| delete | ✅     | ❌             |

---

## API endpoints

| Method | Path                          | Description              | Auth     |
| ------ | ----------------------------- | ------------------------ | -------- |
| GET    | `/api/v1/time-slots`          | Paginated list           | yes      |
| GET    | `/api/v1/time-slots/{id}`     | Single slot              | yes      |
| POST   | `/api/v1/time-slots`          | Create                   | admin    |
| PATCH  | `/api/v1/time-slots/{id}`     | Update                   | admin    |
| DELETE | `/api/v1/time-slots/{id}`     | Delete (only if no bookings) | admin |

---

## Admin UI

- **List page** — table: class name, date/time, capacity, bookings count, available spots, actions
- **Create page** — form: class selector, start date/time, end date/time, capacity
- **Edit page** — same form pre-filled; show current booking count; disable capacity reduction below current bookings

Filters:

- [ ] Filter by class
- [ ] Filter by date range
- [ ] Filter by availability (show only slots with open spots)

---

## Business rules

- A time slot cannot be deleted if it has any bookings
- Capacity cannot be reduced below the current number of confirmed bookings
- `starts_at` must be in the future when creating; editing a past slot is admin-only
- `ends_at` must be after `starts_at` and on the same day

---

## Notes for code generation

- Eager load `bookings_count` by default in the index query
- Append `available_spots` and `is_full` to the API Resource
- Use a `TimeSlotQuery` class to handle list filters cleanly
