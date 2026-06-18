// Apply stored theme/sidebar before first paint to avoid flash
document.documentElement.setAttribute('data-theme', localStorage.getItem('theme') ?? 'dark')
document.documentElement.setAttribute('data-sidebar', localStorage.getItem('sidebar') ?? 'comfortable')

import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Breadcrumb } from './Breadcrumb'

export function AdminLayout() {
  const { pathname } = useLocation()

  return (
    <div
      className="shell h-screen overflow-hidden"
      style={{ display: 'grid', gridTemplateColumns: 'var(--sb-w) 1fr' }}
    >
      <Sidebar />
      <div className="flex flex-col overflow-hidden min-w-0">
        {/* content: padding 13px on all sides except left (sidebar handles that gap) */}
        <div className="flex-1 overflow-hidden" style={{ padding: '13px 8px 13px 0' }}>
          {/* pagebox: scroll lives here, not on the wrapper */}
          <div className="bg-(--box) min-h-full overflow-y-auto" style={{ borderRadius: 16, padding: 13 }}>
            <Breadcrumb />
            {/* key=pathname remounts this div on every route change, replaying the animation */}
            <div key={pathname} className="page-enter">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
