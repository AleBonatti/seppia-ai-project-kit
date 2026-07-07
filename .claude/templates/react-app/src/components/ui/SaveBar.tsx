import { Button } from '@/components/ui/Button'
import { useMinDelay } from '@/hooks/useMinDelay'

interface SaveBarProps {
  lastSaved?: string
  onSave: () => void
  onDiscard?: () => void
  isLoading?: boolean
}

export function SaveBar({ lastSaved, onSave, onDiscard, isLoading }: SaveBarProps) {
  // Guarantees the spinner/disabled state is visible for at least 500ms,
  // even if the save mutation resolves faster than that.
  const isSaving = useMinDelay(isLoading ?? false, 500)

  return (
    <div className="flex items-center gap-3 mt-(--gap) pt-[18px] border-t border-(--border)">
      {lastSaved && (
        <span className="text-[12.5px] text-(--faint)">Last saved {lastSaved}</span>
      )}
      <div className="flex items-center gap-[9px] ml-auto">
        {onDiscard && (
          <Button variant="secondary" onClick={onDiscard} disabled={isSaving}>
            Cancel
          </Button>
        )}
        <Button variant="primary" onClick={onSave} isLoading={isSaving}>
          Save changes
        </Button>
      </div>
    </div>
  )
}
