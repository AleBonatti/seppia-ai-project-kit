import { cn } from '@/lib/utils'

interface ChipProps {
  active?: boolean
  count?: number
  onClick?: () => void
  children: React.ReactNode
  className?: string
}

export function Chip({ active, count, onClick, children, className }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-[7px] px-[13px] py-[7px] rounded-full text-[13px] font-medium whitespace-nowrap',
        'border cursor-pointer transition-[background,border-color,color] duration-[120ms]',
        active
          ? 'text-(--ink) [border-color:color-mix(in_srgb,var(--accent)_45%,var(--border))] [background:color-mix(in_srgb,var(--accent)_10%,transparent)]'
          : 'bg-(--box) text-(--muted) border-(--border) hover:bg-(--surface-2)',
        className,
      )}
    >
      {children}
      {count !== undefined && (
        <span className="text-[12px] font-medium tabular-nums text-(--faint)">{count}</span>
      )}
    </button>
  )
}
