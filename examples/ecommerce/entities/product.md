# Entity Specification — Product

## Entity name

**Name:** Product
**Description:** An item available for purchase in the shop, with a price, stock quantity, and optional image.

---

## Fields

| Field         | Type      | Required | Validation                     | Notes                                      |
| ------------- | --------- | -------- | ------------------------------ | ------------------------------------------ |
| `id`          | integer   | auto     | —                              | Primary key                                |
| `category_id` | foreignId | yes      | exists:categories,id           | Belongs to Category                        |
| `name`        | string    | yes      | max:255                        |                                            |
| `slug`        | string    | auto     | unique                         | Auto-generated from name in CreateAction   |
| `description` | text      | no       | nullable                       |                                            |
| `price`       | integer   | yes      | min:0                          | Stored in euro cents (e.g. 850 = €8.50)    |
| `stock`       | integer   | yes      | min:0                          | Units available; 0 = out of stock          |
| `is_active`   | boolean   | yes      | default: true                  | Inactive products hidden from public       |
| `image_path`  | string    | no       | nullable                       | Path to uploaded image                     |
| `created_at`  | timestamp | auto     | —                              |                                            |
| `updated_at`  | timestamp | auto     | —                              |                                            |

---

## Relationships

| Relation    | Type      | Target    | Notes                          |
| ----------- | --------- | --------- | ------------------------------ |
| `category`  | belongsTo | Category  |                                |
| `orderItems`| hasMany   | OrderItem | All order line items           |

---

## Permissions

| Action | Admin | Customer (auth) | Public |
| ------ | ----- | --------------- | ------ |
| list   | ✅     | ✅ (active only) | ✅ (active only) |
| view   | ✅     | ✅ (active only) | ✅ (active only) |
| create | ✅     | ❌               | ❌      |
| update | ✅     | ❌               | ❌      |
| delete | ✅     | ❌               | ❌      |

---

## API endpoints

| Method | Path                       | Description                   | Auth     |
| ------ | -------------------------- | ----------------------------- | -------- |
| GET    | `/api/v1/products`         | Paginated list (public)       | no       |
| GET    | `/api/v1/products/{slug}`  | Single product by slug        | no       |
| POST   | `/api/v1/products`         | Create                        | admin    |
| PATCH  | `/api/v1/products/{id}`    | Update                        | admin    |
| DELETE | `/api/v1/products/{id}`    | Delete (soft delete)          | admin    |

---

## Admin UI

- **List page** — table: image thumbnail, name, category, price (formatted €), stock, status (active/inactive), actions
- **Create page** — form: name, category selector, description, price (in euros — convert to cents in Action), stock, is_active toggle, image upload
- **Edit page** — same form pre-filled

Filters:

- [ ] Filter by category
- [ ] Filter by status (active / inactive)
- [ ] Search by name

---

## Business rules

- Slug auto-generated from name; must be globally unique; update slug if name changes only when no orders exist for the product
- Price is stored in cents; the frontend always displays as euros (`price / 100`)
- Soft deletes — deleted products remain in the DB for order history integrity
- `is_active = false` hides the product from the public API but keeps it visible in admin
- Stock cannot go below 0 (enforce in the Order creation action, not here)

---

## Notes for code generation

- Use `SoftDeletes` trait on the Model
- Admin list query scope: `withTrashed()` to show soft-deleted items with a "Deleted" badge
- Public list query: `where('is_active', true)` and no soft-deleted items
- Image upload: store in `storage/app/public/products/`, return public URL in Resource
