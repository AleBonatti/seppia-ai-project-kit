import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, id, className, ...rest }, ref) => (
    <label
      htmlFor={id}
      className={cn(
        'inline-flex items-center gap-2.5 cursor-pointer select-none text-[14px] text-(--ink)',
        rest.disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
    >
      <input
        ref={ref}
        id={id}
        type="checkbox"
        className="sr-only peer"
        {...rest}
      />
      {/* Custom box — 17×17px, accent fill when checked */}
      <span className="w-[17px] h-[17px] rounded-[5px] border border-(--border) bg-(--box) grid place-items-center flex-none text-transparent transition-[background,border-color] peer-checked:bg-(--accent) peer-checked:border-(--accent) peer-checked:text-(--accent-ink)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="w-[10px] h-[10px]">
          <polyline points="4 12 10 18 20 6" />
        </svg>
      </span>
      {label && <span>{label}</span>}
    </label>
  )
)

Checkbox.displayName = 'Checkbox'
