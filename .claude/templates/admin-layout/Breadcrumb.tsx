import { Link, useLocation } from 'react-router-dom'
import { Home01Icon, ArrowRight01Icon } from '@hugeicons/react'

// ── Derive a readable label from a path segment ───────────────────────────────
function labelFromSegment(segment: string): string {
  return segment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

export function Breadcrumb() {
  const { pathname } = useLocation()

  // Build crumb items from the path, skipping 'admin'
  const segments = pathname.split('/').filter(s => s && s !== 'admin')

  const crumbs = segments.map((seg, i) => ({
    label: labelFromSegment(seg),
    href: '/admin/' + segments.slice(0, i + 1).join('/'),
    isLast: i === segments.length - 1,
  }))

  return (
    <div className="flex items-center gap-1.5 border-b border-[--border] px-5 py-3 text-sm shrink-0">
      <Link
        to="/admin/dashboard"
        className="text-[--faint] hover:text-[--ink] transition-colors"
        aria-label="Home"
      >
        <Home01Icon size={14} strokeWidth={1.8} />
      </Link>
      {crumbs.map(crumb => (
        <span key={crumb.href} className="flex items-center gap-1.5">
          <ArrowRight01Icon size={12} strokeWidth={1.8} className="text-[--faint]" />
          {crumb.isLast ? (
            <span className="font-medium text-[--ink]">{crumb.label}</span>
          ) : (
            <Link to={crumb.href} className="text-[--muted] hover:text-[--ink] transition-colors">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </div>
  )
}
