import { LogOut, Moon, Sun, User } from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { useTheme } from './useTheme'
import { Button } from '@/components/ui/Button'

export function Topbar() {
  const { user }        = useAuth()
  const logout          = useLogout()
  const { theme, toggle } = useTheme()

  return (
    <header className="flex h-14 items-center justify-end border-b border-gray-200 bg-white px-6 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center gap-4">
        {/* Current user */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <User size={16} />
          <span>{user?.name}</span>
        </div>

        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggle}
          className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

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
