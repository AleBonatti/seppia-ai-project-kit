import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  delta?: string
  /** true = positive trend (accent color), false = negative (red), undefined = neutral */
  deltaUp?: boolean
  className?: string
}

export function StatCard({ label, value, icon, delta, deltaUp, className }: StatCardProps) {
  return (
    <div className={cn('bg-(--box) border border-(--border) rounded-(--r) p-(--pad) min-w-0', className)}>
      <div className="flex items-center justify-between">
        <span className="text-[12.5px] font-medium text-(--muted) whitespace-nowrap">{label}</span>
        <span className="w-[34px] h-[34px] rounded-[9px] bg-(--surface-2) text-(--ink) grid place-items-center flex-none">
          {icon}
        </span>
      </div>
      <div className="text-[30px] font-bold text-(--ink) leading-[1.1] my-[14px] tracking-[-0.03em]">
        {value}
      </div>
      {delta !== undefined && (
        <div className="flex items-center gap-[5px] text-[12.5px] text-(--muted) whitespace-nowrap">
          <span
            className={cn(
              deltaUp === true  && 'text-(--accent) font-semibold',
              deltaUp === false && 'text-red-400 font-semibold',
            )}
          >
            {delta}
          </span>
        </div>
      )}
    </div>
  )
}
