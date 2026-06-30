import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1',
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// Convert snake_case keys to camelCase recursively so domain types can always
// use camelCase regardless of what the Laravel API returns.
function camelize(str: string): string {
  return str.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())
}

function toCamel(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(toCamel)
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [camelize(k), toCamel(v)])
    )
  }
  return value
}

api.interceptors.response.use(
  (response) => {
    response.data = toCamel(response.data)
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)
