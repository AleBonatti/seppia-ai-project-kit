import { cn } from '@/lib/utils'

interface TabItem {
  id: string
  label: string
}

interface TabsProps {
  items: TabItem[]
  activeId: string
  onChange: (id: string) => void
  className?: string
}

export function Tabs({ items, activeId, onChange, className }: TabsProps) {
  return (
    <div className={cn('flex border-b border-(--border) mb-(--gap)', className)}>
      {items.map((item, i) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={cn(
            'py-[9px] text-[14px] font-medium border-b-2 -mb-px bg-transparent border-x-0 border-t-0 cursor-pointer',
            'transition-[color,border-color] duration-[120ms]',
            i > 0 && 'ml-[14px]',
            activeId === item.id
              ? 'text-(--ink) font-semibold border-b-(--accent)'
              : 'text-(--muted) border-transparent hover:text-(--ink)',
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
