import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api'
import type { ResetPasswordPayload } from '../types'

export function useResetPassword() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => authApi.resetPassword(payload),
    onSuccess: () => {
      navigate('/login', { state: { passwordReset: true } })
    },
  })
}
