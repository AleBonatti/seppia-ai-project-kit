import { useLayoutEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import type { HugeiconsProps } from '@hugeicons/react'
import {
  DashboardSquare01Icon,
  LayoutLeftIcon,
  Moon02Icon,
  Sun03Icon,
  Logout01Icon,
  ArrowUp01Icon,
  Settings01Icon,
  UserAccountIcon,
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
      // { label: 'Posts',  href: '/admin/posts',  icon: File01Icon },
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
  const { data: user } = useAuth()
  const logout = useLogout()
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem('sidebar') === 'icononly'
  )

  // Measure the menu body so the slide transform knows exactly how far to travel.
  const menuBodyRef = useRef<HTMLDivElement>(null)
  const [menuBodyH, setMenuBodyH] = useState(264)
  useLayoutEffect(() => {
    if (menuBodyRef.current) setMenuBodyH(menuBodyRef.current.scrollHeight)
  }, [theme, collapsed])

  const toggleCollapse = () => {
    const next = !collapsed
    setCollapsed(next)
    toggleSidebarAttr(next ? 'icononly' : 'comfortable')
  }

  return (
    <aside
      className="flex flex-col overflow-visible relative"
      style={{ background: 'var(--sidebar)', padding: '18px 11px', gap: 4 }}
    >
      {/* Brand */}
      <div className={cn(
        'flex items-center gap-[5px] px-2 pb-[18px]',
        collapsed && 'flex-col gap-3.5 px-0',
      )}>
        {/* Logo mark — replace SVG with project logo if needed */}
        {!collapsed && (
          <span
            className="flex-none grid place-items-center"
            style={{ width: 34, height: 34, color: 'var(--accent)' }}
          >
            <svg viewBox="0 0 512 512" fill="currentColor" style={{ width: '100%', height: '100%', display: 'block' }} aria-hidden="true">
              <path d="M455.6 349.2c-45.891-39.09-36.67-77.877-16.095-128.11C475.16 134.04 415.967 34.14 329.93 8.3C237.04-19.6 134.252 24.341 99.677 117.147a180.9 180.9 0 0 0-10.988 73.544c1.733 29.543 14.717 52.97 24.09 80.3c17.2 50.161-28.1 92.743-66.662 117.582c-46.806 30.2-36.319 39.857-8.428 41.858c23.378 1.68 44.478-4.548 65.265-15.045c9.2-4.647 40.687-18.931 45.13-28.588c-12.184 26.59-36.962 72.702-21.463 102.102c19.1 36.229 67.112-31.77 76.709-45.812c8.591-12.572 42.963-81.279 63.627-46.926c18.865 31.361 8.6 76.391 35.738 104.622c32.854 34.2 51.155-18.312 51.412-44.221c.163-16.411-6.1-95.852 29.9-59.944c21.421 21.381 52.905 71.181 88.561 67.023c38.736-4.516-22.123-67.967-28.262-78.695c5.393 4.279 53.665 34.128 53.818 9.52c.11-18.789-30.085-34.667-42.524-45.267" />
            </svg>
          </span>
        )}
        {!collapsed && (
          <span className="flex-1 font-semibold text-2xl tracking-[-0.03em] text-(--ink) whitespace-nowrap truncate">
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
          aria-label={collapsed ? 'Expand menu' : 'Collapse menu'}
        >
          <LayoutLeftIcon size={19} strokeWidth={1.8} />
        </button>
      </div>

      {/* Navigation */}
      {NAV.filter(g => g.items.length > 0).map(({ group, items }) => (
        <div key={group}>
          {/* Group label: text when expanded, 1px rule when collapsed */}
          {collapsed ? (
            <div className="mx-3.5 my-2 mt-[15px] h-px" style={{ background: 'color-mix(in srgb, var(--faint) 42%, transparent)' }} />
          ) : (
            <p className="text-[10.5px] font-semibold uppercase tracking-[.09em] text-(--faint) px-3 pt-4 pb-[7px] whitespace-nowrap overflow-hidden">
              {group}
            </p>
          )}
          <div>
            {items.map(item => (
              <NavLink
                key={item.href}
                to={item.href}
                title={item.label}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-(--r-sm) px-3 py-[9px] text-[14.5px] font-medium transition-colors relative border-none w-full text-left cursor-pointer no-underline',
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
                      <item.icon size={19} strokeWidth={1.8} color={isActive ? 'var(--selected)' : undefined} />
                    </span>
                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        {item.count !== undefined && (
                          <span className={cn(
                            'text-[11px] font-semibold tabular-nums px-2 py-px rounded-full min-w-6 text-center',
                            isActive
                              ? 'bg-(--accent) text-(--accent-ink)'
                              : 'bg-(--surface-2) text-(--muted)',
                          )}>
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

      {/* User card + slide-up menu */}
      <div className="mt-auto pt-3">
        {/* Overlay closes the menu on outside click */}
        {menuOpen && (
          <div className="fixed inset-0 z-55" onClick={() => setMenuOpen(false)} />
        )}

        {/*
          Wrapper clips the panel while it's translated below.
          Height accounts for the usercard (66px) + the menu body.
        */}
        <div
          className="relative overflow-hidden"
          style={{ height: menuBodyH + 66 }}
        >
          {/*
            Panel: always in the DOM, slides up via translateY.
            When closed, translateY = bodyH so only the usercard is visible.
            When open, translateY = 0 so the full panel (menu + card) is shown.
          */}
          <div
            className={cn(
              'absolute left-0 right-0 bottom-0 z-60 flex flex-col rounded-(--r) border',
              'transition-[transform,background,border-color,box-shadow] duration-340',
              menuOpen
                ? 'bg-(--box) border-(--border) shadow-(--shadow) translate-y-0'
                : 'bg-transparent border-transparent shadow-none',
            )}
            style={{
              transform: menuOpen ? 'translateY(0)' : `translateY(${menuBodyH}px)`,
              // override Tailwind translate class when closed so the JS value wins
              willChange: 'transform',
            }}
          >
            {/* User card — acts as the trigger, sits at the top of the panel */}
            <button
              type="button"
              onClick={() => setMenuOpen(o => !o)}
              className={cn(
                'flex w-full items-center gap-2.5 p-2 cursor-pointer bg-(--box) border border-(--border) rounded-(--r) text-left text-(--ink) transition-colors',
                menuOpen
                  ? 'rounded-b-none border-transparent hover:bg-(--box)'
                  : 'hover:bg-(--surface-2)',
                collapsed && 'justify-center p-[7px] w-10 h-10 mx-auto box-content',
              )}
            >
              <div
                className="shrink-0 grid place-items-center rounded-full bg-(--surface-2) text-(--ink) border border-(--border) text-[13px] font-semibold"
                style={collapsed ? { width: 24, height: 24, fontSize: 10 } : { width: 34, height: 34 }}
              >
                {user ? initials(user.name) : '?'}
              </div>
              {!collapsed && (
                <>
                  <div className="flex-1 flex flex-col min-w-0 leading-tight">
                    <span className="text-[13.5px] font-semibold truncate">{user?.name}</span>
                    <span className="text-[11.5px] text-(--muted)">{user?.role}</span>
                  </div>
                  <span
                    className="text-(--muted) flex-none transition-transform duration-180"
                    style={{ transform: menuOpen ? 'rotate(0deg)' : 'rotate(180deg)' }}
                  >
                    <ArrowUp01Icon size={16} strokeWidth={1.8} />
                  </span>
                </>
              )}
            </button>

            {/* Menu body — measured for the slide distance */}
            <div
              ref={menuBodyRef}
              className={cn(
                'flex flex-col gap-[3px] px-2 pt-1 pb-2 border-t border-(--border)',
                !menuOpen && 'pointer-events-none',
                collapsed && 'w-[234px]',
              )}
            >
              {/* Dark / Light segmented control */}
              <div className="flex gap-[5px] py-1">
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={cn(
                    'flex-1 inline-flex items-center justify-center gap-1.5 p-2 bg-transparent text-(--muted) cursor-pointer border border-(--border) rounded-(--r-sm) font-medium text-[13px] transition-colors',
                    theme === 'dark' && 'bg-(--accent) text-(--accent-ink) border-(--accent) font-semibold',
                  )}
                >
                  <Moon02Icon size={15} strokeWidth={1.8} /> Dark
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={cn(
                    'flex-1 inline-flex items-center justify-center gap-1.5 p-2 bg-transparent text-(--muted) cursor-pointer border border-(--border) rounded-(--r-sm) font-medium text-[13px] transition-colors',
                    theme === 'light' && 'bg-(--accent) text-(--accent-ink) border-(--accent) font-semibold',
                  )}
                >
                  <Sun03Icon size={15} strokeWidth={1.8} /> Light
                </button>
              </div>

              <div className="h-px bg-(--border) my-[5px]" />

              <button
                type="button"
                onClick={() => { setMenuOpen(false); navigate('/admin/settings') }}
                className="flex items-center gap-[11px] px-2 py-[9px] bg-transparent border-none text-(--ink) cursor-pointer font-medium text-[13.5px] rounded-(--r-sm) text-left whitespace-nowrap hover:bg-(--surface-2) transition-colors w-full"
              >
                <span className="text-(--muted)"><UserAccountIcon size={17} strokeWidth={1.8} /></span>
                Account settings
              </button>
              <button
                type="button"
                onClick={() => { setMenuOpen(false); navigate('/admin/settings') }}
                className="flex items-center gap-[11px] px-2 py-[9px] bg-transparent border-none text-(--ink) cursor-pointer font-medium text-[13.5px] rounded-(--r-sm) text-left whitespace-nowrap hover:bg-(--surface-2) transition-colors w-full"
              >
                <span className="text-(--muted)"><Settings01Icon size={17} strokeWidth={1.8} /></span>
                Preferences
              </button>

              <div className="h-px bg-(--border) my-[5px]" />

              <button
                type="button"
                onClick={() => { logout.mutate(); setMenuOpen(false) }}
                className="flex items-center gap-[11px] px-2 py-[9px] bg-transparent border-none text-(--ink) cursor-pointer font-medium text-[13.5px] rounded-(--r-sm) text-left whitespace-nowrap hover:bg-(--surface-2) transition-colors w-full"
              >
                <span className="text-(--muted)"><Logout01Icon size={17} strokeWidth={1.8} /></span>
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
