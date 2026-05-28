export interface AuthUser {
  id: number
  name: string
  email: string
  role: UserRole
}

export type UserRole = 'admin' | 'user'

export interface LoginPayload {
  email: string
  password: string
}
