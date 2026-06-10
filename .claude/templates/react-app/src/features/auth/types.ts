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

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  token: string
  email: string
  password: string
  password_confirmation: string
}
