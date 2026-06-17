import { ArrowLeft01Icon, ArrowRight01Icon } from '@/lib/icons'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

function pageWindow(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, '…', total]
  if (current >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '…', current - 1, current, current + 1, '…', total]
}

const btn = 'min-w-[34px] h-[34px] px-1.5 grid place-items-center cursor-pointer bg-(--box) border border-(--border) rounded-(--r-sm) text-[13px] font-medium text-(--muted) transition-[background,color,border-color] hover:bg-(--surface-2) hover:text-(--ink) disabled:opacity-40 disabled:cursor-not-allowed'
const active = 'bg-(--accent) text-(--accent-ink) border-(--accent) font-semibold hover:bg-(--accent) hover:text-(--accent-ink)'

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className={cn('flex items-center gap-[5px]', className)}>
      <button
        type="button"
        className={btn}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ArrowLeft01Icon size={16} strokeWidth={2} />
      </button>

      {pageWindow(currentPage, totalPages).map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} className="min-w-[34px] h-[34px] grid place-items-center text-[13px] text-(--faint)">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            className={cn(btn, p === currentPage && active)}
            onClick={() => onPageChange(p)}
            aria-label={`Page ${p}`}
            aria-current={p === currentPage ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        className={btn}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ArrowRight01Icon size={16} strokeWidth={2} />
      </button>
    </div>
  )
}
