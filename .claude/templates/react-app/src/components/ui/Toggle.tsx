interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
}

export function Toggle({ checked, onChange, label, description, disabled }: ToggleProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      {(label || description) && (
        <div className="min-w-0">
          {label && <span className="text-[13.5px] font-medium text-(--ink)">{label}</span>}
          {description && <p className="text-[12.5px] text-(--muted) mt-0.5">{description}</p>}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className="flex-none relative w-[38px] h-[22px] rounded-full border cursor-pointer transition-[background,border-color] duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background:   checked ? 'var(--accent)' : 'var(--box)',
          borderColor:  checked ? 'var(--accent)' : 'var(--border)',
          padding: 2,
        }}
      >
        <span
          className="block w-4 h-4 rounded-full transition-[transform,background] duration-150"
          style={{
            background: checked ? 'var(--accent-ink)' : 'var(--muted)',
            transform:  checked ? 'translateX(16px)' : 'translateX(0)',
          }}
        />
      </button>
    </div>
  )
}
