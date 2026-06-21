// Template: Entity Edit / Create Page
// Replace every occurrence of "Entity" / "entity" with the real entity name.
// Add, remove, or reorder sidebar cards to match the entity spec.
// The left column holds content fields; the right column holds metadata.

import { Link } from 'react-router-dom'
import { ArrowLeft01Icon } from '@/lib/icons'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { SaveBar } from '@/components/ui/SaveBar'

// ── Form section wrapper ──────────────────────────────────────────────────────

interface FormSectionProps {
  title: string
  description?: string
  children: React.ReactNode
}

function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <div className="border-t border-(--border) first:border-t-0 pt-5 first:pt-0">
      <div className="mb-4">
        <h3 className="text-[15px] font-semibold text-(--ink)">{title}</h3>
        {description && <p className="text-[13px] text-(--muted) mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  )
}

// ── Two-column form row (label left, field right) ─────────────────────────────

interface FormRowProps {
  label: string
  help?: string
  children: React.ReactNode
}

function FormRow({ label, help, children }: FormRowProps) {
  return (
    <div className="grid gap-3 py-4 border-t border-(--border) first:border-t-0 first:pt-0" style={{ gridTemplateColumns: '180px 1fr' }}>
      <div className="pt-[9px]">
        <label className="text-[13.5px] font-medium text-(--ink)">{label}</label>
        {help && <p className="text-[12px] text-(--faint) mt-1 leading-relaxed">{help}</p>}
      </div>
      <div>{children}</div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function EntityEditPage() {
  // Replace with: const { id } = useParams()
  // Replace with: const { data: entity, isLoading } = useEntity(id)
  // Replace with: const { form, onSubmit, isSubmitting } = useEntityForm({ id })
  const isNew = false // derive from route: !id

  return (
    <div className="flex flex-col gap-(--gap)">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/entities"
            className="w-8 h-8 flex items-center justify-center rounded-[7px] border border-(--border) text-(--muted) hover:bg-(--surface-2) hover:text-(--ink) transition-colors"
            aria-label="Back to entities"
          >
            <ArrowLeft01Icon size={16} strokeWidth={2} />
          </Link>
          <div>
            <h1 className="text-[20px] font-semibold text-(--ink)">
              {isNew ? 'New Entity' : 'Edit Entity'}
            </h1>
            {!isNew && (
              <p className="text-[13px] text-(--muted) mt-[2px]">Last edited 12 minutes ago</p>
            )}
          </div>
        </div>
        <div className="flex gap-[9px]">
          <ButtonLink as={Link} to="/admin/entities" variant="secondary">Cancel</ButtonLink>
          <Button variant="primary">Save</Button>
        </div>
      </div>

      {/* Two-column layout: content (wider) + sidebar */}
      <div className="grid gap-(--gap)" style={{ gridTemplateColumns: '1.9fr 1fr', alignItems: 'start' }}>

        {/* ── Left column: content fields ── */}
        <div className="flex flex-col gap-(--gap)">

          {/* Core fields card */}
          <Card>
            <div className="flex flex-col gap-4">
              <Input label="Title" placeholder="Enter title…" />
              <Input label="Permalink" placeholder="/slug" className="font-mono text-[13px]" />
            </div>
          </Card>

          {/* Body / rich-text card */}
          <Card>
            <Textarea
              label="Body"
              placeholder="Write the content here…"
              rows={12}
            />
            <p className="text-[12px] text-(--faint) mt-2">~0 words</p>
          </Card>

          {/* Media card */}
          <Card>
            <h3 className="text-[15px] font-semibold text-(--ink) mb-4">Media</h3>
            <div className="border-2 border-dashed border-(--border) rounded-(--r) p-8 flex flex-col items-center gap-2 text-center text-(--muted) hover:border-(--accent) transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-(--surface-2) flex items-center justify-center text-(--faint)">
                <ArrowLeft01Icon size={18} strokeWidth={1.8} />
              </div>
              <p className="text-[13.5px]">
                Drag &amp; drop files here, or{' '}
                <span className="text-(--accent) font-semibold">browse</span>
              </p>
              <p className="text-[12px] text-(--faint)">PNG, JPG, GIF, MP4 up to 10 MB</p>
            </div>
          </Card>
        </div>

        {/* ── Right column: metadata ── */}
        <div className="flex flex-col gap-(--gap)">

          {/* Publish card */}
          <Card>
            <h3 className="text-[15px] font-semibold text-(--ink) mb-4">Publish</h3>
            <div className="flex flex-col gap-4">
              <Select label="Status" options={[{ value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }]} />
              <Select label="Visibility" options={[{ value: 'public', label: 'Public' }, { value: 'private', label: 'Private' }]} />
              <Input label="Publish date" type="datetime-local" />
            </div>
          </Card>

          {/* Example: Tags / Categories card — adapt to entity spec */}
          <Card>
            <h3 className="text-[15px] font-semibold text-(--ink) mb-4">Categories</h3>
            <div className="flex flex-col gap-1">
              {['Tutorials', 'News', 'Engineering', 'Culture'].map((c) => (
                <label key={c} className="flex items-center gap-3 py-1.5 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-(--accent)" />
                  <span className="text-[13.5px] text-(--ink)">{c}</span>
                </label>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Sticky save bar — appears when form is dirty */}
      <SaveBar isDirty={false} isLoading={false} onCancel={() => {}} onSave={() => {}} />
    </div>
  )
}
