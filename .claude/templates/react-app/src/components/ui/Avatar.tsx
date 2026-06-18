import { cn } from '@/lib/utils'

type AvatarSize = 'sm' | 'md' | 'lg'

interface AvatarProps {
  initials: string
  size?: AvatarSize
  src?: string
  className?: string
}

const sizes: Record<AvatarSize, { box: string; text: string }> = {
  sm: { box: 'w-7 h-7',            text: 'text-[11px]' },
  md: { box: 'w-[34px] h-[34px]',  text: 'text-[13px]' },
  lg: { box: 'w-20 h-20',          text: 'text-[24px] tracking-[-0.01em]' },
}

export function Avatar({ initials, size = 'md', src, className }: AvatarProps) {
  const { box, text } = sizes[size]
  return (
    <div
      className={cn(
        'rounded-full flex-none grid place-items-center font-semibold overflow-hidden',
        'bg-(--surface-2) text-(--ink) border border-(--border)',
        box,
        text,
        className,
      )}
    >
      {src
        ? <img src={src} alt={initials} className="w-full h-full object-cover block" />
        : initials
      }
    </div>
  )
}
