// AttachmentManager — drop-zone + thumbnail grid + detail drawer
// Usage:
//   <AttachmentManager
//     attachments={attachments}
//     onUpload={(files) => uploadMutation.mutate(files)}
//     onDetach={(id) => detachMutation.mutate(id)}
//     isUploading={uploadMutation.isPending}
//   />
//
// `attachments` is an array of Attachment objects (see interface below).
// `onUpload` receives a FileList-like array — call your upload action from there.
// `onDetach` removes the pivot row only; the media record is kept.

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import type { FC } from 'react'
import { cn } from '@/lib/utils'
import {
  UploadSquare01Icon,
  PdfIcon,
  Doc01Icon,
  Xls01Icon,
  FileZipIcon,
  File01Icon,
  Delete01Icon,
  Cancel01Icon,
} from '@/lib/icons'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Attachment {
  id: number
  name: string
  url: string
  mimeType: string
  size: number       // bytes
  width?: number     // only for images
  height?: number    // only for images
}

interface AttachmentManagerProps {
  attachments: Attachment[]
  onUpload: (files: File[]) => void
  onDetach: (id: number) => void
  isUploading?: boolean
  accept?: Record<string, string[]>
  maxSize?: number   // bytes, default 10 MB
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function isImage(mimeType: string): boolean {
  return mimeType.startsWith('image/')
}

function FileTypeIcon({ mimeType, size = 28 }: { mimeType: string; size?: number }) {
  const props = { size, strokeWidth: 1.6 }
  if (mimeType === 'application/pdf')
    return <PdfIcon {...props} />
  if (mimeType === 'application/msword' || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    return <Doc01Icon {...props} />
  if (mimeType === 'application/vnd.ms-excel' || mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    return <Xls01Icon {...props} />
  if (mimeType === 'application/zip' || mimeType === 'application/x-zip-compressed')
    return <FileZipIcon {...props} />
  return <File01Icon {...props} />
}

function fileExtLabel(mimeType: string): string {
  const map: Record<string, string> = {
    'application/pdf': 'PDF',
    'application/msword': 'DOC',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'application/vnd.ms-excel': 'XLS',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
    'application/zip': 'ZIP',
    'application/x-zip-compressed': 'ZIP',
  }
  if (map[mimeType]) return map[mimeType]
  const sub = mimeType.split('/')[1]
  return sub ? sub.split('+')[0].toUpperCase().slice(0, 6) : 'FILE'
}

// ── Dropzone ──────────────────────────────────────────────────────────────────

interface DropZoneProps {
  onDrop: (files: File[]) => void
  isUploading: boolean
  accept?: Record<string, string[]>
  maxSize: number
}

function DropZone({ onDrop, isUploading, accept, maxSize }: DropZoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    disabled: isUploading,
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-[1.5px] border-dashed border-(--border) rounded-(--r) px-[18px] py-[26px]',
        'flex flex-col items-center gap-[7px] text-center cursor-pointer',
        'bg-(--surface-2) text-(--faint)',
        'transition-[border-color,color] duration-[140ms]',
        isDragActive && 'border-(--accent) text-(--muted)',
        !isDragActive && 'hover:border-(--accent) hover:text-(--muted)',
        isUploading && 'opacity-50 cursor-not-allowed',
      )}
    >
      <input {...getInputProps()} />
      <UploadSquare01Icon size={24} strokeWidth={1.6} />
      <p className="text-[13.5px] text-(--muted)">
        Drag &amp; drop files here, or{' '}
        <span className="text-(--accent) font-semibold">browse</span>
      </p>
      <p className="text-[12px] text-(--faint)">
        {isUploading ? 'Uploading…' : `Up to ${formatBytes(maxSize)}`}
      </p>
    </div>
  )
}

// ── Thumbnail ─────────────────────────────────────────────────────────────────

interface ThumbnailProps {
  attachment: Attachment
  onClick: () => void
}

function Thumbnail({ attachment, onClick }: ThumbnailProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative aspect-square rounded-(--r-sm) bg-(--surface-2) border border-(--border) grid place-items-center text-(--faint) overflow-hidden cursor-pointer group"
    >
      {isImage(attachment.mimeType) ? (
        <img
          src={attachment.url}
          alt={attachment.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center gap-2">
          <FileTypeIcon mimeType={attachment.mimeType} size={28} />
          <span className="text-[10px] font-bold tracking-[.05em] text-(--muted) uppercase">
            {fileExtLabel(attachment.mimeType)}
          </span>
        </div>
      )}
    </button>
  )
}

// ── Detail drawer ─────────────────────────────────────────────────────────────

interface DrawerProps {
  attachment: Attachment
  onClose: () => void
  onDetach: (id: number) => void
}

function DetailDrawer({ attachment, onClose, onDetach }: DrawerProps) {
  const [confirming, setConfirming] = useState(false)

  function handleDetach() {
    if (!confirming) { setConfirming(true); return }
    onDetach(attachment.id)
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-0 bottom-0 z-50 w-[340px] flex flex-col bg-(--box) border-l border-(--border) shadow-[var(--shadow)]"
        style={{ animation: 'drawerIn .24s cubic-bezier(.22,.61,.36,1) both' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-(--border)">
          <h3 className="text-[15px] font-semibold text-(--ink) truncate">{attachment.name}</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex-none flex items-center justify-center rounded-[7px] text-(--muted) hover:bg-(--surface-2) hover:text-(--ink) transition-colors"
          >
            <Cancel01Icon size={16} strokeWidth={2} />
          </button>
        </div>

        {/* Preview */}
        <div className="mx-5 mt-5 rounded-(--r-sm) bg-(--surface-2) border border-(--border) aspect-square grid place-items-center text-(--faint) overflow-hidden">
          {isImage(attachment.mimeType) ? (
            <img
              src={attachment.url}
              alt={attachment.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center gap-3">
              <FileTypeIcon mimeType={attachment.mimeType} size={48} />
              <span className="text-[11px] font-bold tracking-[.06em] text-(--muted) uppercase">
                {fileExtLabel(attachment.mimeType)}
              </span>
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="flex flex-col gap-0 mx-5 mt-5 rounded-(--r-sm) border border-(--border) overflow-hidden">
          {[
            { label: 'File name',  value: attachment.name },
            { label: 'MIME type',  value: attachment.mimeType },
            { label: 'File size',  value: formatBytes(attachment.size) },
            ...(attachment.width && attachment.height
              ? [{ label: 'Dimensions', value: `${attachment.width} × ${attachment.height} px` }]
              : []),
          ].map(({ label, value }) => (
            <div key={label} className="flex items-start gap-3 px-4 py-[10px] border-b border-(--border) last:border-b-0">
              <span className="text-[12px] font-medium text-(--muted) w-[90px] flex-none pt-px">{label}</span>
              <span className="text-[12.5px] text-(--ink) break-all">{value}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-auto px-5 pb-5 pt-4">
          <button
            type="button"
            onClick={handleDetach}
            className={cn(
              'w-full flex items-center justify-center gap-2 px-4 py-[10px] rounded-(--r-sm)',
              'border font-medium text-[13.5px] cursor-pointer transition-colors',
              confirming
                ? 'bg-[#e5484d] border-[#e5484d] text-white hover:bg-[#d03f44]'
                : 'bg-transparent border-(--border) text-(--muted) hover:border-[color-mix(in_srgb,#e5484d_40%,var(--border))] hover:text-[#e5484d]',
            )}
          >
            <Delete01Icon size={15} strokeWidth={1.8} />
            {confirming ? 'Confirm removal' : 'Remove attachment'}
          </button>
          {confirming && (
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="w-full text-center text-[12px] text-(--muted) mt-2 cursor-pointer hover:text-(--ink) transition-colors bg-transparent border-none"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes drawerIn {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </>
  )
}

// ── AttachmentManager ─────────────────────────────────────────────────────────

const DEFAULT_ACCEPT = {
  'image/*': [],
  'application/pdf': [],
  'application/msword': [],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
  'application/vnd.ms-excel': [],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
  'application/zip': [],
  'application/x-zip-compressed': [],
}

export const AttachmentManager: FC<AttachmentManagerProps> = ({
  attachments,
  onUpload,
  onDetach,
  isUploading = false,
  accept = DEFAULT_ACCEPT,
  maxSize = 10 * 1024 * 1024,
}) => {
  const [selected, setSelected] = useState<Attachment | null>(null)

  const handleDrop = useCallback(
    (files: File[]) => { if (files.length > 0) onUpload(files) },
    [onUpload],
  )

  return (
    <div>
      <DropZone onDrop={handleDrop} isUploading={isUploading} accept={accept} maxSize={maxSize} />

      {attachments.length > 0 && (
        <div
          className="grid gap-3 mt-4"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))' }}
        >
          {attachments.map((a) => (
            <Thumbnail key={a.id} attachment={a} onClick={() => setSelected(a)} />
          ))}
        </div>
      )}

      {selected && (
        <DetailDrawer
          attachment={selected}
          onClose={() => setSelected(null)}
          onDetach={onDetach}
        />
      )}
    </div>
  )
}
