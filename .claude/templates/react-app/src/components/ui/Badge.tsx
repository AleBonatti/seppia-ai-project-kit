import { cn } from '@/lib/utils'

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  // dot inherits currentColor, border uses color-mix to tint the base border
  success: 'text-(--accent) [border-color:color-mix(in_srgb,var(--accent)_35%,var(--border))]',
  warning: 'text-[#d99a2b] [border-color:color-mix(in_srgb,#d99a2b_30%,var(--border))]',
  error:   'text-[#e5484d] [border-color:color-mix(in_srgb,#e5484d_38%,var(--border))]',
  neutral: 'text-(--faint) border-(--border)',
  info:    'text-(--muted) border-(--border)',
}

export function Badge({ variant = 'neutral', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        // base: pill with leading dot
        'inline-flex items-center gap-1.5 text-[11.5px] font-medium whitespace-nowrap',
        'py-[3px] pr-[10px] pl-2 rounded-full border',
        'before:content-[""] before:w-1.5 before:h-1.5 before:rounded-full before:bg-current before:flex-none',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
