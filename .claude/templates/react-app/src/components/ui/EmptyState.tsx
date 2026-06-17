import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-16 px-6', className)}>
      {icon && (
        <div className="w-12 h-12 rounded-(--r) bg-(--surface-2) text-(--faint) grid place-items-center mb-4 flex-none">
          {icon}
        </div>
      )}
      <p className="text-[15px] font-semibold text-(--ink)">{title}</p>
      {description && <p className="text-[13.5px] text-(--muted) mt-1 max-w-xs">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
