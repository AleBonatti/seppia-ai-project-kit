import { Link, useLocation } from 'react-router-dom'
import { Home01Icon, ArrowRight01Icon } from '@/lib/icons'

function labelFromSegment(segment: string): string {
  return segment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

export function Breadcrumb() {
  const { pathname } = useLocation()
  const segments = pathname.split('/').filter(s => s && s !== 'admin')

  const crumbs = segments.map((seg, i) => ({
    label: labelFromSegment(seg),
    href: '/admin/' + segments.slice(0, i + 1).join('/'),
    isLast: i === segments.length - 1,
  }))

  return (
    <div className="bg-(--panel) rounded-[7px] px-4 py-[11px] mb-[18px] flex items-center gap-2 flex-wrap">
      <span className="inline-flex items-center gap-[7px] text-(--muted) text-[13.5px] font-medium">
        <span className="text-(--faint)"><Home01Icon size={15} strokeWidth={1.8} /></span>
        <Link to="/admin/dashboard" className="hover:text-(--ink) transition-colors">
          Home
        </Link>
      </span>
      {crumbs.map(crumb => (
        <span key={crumb.href} className="inline-flex items-center gap-2">
          <span className="text-(--faint)"><ArrowRight01Icon size={14} strokeWidth={2} /></span>
          {crumb.isLast ? (
            <span className="inline-flex items-center gap-[7px] text-(--ink) text-[13.5px] font-semibold">
              <span className="text-(--accent)">
                {/* current page icon inserted by page component if desired */}
              </span>
              {crumb.label}
            </span>
          ) : (
            <Link
              to={crumb.href}
              className="inline-flex items-center gap-[7px] text-(--muted) text-[13.5px] font-medium hover:text-(--ink) transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </div>
  )
}
