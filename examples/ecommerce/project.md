# Project Specification — Bottega Rossi Shop

## Project identity

- **Name:** Bottega Rossi Shop
- **Client:** Bottega Rossi
- **Type:** small ecommerce
- **Description:** An online shop for a small Italian artisan producer selling jams, oils, and preserves. Customers browse products and place orders. The owner manages the catalogue and fulfils orders via the admin panel.

---

## Stack

- **Stack:** Laravel API + React SPA (TypeScript)
- **Stack file:** `stacks/laravel-react.md`

---

## Users and roles

- **Admin** — full access: manage products, categories, view and update orders
- **Customer** — browse products, place orders, view their order history

Public/unauthenticated access:

- Browse product catalogue (public)
- View individual product detail (public)
- Must be logged in to place an order

---

## Core features

- [x] Authentication (login, logout, registration, password reset)
- [x] Admin panel with sidebar navigation
- [x] Product catalogue — admins create/edit products with images, price, stock quantity
- [x] Category management — products belong to one category
- [x] Shopping cart — client-side cart state, no server persistence needed
- [x] Order placement — customer submits cart as an order; stock is decremented
- [x] Order management — admin views all orders, updates order status
- [x] Customer order history — logged-in customers see their past orders

---

## Domain entities

| Entity   | Description                                | Admin CRUD | Public view         |
| -------- | ------------------------------------------ | ---------- | ------------------- |
| User     | Customers and admins                       | ✅          | own profile only    |
| Category | Product groupings (e.g. Jams, Oils)        | ✅          | ✅ browse            |
| Product  | Individual items for sale                  | ✅          | ✅ browse + detail   |
| Order    | A customer's purchase of one or more items | ✅          | own orders only     |
| OrderItem| Line items within an order                 | read-only  | within own orders   |

---

## Navigation structure

### Admin panel sidebar

```text
Dashboard
Products     (list + create + edit)
Categories   (list + create + edit)
Orders       (list + detail view)
Customers    (list + view)
```

### Public storefront

```text
Home (featured products)
Shop (all products, filter by category)
Product detail
Cart
Checkout
My orders (authenticated)
```

---

## UI style

- **Aesthetic:** warm, artisanal, minimal — evokes quality handmade goods
- **Reference:** clean editorial layout, think Provisions or similar food brands
- **Primary color:** `#92400e` (warm amber-brown)
- **Font:** Inter with slightly increased letter spacing on headings
- **Dark mode:** no — light only for the storefront; dark mode for admin only

---

## API notes

- **API prefix:** `/api/v1`
- **Authentication:** Laravel Sanctum (SPA cookie)
- **Special requirements:**
  - Order creation must decrement product stock atomically (DB transaction)
  - If any product in the cart is out of stock at order time, return a 422 with details

---

## Integrations

- [ ] Stripe for payments (future phase — not in MVP)
- [ ] Mailgun for order confirmation emails (MVP)

---

## Out of scope

- No payment processing in MVP (orders are placed and paid on delivery or invoice)
- No product variants (size, colour) — single SKU per product
- No shipping calculation
- No multi-currency
