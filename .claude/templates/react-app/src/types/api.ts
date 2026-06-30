// ── Shared API response wrappers ──────────────────────────────────────────────
// Use these types to wrap all API responses throughout the app.
//
// The axios interceptor in lib/axios.ts converts all snake_case keys from the
// Laravel API to camelCase before the data reaches React Query. Domain types
// therefore always use camelCase — no manual mapping needed in api.ts files.

export interface ApiResponse<T> {
  data: T
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

// Matches Laravel's LengthAwarePaginator output after camelCase conversion.
// Raw Laravel fields: current_page, last_page, per_page, total, from, to
export interface PaginationMeta {
  currentPage: number
  lastPage: number
  perPage: number
  total: number
  from: number
  to: number
}

// ── API error shape (Laravel validation error format) ─────────────────────────
export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}
