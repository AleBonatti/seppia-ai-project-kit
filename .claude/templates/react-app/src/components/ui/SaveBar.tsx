import { Button } from '@/components/ui/Button'

interface SaveBarProps {
  lastSaved?: string
  onSave: () => void
  onDiscard?: () => void
  isLoading?: boolean
}

export function SaveBar({ lastSaved, onSave, onDiscard, isLoading }: SaveBarProps) {
  return (
    <div className="flex items-center gap-3 mt-(--gap) pt-[18px] border-t border-(--border)">
      {lastSaved && (
        <span className="text-[12.5px] text-(--faint)">Last saved {lastSaved}</span>
      )}
      <div className="flex items-center gap-[9px] ml-auto">
        {onDiscard && (
          <Button variant="secondary" onClick={onDiscard} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button variant="primary" onClick={onSave} isLoading={isLoading}>
          Save changes
        </Button>
      </div>
    </div>
  )
}
