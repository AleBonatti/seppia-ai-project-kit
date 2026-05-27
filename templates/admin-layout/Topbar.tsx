import { LogOut, User } from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { Button } from '@/components/ui/Button'

export function Topbar() {
  const { user }  = useAuth()
  const logout    = useLogout()

  return (
    <header className="flex h-14 items-center justify-end border-b border-gray-200 bg-white px-6 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center gap-4">
        {/* Current user */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <User size={16} />
          <span>{user?.name}</span>
        </div>

        {/* Logout */}
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<LogOut size={14} />}
          onClick={() => logout.mutate()}
          isLoading={logout.isPending}
        >
          Logout
        </Button>
      </div>
    </header>
  )
}
