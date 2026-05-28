import { useQuery } from '@tanstack/react-query'
import { authApi } from '../api'
import type { AuthUser } from '../types'

export function useAuth(): {
  user: AuthUser | undefined
  isLoading: boolean
  isAuthenticated: boolean
} {
  const { data, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authApi.me().then(r => r.data.data),
    retry: false,           // don't retry on 401 — user is simply not logged in
    staleTime: Infinity,    // auth state doesn't go stale on its own
  })

  return {
    user: data,
    isLoading,
    isAuthenticated: !!data,
  }
}
