import { Outlet } from 'react-router-dom'

// Placeholder layout for the public-facing frontend.
// Replace with project-specific design once defined.
export function PublicLayout() {
  return (
    <div className="min-h-screen bg-(--bg) text-(--ink)">
      <Outlet />
    </div>
  )
}
