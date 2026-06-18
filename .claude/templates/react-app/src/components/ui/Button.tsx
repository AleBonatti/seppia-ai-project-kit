import type { ReactNode, ButtonHTMLAttributes, ElementType } from 'react'
import { Spinner } from './Spinner'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
type Size    = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const base = [
  'inline-flex items-center justify-center gap-[7px] whitespace-nowrap no-underline',
  'font-inherit cursor-pointer border transition-[background,border-color,opacity] duration-[140ms]',
  'rounded-(--r-sm) disabled:opacity-50 disabled:cursor-not-allowed',
].join(' ')

const variants: Record<Variant, string> = {
  primary:   'bg-(--accent) text-(--accent-ink) border-(--accent) font-semibold hover:brightness-90',
  secondary: 'bg-(--box) text-(--ink) border-(--border) font-medium hover:bg-(--surface-2)',
  danger:    'bg-red-500/15 text-red-400 border-transparent font-medium hover:bg-red-500/25',
  ghost:     'bg-transparent text-(--muted) border-transparent font-medium hover:bg-(--surface-2) hover:text-(--ink)',
}

const sizes: Record<Size, string> = {
  sm: 'text-[12.5px] px-[11px] py-[6px]',
  md: 'text-[13.5px] px-[15px] py-[9px]',
  lg: 'text-[14.5px] px-[18px] py-[11px]',
}

export function Button({
  variant = 'secondary',
  size = 'md',
  isLoading,
  leftIcon,
  rightIcon,
  children,
  disabled,
  className = '',
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled ?? isLoading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {isLoading ? <Spinner size="sm" /> : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  )
}

// Use this when you need button styling on a link or router Link.
// Example: <ButtonLink as={Link} to="/admin/users" variant="primary">Go</ButtonLink>
interface ButtonLinkProps {
  as?: ElementType
  variant?: Variant
  size?: Size
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  children?: ReactNode
  className?: string
  [key: string]: unknown
}

export function ButtonLink({
  as: Tag = 'a',
  variant = 'secondary',
  size = 'md',
  leftIcon,
  rightIcon,
  children,
  className = '',
  ...rest
}: ButtonLinkProps) {
  return (
    <Tag
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </Tag>
  )
}
