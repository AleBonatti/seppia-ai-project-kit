import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Spinner } from '@/components/ui/Spinner'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { AuthGuard } from '@/features/auth/components/AuthGuard'

// ── Auth pages ────────────────────────────────────────────────────────────────
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))

// ── Admin pages ───────────────────────────────────────────────────────────────
// Add a lazy import for each entity's list and edit pages:
// const ExampleListPage = lazy(() => import('@/features/example/pages/ExampleListPage'))
// const ExampleEditPage = lazy(() => import('@/features/example/pages/ExampleEditPage'))

const loading = <div className="flex h-screen items-center justify-center"><Spinner /></div>

export const router = createBrowserRouter([
  // ── Public routes ───────────────────────────────────────────────────────────
  {
    path: '/login',
    element: <Suspense fallback={loading}><LoginPage /></Suspense>,
  },

  // ── Protected admin routes ──────────────────────────────────────────────────
  {
    path: '/admin',
    element: (
      <AuthGuard>
        <AdminLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },

      // Add entity routes here as they are generated:
      // { path: 'examples', element: <Suspense fallback={loading}><ExampleListPage /></Suspense> },
      // { path: 'examples/:id/edit', element: <Suspense fallback={loading}><ExampleEditPage /></Suspense> },
    ],
  },

  // ── Fallback ─────────────────────────────────────────────────────────────────
  { path: '*', element: <Navigate to="/admin" replace /> },
])
