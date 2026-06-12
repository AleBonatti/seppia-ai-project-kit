import { forwardRef } from 'react'
import { Spinner } from './Spinner'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const base = [
  'inline-flex items-center justify-center gap-[7px] whitespace-nowrap',
  'font-inherit cursor-pointer border transition-[background,border-color,opacity] duration-[140ms]',
  'rounded-(--r-sm) disabled:opacity-50 disabled:cursor-not-allowed',
].join(' ')

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:   'bg-(--accent) text-(--accent-ink) border-(--accent) font-semibold hover:brightness-90',
  secondary: 'bg-(--box) text-(--ink) border-(--border) font-medium hover:bg-(--surface-2)',
  danger:    'bg-red-500/15 text-red-400 border-transparent font-medium hover:bg-red-500/25',
  ghost:     'bg-transparent text-(--muted) border-transparent font-medium hover:bg-(--surface-2) hover:text-(--ink)',
}

const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'text-[12.5px] px-[11px] py-[6px]',
  md: 'text-[13.5px] px-[15px] py-[9px]',
  lg: 'text-[14.5px] px-[18px] py-[11px]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'secondary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, className = '', ...rest }, ref) => (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {isLoading ? (
        <Spinner size="sm" />
      ) : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  )
)

Button.displayName = 'Button'
