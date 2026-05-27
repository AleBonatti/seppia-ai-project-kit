import { api } from '@/lib/axios'
import type { AuthUser, LoginPayload } from './types'

export const authApi = {
  login: (payload: LoginPayload) =>
    api.post<{ data: AuthUser }>('/login', payload),

  logout: () =>
    api.post('/logout'),

  me: () =>
    api.get<{ data: AuthUser }>('/me'),
}
