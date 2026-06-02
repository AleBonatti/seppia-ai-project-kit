import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  DashboardSquare01Icon,
  LayoutLeftIcon,
  Moon02Icon,
  Sun03Icon,
  Logout01Icon,
  ArrowDown01Icon,
  type LucideProps,
} from '@hugeicons/react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { useTheme } from './useTheme'

// ── Types ─────────────────────────────────────────────────────────────────────

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<LucideProps>
  count?: number
}

interface NavGroup {
  group: string
  items: NavItem[]
}

// ── Navigation — edit this list per project ───────────────────────────────────
// Import the relevant Hugeicons and add one entry per entity.
const NAV: NavGroup[] = [
  {
    group: 'Main',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: DashboardSquare01Icon },
      // { label: 'Pages',  href: '/admin/pages',  icon: File01Icon },
      // { label: 'Media',  href: '/admin/media',  icon: Image01Icon },
    ],
  },
  {
    group: 'Settings',
    items: [
      // { label: 'Users', href: '/admin/users', icon: UserGroupIcon },
    ],
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function initials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

// ── Component ─────────────────────────────────────────────────────────────────

export function Sidebar() {
  const { user } = useAuth()
  const logout = useLogout()
  const { theme, toggle } = useTheme()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem('sidebar') === 'icononly'
  )

  const toggleCollapse = () => {
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem('sidebar', next ? 'icononly' : 'comfortable')
    document.documentElement.style.setProperty('--sb-w', next ? '62px' : '256px')
  }

  return (
    <aside className="flex flex-col border-r border-[--border] bg-[--bg] overflow-hidden">

      {/* Brand */}
      <div className="flex h-14 items-center justify-between px-4 border-b border-[--border] shrink-0">
        {!collapsed && (
          <span className="text-base font-semibold text-[--selected] truncate">
            Project Name
          </span>
        )}
        <button
          type="button"
          onClick={toggleCollapse}
          className="ml-auto rounded-lg p-1.5 text-[--faint] hover:bg-[--surface-2] hover:text-[--ink] transition-colors"
          aria-label="Toggle sidebar"
        >
          <LayoutLeftIcon size={18} strokeWidth={1.8} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-5">
        {NAV.filter(g => g.items.length > 0).map(({ group, items }) => (
          <div key={group}>
            {!collapsed && (
              <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-[--faint]">
                {group}
              </p>
            )}
            <div className="space-y-0.5">
              {items.map(item => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-[9px] px-3 py-2 text-sm transition-colors',
                      collapsed && 'justify-center px-2',
                      isActive
                        ? 'bg-[--accent]/15 text-[--accent] font-medium'
                        : 'text-[--muted] hover:bg-[--surface-2] hover:text-[--ink]',
                    )
                  }
                >
                  <item.icon size={20} strokeWidth={1.8} />
                  {!collapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {item.count !== undefined && (
                        <span className="rounded-full bg-[--surface-2] px-2 py-0.5 text-xs text-[--faint]">
                          {item.count}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User card */}
      <div className="shrink-0 border-t border-[--border] p-3">
        <div className="relative">
          <button
            type="button"
            onClick={() => setUserMenuOpen(o => !o)}
            className={cn(
              'flex w-full items-center gap-3 rounded-[9px] px-3 py-2 text-sm transition-colors hover:bg-[--surface-2]',
              collapsed && 'justify-center px-2',
            )}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[--accent] text-[--accent-ink] text-xs font-semibold">
              {user ? initials(user.name) : '?'}
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 text-left overflow-hidden">
                  <div className="truncate font-medium text-[--ink]">{user?.name}</div>
                  <div className="truncate text-xs text-[--faint]">{user?.role}</div>
                </div>
                <ArrowDown01Icon size={14} strokeWidth={1.8} className="text-[--faint]" />
              </>
            )}
          </button>

          {/* Dropdown menu */}
          {userMenuOpen && (
            <div className="absolute bottom-full left-0 mb-1 w-48 rounded-xl border border-[--border] bg-[--box] shadow-[--shadow] py-1 z-50">
              <button
                type="button"
                onClick={() => { toggle(); setUserMenuOpen(false) }}
                className="flex w-full items-center gap-3 px-3 py-2 text-sm text-[--muted] hover:bg-[--surface-2] hover:text-[--ink] transition-colors"
              >
                {theme === 'dark'
                  ? <Sun03Icon size={16} strokeWidth={1.8} />
                  : <Moon02Icon size={16} strokeWidth={1.8} />}
                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </button>
              <div className="my-1 border-t border-[--border]" />
              <button
                type="button"
                onClick={() => logout.mutate()}
                className="flex w-full items-center gap-3 px-3 py-2 text-sm text-[--muted] hover:bg-[--surface-2] hover:text-[--ink] transition-colors"
              >
                <Logout01Icon size={16} strokeWidth={1.8} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
