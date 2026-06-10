import { api } from '@/lib/axios'
import type { AuthUser, LoginPayload, ForgotPasswordPayload, ResetPasswordPayload } from './types'

export const authApi = {
  login: (payload: LoginPayload) =>
    api.post<{ data: AuthUser }>('/login', payload),

  logout: () =>
    api.post('/logout'),

  me: () =>
    api.get<{ data: AuthUser }>('/me'),

  forgotPassword: (payload: ForgotPasswordPayload) =>
    api.post('/forgot-password', payload),

  resetPassword: (payload: ResetPasswordPayload) =>
    api.post('/reset-password', payload),
}
