import { useEffect } from 'react'
import { Cancel01Icon } from '@/lib/icons'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  /** 'sm' | 'md' | 'lg' — default 'md' */
  size?: 'sm' | 'md' | 'lg'
}

const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }

export function Modal({ isOpen, onClose, title, description, children, footer, size = 'md' }: ModalProps) {
  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          'relative w-full bg-(--box) border border-(--border) rounded-(--r) shadow-(--shadow)',
          widths[size],
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-start gap-3 px-(--pad) pt-(--pad) pb-4">
          <div className="min-w-0 flex-1">
            <h2 id="modal-title" className="text-[17px] font-semibold text-(--ink)">{title}</h2>
            {description && <p className="text-[13.5px] text-(--muted) mt-1">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex-none w-8 h-8 grid place-items-center rounded-[7px] text-(--muted) hover:bg-(--surface-2) hover:text-(--ink) transition-colors cursor-pointer"
            aria-label="Close"
          >
            <Cancel01Icon size={16} strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div className="px-(--pad) pb-(--pad)">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-[9px] px-(--pad) pb-(--pad) border-t border-(--border) pt-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
