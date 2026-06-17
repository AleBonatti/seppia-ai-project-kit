import { forwardRef } from 'react'
import { Spinner } from './Spinner'

type ButtonOwnProps<E extends React.ElementType> = {
  as?: E
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

type ButtonProps<E extends React.ElementType = 'button'> = ButtonOwnProps<E> &
  Omit<React.ComponentPropsWithRef<E>, keyof ButtonOwnProps<E>>

const base = [
  'inline-flex items-center justify-center gap-[7px] whitespace-nowrap no-underline',
  'font-inherit cursor-pointer border transition-[background,border-color,opacity] duration-[140ms]',
  'rounded-(--r-sm) disabled:opacity-50 disabled:cursor-not-allowed',
].join(' ')

const variants = {
  primary:   'bg-(--accent) text-(--accent-ink) border-(--accent) font-semibold hover:brightness-90',
  secondary: 'bg-(--box) text-(--ink) border-(--border) font-medium hover:bg-(--surface-2)',
  danger:    'bg-red-500/15 text-red-400 border-transparent font-medium hover:bg-red-500/25',
  ghost:     'bg-transparent text-(--muted) border-transparent font-medium hover:bg-(--surface-2) hover:text-(--ink)',
}

const sizes = {
  sm: 'text-[12.5px] px-[11px] py-[6px]',
  md: 'text-[13.5px] px-[15px] py-[9px]',
  lg: 'text-[14.5px] px-[18px] py-[11px]',
}

export const Button = forwardRef(
  <E extends React.ElementType = 'button'>(
    {
      as,
      variant = 'secondary',
      size = 'md',
      isLoading,
      leftIcon,
      rightIcon,
      children,
      className = '',
      ...rest
    }: ButtonProps<E>,
    ref: React.ForwardedRef<React.ElementRef<E>>,
  ) => {
    const Tag = as ?? 'button'
    return (
      <Tag
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...rest}
      >
        {isLoading ? <Spinner size="sm" /> : leftIcon}
        {children}
        {!isLoading && rightIcon}
      </Tag>
    )
  },
)

Button.displayName = 'Button'
