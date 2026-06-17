import { useState, useRef } from 'react'
import { Upload04Icon } from '@/lib/icons'
import { cn } from '@/lib/utils'

interface DropzoneProps {
  onFilesSelected: (files: File[]) => void
  accept?: string
  multiple?: boolean
  label?: string
  hint?: string
  className?: string
}

export function Dropzone({ onFilesSelected, accept, multiple, label, hint, className }: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length) onFilesSelected(files)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length) onFilesSelected(files)
    e.target.value = ''
  }

  return (
    <div
      className={cn(
        'border-[1.5px] border-dashed rounded-(--r) p-[26px] flex flex-col items-center gap-[7px]',
        'text-center text-(--faint) cursor-pointer transition-[border-color,color] duration-[140ms]',
        'bg-(--ph,var(--surface-2))',
        isDragging
          ? 'border-(--accent) text-(--muted)'
          : 'border-(--border) hover:border-(--accent) hover:text-(--muted)',
        className,
      )}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
    >
      <Upload04Icon size={24} strokeWidth={1.5} />
      <p className="text-[13.5px] text-(--muted)">
        {label ?? 'Drag & drop files here, or'}{' '}
        <span className="text-(--accent) font-semibold">browse</span>
      </p>
      {hint && <p className="text-[12px] text-(--faint)">{hint}</p>}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={handleChange}
      />
    </div>
  )
}
