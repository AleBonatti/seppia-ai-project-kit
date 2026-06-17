// Requires: npm install react-day-picker date-fns
// react-day-picker v9 is headless — all styling is applied here via classNames prop.
import { useState, useRef, useEffect } from 'react'
import { DayPicker } from 'react-day-picker'
import { format } from 'date-fns'
import { CalendarIcon, ArrowLeft01Icon, ArrowRight01Icon } from '@/lib/icons'
import { cn } from '@/lib/utils'

// ── Inline styles for DayPicker ───────────────────────────────────────────────
// react-day-picker v9 accepts a classNames object — no stylesheet import needed.
const dp: React.ComponentProps<typeof DayPicker>['classNames'] = {
  months:         'flex flex-col',
  month:          'w-full',
  month_caption:  'flex items-center justify-between px-1 mb-3',
  caption_label:  'text-[14px] font-semibold text-(--ink)',
  nav:            'flex gap-1',
  button_previous: cn(
    'w-7 h-7 grid place-items-center rounded-[7px] border border-(--border)',
    'bg-(--box) text-(--muted) cursor-pointer hover:bg-(--surface-2) hover:text-(--ink) transition-colors',
  ),
  button_next: cn(
    'w-7 h-7 grid place-items-center rounded-[7px] border border-(--border)',
    'bg-(--box) text-(--muted) cursor-pointer hover:bg-(--surface-2) hover:text-(--ink) transition-colors',
  ),
  weekdays:       'grid grid-cols-7 mb-1',
  weekday:        'text-[11px] font-semibold text-(--faint) text-center py-1 uppercase tracking-wide',
  weeks:          'flex flex-col gap-0.5',
  week:           'grid grid-cols-7',
  day:            'text-center',
  day_button: cn(
    'w-full aspect-square text-[13px] font-medium rounded-[7px] cursor-pointer',
    'text-(--muted) hover:bg-(--surface-2) hover:text-(--ink) transition-colors',
  ),
  selected:       '[&>button]:bg-(--accent) [&>button]:text-(--accent-ink) [&>button]:font-semibold [&>button]:hover:bg-(--accent)',
  today:          '[&>button]:border [&>button]:border-(--accent) [&>button]:text-(--accent)',
  outside:        '[&>button]:text-(--faint) [&>button]:opacity-40',
  disabled:       '[&>button]:opacity-30 [&>button]:cursor-not-allowed',
  range_start:    '[&>button]:rounded-r-none',
  range_end:      '[&>button]:rounded-l-none',
  range_middle:   '[&>button]:rounded-none [&>button]:bg-(--surface-2) [&>button]:text-(--ink)',
}

// ── DatePicker (single date, popover trigger) ─────────────────────────────────

interface DatePickerProps {
  label?: string
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  /** Date format string for date-fns (default: 'dd/MM/yyyy') */
  dateFormat?: string
}

export function DatePicker({
  label,
  value,
  onChange,
  placeholder = 'Pick a date',
  error,
  hint,
  disabled,
  dateFormat = 'dd/MM/yyyy',
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="mb-4" ref={ref}>
      {label && (
        <label className="block text-[12.5px] font-semibold text-(--ink) mb-[7px]">
          {label}
        </label>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(o => !o)}
        className={cn(
          'w-full flex items-center gap-2 text-[13.5px] px-[13px] py-[10px] min-h-[42px]',
          'bg-(--field) border rounded-[7px] cursor-pointer text-left',
          'outline-none transition-[border-color,box-shadow] duration-[140ms]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error ? 'border-red-500' : 'border-(--field-border)',
          open && !error && 'border-(--accent) shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_22%,transparent)]',
        )}
      >
        <CalendarIcon size={15} strokeWidth={1.8} className="text-(--faint) flex-none" />
        <span className={value ? 'text-(--ink)' : 'text-(--faint)'}>
          {value ? format(value, dateFormat) : placeholder}
        </span>
      </button>

      {/* Popover calendar */}
      {open && (
        <div
          className="absolute z-50 mt-1.5 p-3 bg-(--box) border border-(--border) rounded-(--r) shadow-(--shadow)"
          style={{ minWidth: 280 }}
        >
          <DayPicker
            mode="single"
            selected={value}
            onSelect={(date) => { onChange?.(date); setOpen(false) }}
            classNames={dp}
            components={{
              Chevron: ({ orientation }) =>
                orientation === 'left'
                  ? <ArrowLeft01Icon size={14} strokeWidth={2} />
                  : <ArrowRight01Icon size={14} strokeWidth={2} />,
            }}
          />
        </div>
      )}

      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-xs text-(--faint)">{hint}</p>}
    </div>
  )
}

// ── InlineCalendar (no trigger, always visible) ───────────────────────────────

interface InlineCalendarProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  className?: string
}

export function InlineCalendar({ value, onChange, className }: InlineCalendarProps) {
  return (
    <div className={cn('p-3 bg-(--box) border border-(--border) rounded-(--r)', className)}>
      <DayPicker
        mode="single"
        selected={value}
        onSelect={onChange}
        classNames={dp}
        components={{
          Chevron: ({ orientation }) =>
            orientation === 'left'
              ? <ArrowLeft01Icon size={14} strokeWidth={2} />
              : <ArrowRight01Icon size={14} strokeWidth={2} />,
        }}
      />
    </div>
  )
}
