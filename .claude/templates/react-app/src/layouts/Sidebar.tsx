import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import type { HugeiconsProps } from '@hugeicons/react'
import {
  DashboardSquare01Icon,
  LayoutLeftIcon,
  Moon02Icon,
  Sun03Icon,
  Logout01Icon,
  ArrowDown01Icon,
} from '@/lib/icons'
import { cn } from '@/lib/utils'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { useTheme } from './useTheme'

// ── Types ─────────────────────────────────────────────────────────────────────

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<HugeiconsProps>
  count?: number
}

interface NavGroup {
  group: string
  items: NavItem[]
}

// ── Navigation — edit this list per project ───────────────────────────────────
// Import the relevant icons from @/lib/icons and add one entry per entity.
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

function toggleSidebarAttr(next: 'comfortable' | 'icononly') {
  document.documentElement.setAttribute('data-sidebar', next)
  localStorage.setItem('sidebar', next)
}

// ── Component ─────────────────────────────────────────────────────────────────

export function Sidebar() {
  const { user } = useAuth()
  const logout = useLogout()
  const { theme, setTheme } = useTheme()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem('sidebar') === 'icononly'
  )

  const toggleCollapse = () => {
    const next = !collapsed
    setCollapsed(next)
    toggleSidebarAttr(next ? 'icononly' : 'comfortable')
  }

  return (
    <aside className="flex flex-col bg-(--bg) overflow-hidden relative" style={{ padding: '18px 11px', gap: '4px' }}>

      {/* Brand */}
      <div className="flex items-center gap-1.5 px-2 pb-[18px]">
        {!collapsed && (
          <span className="flex-1 font-semibold text-2xl tracking-tight text-(--ink) truncate">
            Project Name
          </span>
        )}
        <button
          type="button"
          onClick={toggleCollapse}
          className={cn(
            'flex-none w-[30px] h-[30px] grid place-items-center rounded-lg bg-transparent text-(--muted) border-none cursor-pointer hover:bg-(--surface-2) hover:text-(--ink) transition-colors',
            collapsed && 'mx-auto',
          )}
          aria-label="Toggle sidebar"
        >
          <LayoutLeftIcon size={19} strokeWidth={1.8} />
        </button>
      </div>

      {/* Navigation */}
      {NAV.filter(g => g.items.length > 0).map(({ group, items }) => (
        <div key={group}>
          <p className={cn(
            'text-[10.5px] font-semibold uppercase tracking-[.09em] text-(--faint) px-3 pt-4 pb-[7px]',
            collapsed && 'text-center text-[8.5px] px-0',
          )}>
            {group}
          </p>
          <div>
            {items.map(item => (
              <NavLink
                key={item.href}
                to={item.href}
                title={item.label}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-[9px] px-3 py-[9px] text-[14.5px] font-medium transition-colors relative border-none w-full text-left cursor-pointer',
                    collapsed && 'justify-center px-0 py-[11px]',
                    isActive
                      ? 'text-(--selected) bg-(--surface-2) font-semibold'
                      : 'text-(--muted) hover:bg-(--surface-2) hover:text-(--ink)',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-[-14px] top-[9px] bottom-[9px] w-[3px] bg-(--accent) rounded-r-[3px]" />
                    )}
                    <span className="flex-none grid place-items-center">
                      <item.icon size={19} strokeWidth={1.8} />
                    </span>
                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        {item.count !== undefined && (
                          <span className="text-[11px] font-semibold tabular-nums bg-(--surface-2) text-(--muted) px-2 py-px rounded-full min-w-[24px] text-center">
                            {item.count}
                          </span>
                        )}
                      </>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      ))}

      {/* User card */}
      <div className="mt-auto pt-3">
        <div className="relative">
          {userMenuOpen && (
            <div
              className="fixed inset-0 z-[55]"
              onClick={() => setUserMenuOpen(false)}
            />
          )}

          {/* Dropdown menu */}
          {userMenuOpen && (
            <div className={cn(
              'absolute bottom-[calc(100%+8px)] left-0 right-0 min-w-[234px] bg-(--box) border border-(--border) rounded-[12px] p-2 z-[60] flex flex-col gap-[3px]',
              'shadow-(--shadow)',
              collapsed && 'right-auto w-[234px]',
            )}>
              <p className="text-[10.5px] font-semibold uppercase tracking-[.07em] text-(--faint) px-2 pt-1.5 pb-1">
                Appearance
              </p>
              {/* Segmented dark / light control */}
              <div className="flex gap-[5px] px-0.5 pb-1">
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={cn(
                    'flex-1 inline-flex items-center justify-center gap-1.5 p-2 bg-transparent text-(--muted) cursor-pointer border border-(--border) rounded-[9px] font-medium text-[13px] transition-colors',
                    theme === 'dark' && 'bg-(--accent) text-(--accent-ink) border-(--accent) font-semibold',
                  )}
                >
                  <Moon02Icon size={15} strokeWidth={1.8} /> Dark
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={cn(
                    'flex-1 inline-flex items-center justify-center gap-1.5 p-2 bg-transparent text-(--muted) cursor-pointer border border-(--border) rounded-[9px] font-medium text-[13px] transition-colors',
                    theme === 'light' && 'bg-(--accent) text-(--accent-ink) border-(--accent) font-semibold',
                  )}
                >
                  <Sun03Icon size={15} strokeWidth={1.8} /> Light
                </button>
              </div>
              <div className="h-px bg-(--border) my-[5px]" />
              <button
                type="button"
                onClick={() => { logout.mutate(); setUserMenuOpen(false) }}
                className="flex items-center gap-[11px] px-2 py-[9px] bg-transparent border-none text-(--ink) cursor-pointer font-medium text-[13.5px] rounded-[9px] text-left hover:bg-(--surface-2) transition-colors"
              >
                <span className="text-(--muted)"><Logout01Icon size={17} strokeWidth={1.8} /></span>
                Sign out
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setUserMenuOpen(o => !o)}
            className={cn(
              'flex w-full items-center gap-[10px] p-2 cursor-pointer bg-transparent border border-(--border) rounded-[12px] text-left text-(--ink) transition-colors hover:bg-(--surface-2)',
              collapsed && 'justify-center p-[7px]',
              userMenuOpen && '[&_.uc-caret]:rotate-180',
            )}
          >
            <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-(--surface-2) text-(--ink) border border-(--border) text-[13px] font-semibold">
              {user ? initials(user.name) : '?'}
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 flex flex-col min-w-0 leading-[1.25]">
                  <span className="text-[13.5px] font-semibold truncate">{user?.name}</span>
                  <span className="text-[11.5px] text-(--muted)">{user?.role}</span>
                </div>
                <span className="uc-caret text-(--muted) flex-none transition-transform duration-[180ms]">
                  <ArrowDown01Icon size={16} strokeWidth={1.8} />
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  )
}
