import { forwardRef, useState } from 'react'
import { EyeIcon, EyeOffIcon } from '@/lib/icons'

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  rightSlot?: React.ReactNode
  /** Render as a password field with show/hide toggle */
  isPassword?: boolean
  /** Render an inline link next to the label (e.g. "Forgot password?") */
  labelAction?: React.ReactNode
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, isPassword, labelAction, id, ...rest }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : rest.type

    return (
      <div className="mb-[18px]">
        <div className="flex items-center justify-between mb-2">
          <label htmlFor={id} className="text-[13.5px] font-semibold whitespace-nowrap" style={{ color: 'var(--ink)' }}>
            {label}
          </label>
          {labelAction}
        </div>

        <div className="relative flex items-center">
          <input
            ref={ref}
            id={id}
            {...rest}
            type={inputType}
            className="w-full text-[14.5px] rounded-[7px] outline-none"
            style={{
              padding: isPassword ? '14px 46px 14px 15px' : '14px 15px',
              background: 'var(--login-field)',
              color: 'var(--ink)',
              border: error ? '1px solid #e5484d' : '1px solid #3f3f47',
              transition: 'border-color .14s, box-shadow .14s',
              ...(rest.style ?? {}),
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = 'var(--accent)'
              e.currentTarget.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent)'
              rest.onFocus?.(e)
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = error ? '#e5484d' : '#3f3f47'
              e.currentTarget.style.boxShadow = 'none'
              rest.onBlur?.(e)
            }}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-2 w-[38px] h-[38px] grid place-items-center bg-transparent border-none cursor-pointer rounded-lg transition-colors"
              style={{ color: 'var(--muted)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--ink)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)' }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword
                ? <EyeOffIcon size={20} strokeWidth={1.8} />
                : <EyeIcon size={20} strokeWidth={1.8} />
              }
            </button>
          )}
        </div>

        {error && (
          <p className="mt-1.5 text-[12.5px] text-red-400">{error}</p>
        )}
      </div>
    )
  }
)

AuthInput.displayName = 'AuthInput'
