import { Link } from 'react-router-dom'
import { ArrowLeft01Icon } from '@/lib/icons'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
  backHref?: string
  className?: string
}

export function PageHeader({ title, description, action, backHref, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-center gap-4 mb-(--gap) flex-wrap', className)}>
      {backHref && (
        <Link
          to={backHref}
          className="flex-none w-8 h-8 grid place-items-center rounded-[7px] border border-(--border) text-(--muted) hover:bg-(--surface-2) hover:text-(--ink) transition-colors no-underline"
          aria-label="Go back"
        >
          <ArrowLeft01Icon size={16} strokeWidth={2} />
        </Link>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="text-[20px] font-semibold text-(--ink) whitespace-nowrap">{title}</h1>
        {description && <p className="text-[13.5px] text-(--muted) mt-[2px]">{description}</p>}
      </div>
      {action && (
        <div className="flex-none flex gap-[9px] ml-auto">{action}</div>
      )}
    </div>
  )
}
