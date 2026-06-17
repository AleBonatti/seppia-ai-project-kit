import { cn } from '@/lib/utils'

interface Tab {
  key: string
  label: string
}

interface TabsProps {
  tabs: Tab[]
  active: string
  onChange: (key: string) => void
  className?: string
}

export function Tabs({ tabs, active, onChange, className }: TabsProps) {
  return (
    <div className={cn('flex border-b border-(--border) mb-(--gap)', className)}>
      {tabs.map((tab, i) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={cn(
            'py-[9px] text-[14px] font-medium border-b-2 -mb-px bg-transparent border-x-0 border-t-0 cursor-pointer',
            'transition-[color,border-color] duration-[120ms]',
            i > 0 && 'ml-[14px]',
            active === tab.key
              ? 'text-(--ink) font-semibold border-b-(--accent)'
              : 'text-(--muted) border-transparent hover:text-(--ink)',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
