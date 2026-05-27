# Project Specification — GymBook

## Project identity

- **Name:** GymBook
- **Client:** Palestra Centrale Milano
- **Type:** web application
- **Description:** A gym booking system that lets members reserve time slots for classes and equipment. Admins manage availability, view bookings, and manage members.

---

## Stack

- **Stack:** Laravel API + React SPA (TypeScript)
- **Stack file:** `stacks/laravel-react.md`

---

## Users and roles

- **Admin** — full access: manage classes, time slots, members, view all bookings
- **Member** — can browse available classes, make and cancel their own bookings

Public/unauthenticated access:

- None — login required to access any part of the app

---

## Core features

- [x] Authentication (login, logout, password reset)
- [x] Admin panel with sidebar navigation
- [x] Class management — admins create and manage gym classes (yoga, spinning, etc.)
- [x] Time slot management — each class has scheduled time slots with capacity limits
- [x] Member management — admins view and manage registered members
- [x] Booking system — members reserve a spot in a time slot; max capacity enforced
- [x] Booking cancellation — members can cancel up to 2 hours before the slot
- [x] Admin booking overview — admins see all bookings with filters by date and class

---

## Domain entities

| Entity    | Description                                       | Admin CRUD | Member view      |
| --------- | ------------------------------------------------- | ---------- | ---------------- |
| User      | Members and admins                                | ✅          | own profile only |
| Class     | A type of gym activity (e.g. Yoga, Spinning)      | ✅          | ✅ browse         |
| TimeSlot  | A scheduled instance of a class with capacity     | ✅          | ✅ browse + book  |
| Booking   | A member's reservation for a specific time slot   | ✅          | own bookings      |

---

## Navigation structure

### Admin panel sidebar

```text
Dashboard
Classes      (list + create + edit)
Time Slots   (list + create + edit)
Bookings     (list, read-only view)
Members      (list + view)
```

### Member area

```text
Browse Classes  (public class list)
My Bookings     (member's own bookings + cancellation)
```

---

## UI style

- **Aesthetic:** clean, energetic, minimal
- **Reference:** Linear-inspired dashboard, with slightly warmer tones
- **Primary color:** `#16a34a` (green — energy, activity)
- **Font:** Inter
- **Dark mode:** yes

---

## API notes

- **API prefix:** `/api/v1`
- **Authentication:** Laravel Sanctum (SPA cookie)
- **Special requirements:** booking creation must check capacity atomically (use DB transaction + row locking to prevent overbooking)

---

## Integrations

- [ ] None for MVP

---

## Out of scope

- No payment processing — membership is assumed to exist outside this system
- No recurring class schedules (each time slot is created manually)
- No waitlist functionality
- No mobile app — web only
