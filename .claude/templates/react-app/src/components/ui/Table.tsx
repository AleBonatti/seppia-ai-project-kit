import { cn } from '@/lib/utils'

// ── Wrapper ───────────────────────────────────────────────────────────────────

interface TableWrapperProps {
  children: React.ReactNode
  className?: string
}

export function Table({ children, className }: TableWrapperProps) {
  return (
    <div className={cn('px-(--pad) pb-1', className)}>
      <table className="w-full border-collapse">{children}</table>
    </div>
  )
}

// ── Head ──────────────────────────────────────────────────────────────────────

export function TableHeader({ children }: { children: React.ReactNode }) {
  return <thead>{children}</thead>
}

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children?: React.ReactNode
}

export function TableHead({ children, className, ...props }: TableHeadProps) {
  return (
    <th
      className={cn(
        'text-left text-[11px] font-bold uppercase tracking-[.06em] text-(--muted) whitespace-nowrap',
        'px-[14px] py-[11px] bg-(--surface-2)',
        // first/last rounded to give the header bar pill-ends
        'first:rounded-l-[5px] last:rounded-r-[5px]',
        className,
      )}
      {...props}
    >
      {children}
    </th>
  )
}

// ── Body ──────────────────────────────────────────────────────────────────────

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>
}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode
}

export function TableRow({ children, className, ...props }: TableRowProps) {
  return (
    <tr
      className={cn(
        'transition-colors duration-[120ms] hover:bg-(--surface-2)',
        // row divider: top border on every row except the first
        '[&:not(:first-child)>td]:border-t [&:not(:first-child)>td]:border-(--border)',
        className,
      )}
      {...props}
    >
      {children}
    </tr>
  )
}

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children?: React.ReactNode
}

export function TableCell({ children, className, ...props }: TableCellProps) {
  return (
    <td
      className={cn(
        'px-[14px] align-middle',
        className,
      )}
      style={{ height: 'var(--row-h)', ...props.style }}
      {...props}
    >
      {children}
    </td>
  )
}

// ── Checkbox cell ─────────────────────────────────────────────────────────────
// Fixed 44px column used as the leftmost cell when rows are selectable.

export function TableCheckCell({ children, className, ...props }: TableCellProps) {
  return (
    <td
      className={cn('w-[44px] text-center px-0 align-middle', className)}
      style={{ height: 'var(--row-h)', ...props.style }}
      {...props}
    >
      {children}
    </td>
  )
}

// ── Row content helpers ───────────────────────────────────────────────────────
// Use inside <TableCell> for the primary column (title + subtitle).

interface RowTitleProps {
  title: string
  sub?: string
}

export function RowTitle({ title, sub }: RowTitleProps) {
  return (
    <div>
      <div className="font-semibold text-[14px] text-(--ink)">{title}</div>
      {sub && <div className="text-[12px] text-(--faint) tabular-nums">{sub}</div>}
    </div>
  )
}
