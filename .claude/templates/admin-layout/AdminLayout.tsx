// Apply stored theme before first paint to avoid flash
const stored = localStorage.getItem('theme')
document.documentElement.setAttribute('data-theme', stored ?? 'dark')

import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Breadcrumb } from './Breadcrumb'

export function AdminLayout() {
  return (
    <div
      className="h-screen overflow-hidden bg-[--bg]"
      style={{ display: 'grid', gridTemplateColumns: 'var(--sb-w) 1fr' }}
    >
      <Sidebar />
      <div className="flex flex-col overflow-hidden">
        <Breadcrumb />
        <main className="flex-1 overflow-y-auto p-5">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
