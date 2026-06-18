import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api'
import type { LoginPayload } from '../types'
import type { AxiosError } from 'axios'

interface LoginError {
  message: string
}

export function useLogin() {
  const queryClient = useQueryClient()
  const navigate    = useNavigate()

  return useMutation<unknown, AxiosError<LoginError>, LoginPayload>({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (response) => {
      // Seed the auth cache directly — no extra /me round-trip needed.
      queryClient.setQueryData(['auth', 'me'], (response as { data: { data: unknown } }).data.data)
      navigate('/admin/dashboard')
    },
    // onError is intentionally omitted — the error is read from mutation.error
    // in the component so the message (422 vs 429) can be displayed correctly.
  })
}
