// ── Shared API response wrappers ──────────────────────────────────────────────
// Use these types to wrap all API responses throughout the app.

export interface ApiResponse<T> {
  data: T
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

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
