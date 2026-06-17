import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  /** Removes default padding — use for list cards that have internal sections */
  flush?: boolean
  className?: string
}

interface CardHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

interface CardFooterProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, flush, className }: CardProps) {
  return (
    <div
      className={cn(
        'bg-(--box) border border-(--border) rounded-(--r)',
        !flush && 'p-(--pad)',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ title, description, action, className }: CardHeaderProps) {
  return (
    <div className={cn('flex items-center gap-4 flex-wrap', className)}>
      <div className="min-w-0 flex-1">
        <h3 className="text-[20px] font-semibold text-(--ink) whitespace-nowrap">{title}</h3>
        {description && <p className="text-[13.5px] text-(--muted) mt-0.5">{description}</p>}
      </div>
      {action && <div className="flex-none flex gap-[9px]">{action}</div>}
    </div>
  )
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn('flex items-center justify-between gap-3 flex-wrap border-t border-(--border) p-(--pad)', className)}>
      {children}
    </div>
  )
}
