import { forwardRef } from 'react'
import type { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  rows?: number
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, id, rows, className = '', ...rest }, ref) => (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-[12.5px] font-semibold text-(--ink) mb-[7px]">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        className={[
          'w-full text-[13.5px] px-[13px] py-[10px]',
          rows ? '' : 'min-h-[150px]',
          'bg-(--field) text-(--ink) border border-(--field-border) rounded-[7px]',
          'outline-none transition-[border-color,box-shadow] duration-[140ms]',
          'placeholder:text-(--faint) resize-y align-top',
          'focus:border-(--accent) focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_22%,transparent)]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error ? 'border-red-500' : '',
          className,
        ].join(' ')}
        {...rest}
      />
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-xs text-(--faint)">{hint}</p>}
    </div>
  )
)

Textarea.displayName = 'Textarea'
