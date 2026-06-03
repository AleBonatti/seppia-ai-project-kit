// Apply stored theme/sidebar before first paint to avoid flash
const stored = localStorage.getItem('theme')
document.documentElement.setAttribute('data-theme', stored ?? 'dark')
const storedSidebar = localStorage.getItem('sidebar')
document.documentElement.setAttribute('data-sidebar', storedSidebar ?? 'comfortable')

import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function AdminLayout() {
  return (
    <div className="shell h-screen" style={{ display: 'grid', gridTemplateColumns: 'var(--sb-w) 1fr' }}>
      <Sidebar />
      <div className="main flex flex-col overflow-hidden min-w-0">
        <div className="content flex-1 overflow-y-auto p-[--pad] pl-0">
          <div className="pagebox bg-[--box] rounded-2xl p-[18px] min-h-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
