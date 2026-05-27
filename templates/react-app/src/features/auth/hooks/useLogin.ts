import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api'
import type { LoginPayload } from '../types'

export function useLogin() {
  const queryClient = useQueryClient()
  const navigate    = useNavigate()

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (response) => {
      queryClient.setQueryData(['auth', 'me'], response.data.data)
      navigate('/admin/dashboard')
    },
  })
}
