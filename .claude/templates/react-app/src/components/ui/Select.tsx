import { forwardRef } from 'react'
import { ArrowDown01Icon } from '@/lib/icons'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: SelectOption[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, id, options, placeholder, className = '', ...rest }, ref) => (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-[12.5px] font-semibold text-(--ink) mb-[7px]">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={id}
          className={[
            'w-full appearance-none text-[13.5px] px-[13px] py-[10px] min-h-[42px] pr-10',
            'bg-(--field) text-(--ink) border border-(--field-border) rounded-[7px]',
            'outline-none transition-[border-color,box-shadow] duration-[140ms] cursor-pointer',
            'focus:border-(--accent) focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_22%,transparent)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error ? 'border-red-500' : '',
            className,
          ].join(' ')}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-(--muted)">
          <ArrowDown01Icon size={16} strokeWidth={1.8} />
        </span>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-xs text-(--faint)">{hint}</p>}
    </div>
  )
)

Select.displayName = 'Select'
