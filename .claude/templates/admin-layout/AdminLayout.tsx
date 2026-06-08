// Apply stored theme/sidebar before first paint to avoid flash
document.documentElement.setAttribute('data-theme', localStorage.getItem('theme') ?? 'dark')
document.documentElement.setAttribute('data-sidebar', localStorage.getItem('sidebar') ?? 'comfortable')

import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Breadcrumb } from './Breadcrumb'

export function AdminLayout() {
  return (
    <div
      className="h-screen overflow-hidden"
      style={{ display: 'grid', gridTemplateColumns: 'var(--sb-w) 1fr' }}
    >
      <Sidebar />
      <div className="flex flex-col overflow-hidden min-w-0">
        <div className="flex-1 overflow-y-auto" style={{ padding: 'var(--pad)', paddingLeft: 0 }}>
          <div className="bg-[--box] rounded-2xl p-[18px] min-h-full">
            <Breadcrumb />
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
