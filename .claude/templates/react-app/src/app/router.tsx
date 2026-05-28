import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Spinner } from '@/components/ui/Spinner'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { AuthGuard } from '@/features/auth/components/AuthGuard'
import { ComingSoonPage } from '@/features/coming-soon/ComingSoonPage'

// ── Auth pages ────────────────────────────────────────────────────────────────
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))

// ── Admin pages ───────────────────────────────────────────────────────────────
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'))

// Add real entity imports here as they are generated:
// const ExampleListPage = lazy(() => import('@/features/example/pages/ExampleListPage'))

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
      {
        path: 'dashboard',
        element: <Suspense fallback={loading}><DashboardPage /></Suspense>,
      },

      // Add real entity routes here as they are generated:
      // { path: 'examples', element: <Suspense fallback={loading}><ExampleListPage /></Suspense> },

      // Catch-all: any /admin/* route without a real page shows ComingSoonPage
      { path: '*', element: <ComingSoonPage /> },
    ],
  },

  // ── Fallback ─────────────────────────────────────────────────────────────────
  { path: '*', element: <Navigate to="/admin/dashboard" replace /> },
])
