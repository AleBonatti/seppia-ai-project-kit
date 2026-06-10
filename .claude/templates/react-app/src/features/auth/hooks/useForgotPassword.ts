import { useMutation } from '@tanstack/react-query'
import { authApi } from '../api'
import type { ForgotPasswordPayload } from '../types'

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => authApi.forgotPassword(payload),
  })
}
