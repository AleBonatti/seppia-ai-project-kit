# Stack: SaaS Laravel + React (TypeScript)

This stack defines a fullstack architecture with:

- Laravel as API backend
- React (TypeScript) as frontend
- TailwindCSS for styling
- Strict separation between domain and UI

---

## 1. Backend (Laravel)

### Core principles

- API-first architecture
- No business logic in controllers
- Use Actions for business logic
- Use DTOs for input/output
- Use FormRequest for validation
- Use Policies for authorization
- Prefer explicit code over abstraction

### Structure

app/
Actions/
DTOs/
Http/
Controllers/
Requests/
Models/
Policies/
Queries/
Services/ (only if necessary)

### API style

- RESTful endpoints
- Resource-based structure
- JSON responses only
- Consistent error format

### Auth

- Laravel Sanctum (SPA authentication)
- Role-based access control (RBAC)

---

## 2. Frontend (React + TypeScript)

### Core principles

- Feature-based architecture
- Strict TypeScript (no `any`)
- UI driven by domain models
- No unnecessary global state
- React Query for server state

### Structure

src/
app/
features/
auth/
dashboard/
users/
components/
hooks/
services/
types/

## State management

- React Query → server state
- Local state → React hooks only
- Zustand only if strictly needed

---

## 3. Styling (Tailwind CSS)

### Principles

- Utility-first approach
- Avoid custom CSS unless necessary
- Design system must be consistent
- Mobile-first approach

### UI rules

- spacing based on 4/8 grid system
- consistent border radius scale
- soft shadows only
- dark mode supported by default

---

## 4. UI Kit (shared assumptions)

### Components

- Button
- Input
- Modal
- Card
- Table
- Sidebar layout
- Topbar layout

### Layout model

- Admin layout with sidebar + topbar
- Content rendered via router outlet

---

## 5. Icons

- Lucide Icons preferred
- Consistent stroke width
- No mixed icon libraries

---

## 6. API ↔ Frontend contract

- Types must be explicit
- Avoid implicit transformations
- Backend DTOs must map 1:1 with frontend types where possible

---

## 7. Testing

### Backend

- Pest PHP
- Feature tests preferred over unit tests for business logic

### Frontend

- Vitest
- React Testing Library

---

## 8. Anti-patterns (IMPORTANT)

- No monolithic Service layer
- No dynamic schema systems (no JSON-driven entities)
- No business logic in controllers
- No global state abuse
- No “god components”

---

## 9. AI Usage Rule

When generating code using this stack:

- Follow backend rules strictly
- Follow frontend feature-based structure
- Prefer explicit implementations over abstractions
- Keep code readable over generic
