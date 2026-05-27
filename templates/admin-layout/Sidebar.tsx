import { NavLink } from 'react-router-dom'
import { LayoutDashboard, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

// ── Navigation items — edit this list per project ─────────────────────────────
// Import the relevant Lucide icons and add one entry per entity.
const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  // { label: 'Products',  href: '/admin/products',  icon: Package },
  // { label: 'Orders',    href: '/admin/orders',    icon: ShoppingCart },
  // { label: 'Users',     href: '/admin/users',     icon: Users },
]

export function Sidebar() {
  return (
    <aside className="flex w-56 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      {/* Logo / project name */}
      <div className="flex h-14 items-center border-b border-gray-200 px-4 dark:border-gray-700">
        <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
          Project Name
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map(item => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100',
              )
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
