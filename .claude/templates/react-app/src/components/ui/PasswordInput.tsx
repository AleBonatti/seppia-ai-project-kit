import { forwardRef, useState } from 'react'
import { EyeIcon, EyeOffIcon } from '@/lib/icons'

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
  hint?: string
  // When false the show/hide toggle is not rendered and the value stays masked.
  // Default: true
  showToggle?: boolean
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, hint, id, showToggle = true, className = '', ...rest }, ref) => {
    const [revealed, setRevealed] = useState(false)

    return (
      <div className="mb-4">
        {label && (
          <label htmlFor={id} className="block text-[12.5px] font-semibold text-(--ink) mb-[7px]">
            {label}
          </label>
        )}
        <div
          className={[
            'flex items-center',
            'bg-(--field) border rounded-[7px]',
            'transition-[border-color,box-shadow] duration-[140ms]',
            'focus-within:border-(--accent) focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_22%,transparent)]',
            error ? 'border-red-500' : 'border-(--field-border)',
          ].join(' ')}
        >
          <input
            ref={ref}
            id={id}
            type={revealed ? 'text' : 'password'}
            className={[
              'flex-1 min-w-0 bg-transparent border-none outline-none',
              'text-[13.5px] text-(--ink) placeholder:text-(--faint)',
              'px-[13px] py-[10px] min-h-[42px]',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              className,
            ].join(' ')}
            {...rest}
          />
          {showToggle && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setRevealed(r => !r)}
              className="flex-none flex items-center gap-1 px-2 py-1 mr-1 rounded-[7px] text-[12px] font-medium text-(--muted) hover:text-(--ink) hover:bg-(--surface-2) transition-colors"
            >
              {revealed
                ? <ViewOffSlashIcon size={15} strokeWidth={1.8} />
                : <ViewIcon size={15} strokeWidth={1.8} />}
              {revealed ? 'Hide' : 'Show'}
            </button>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-xs text-(--faint)">{hint}</p>}
      </div>
    )
  }
)

PasswordInput.displayName = 'PasswordInput'
