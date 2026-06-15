import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { Spinner } from '@/components/ui/Spinner'

interface AuthGuardProps {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { data: user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
