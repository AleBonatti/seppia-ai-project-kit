import { useState } from 'react'
import { Upload01Icon, SearchMdIcon, ArrowLeft01Icon, ArrowRight01Icon } from '@/lib/icons'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardFooter } from '@/components/ui/Card'
import { Pagination } from '@/layouts/Pagination'

// ── Types ─────────────────────────────────────────────────────────────────────

type MediaType = 'image' | 'file'

interface MediaItem {
  id: number
  type: MediaType
  name: string
  ext?: string
  meta: string
  url?: string
}

// ── Thumbnail ─────────────────────────────────────────────────────────────────

interface MediaThumbProps {
  item: MediaItem
}

function MediaThumb({ item }: MediaThumbProps) {
  return (
    <div className="bg-(--box) border border-(--border) rounded-(--r) overflow-hidden cursor-pointer group hover:border-(--accent) transition-colors">
      <div className="h-[130px] bg-(--surface-2) flex items-center justify-center relative">
        {item.url ? (
          <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-center text-(--faint)">
            {item.ext && (
              <div className="text-[11px] font-bold uppercase tracking-widest mb-1 text-(--muted)">{item.ext}</div>
            )}
            <div className="w-10 h-10 rounded-xl bg-(--box) border border-(--border) flex items-center justify-center mx-auto">
              <Upload01Icon size={18} strokeWidth={1.8} />
            </div>
          </div>
        )}
        <button
          className="absolute top-2 right-2 w-7 h-7 rounded-[7px] bg-(--box) border border-(--border) text-(--muted) opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:text-(--ink)"
          title="Options"
        >
          <span className="text-[16px] leading-none">⋯</span>
        </button>
      </div>
      <div className="p-3">
        <div className="text-[13.5px] font-medium text-(--ink) truncate">{item.name}</div>
        <div className="text-[12px] text-(--faint) truncate mt-0.5">{item.meta}</div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

const PLACEHOLDER_ITEMS: MediaItem[] = [
  { id: 1,  type: 'image', name: 'hero-dashboard.jpg',   meta: '1.4 MB · 1600×900' },
  { id: 2,  type: 'image', name: 'team-photo.png',       meta: '880 KB · 1200×800' },
  { id: 3,  type: 'file',  name: 'press-kit.pdf',        ext: 'PDF',  meta: '2.1 MB' },
  { id: 4,  type: 'image', name: 'cover-summer.jpg',     meta: '1.1 MB · 1600×900' },
  { id: 5,  type: 'file',  name: 'promo-clip.mp4',       ext: 'MP4',  meta: '18 MB · 0:42' },
  { id: 6,  type: 'image', name: 'avatar-david.png',     meta: '120 KB · 400×400' },
  { id: 7,  type: 'file',  name: 'style-guide.docx',     ext: 'DOCX', meta: '340 KB' },
  { id: 8,  type: 'image', name: 'chart-export.png',     meta: '210 KB · 1024×768' },
  { id: 9,  type: 'file',  name: 'assets-bundle.zip',    ext: 'ZIP',  meta: '46 MB' },
  { id: 10, type: 'image', name: 'mockup-mobile.jpg',    meta: '760 KB · 900×1600' },
  { id: 11, type: 'file',  name: 'podcast-ep12.mp3',     ext: 'MP3',  meta: '24 MB · 31:10' },
  { id: 12, type: 'image', name: 'banner-news.jpg',      meta: '1.0 MB · 1600×600' },
]

export default function MediaLibraryPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'file'>('all')

  const filtered = PLACEHOLDER_ITEMS.filter((m) => {
    if (typeFilter !== 'all' && m.type !== typeFilter) return false
    if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="flex flex-col gap-(--gap)">
      <Card flush>
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap px-(--pad) pt-(--pad) pb-4">
          <h1 className="text-[20px] font-semibold text-(--ink)">Media Library</h1>
          <div className="flex gap-[9px]">
            <Button variant="primary" leftIcon={<Upload01Icon size={16} strokeWidth={1.8} />}>
              Upload
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap px-(--pad) pb-4 border-b border-(--border)">
          <div className="flex items-center gap-2 border border-(--field-border) bg-(--field) rounded-(--r-sm) px-3 h-9 flex-1 min-w-[200px] max-w-[320px]">
            <SearchMdIcon size={16} strokeWidth={1.8} className="text-(--faint) flex-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search files…"
              className="bg-transparent border-none outline-none text-[13.5px] text-(--ink) placeholder:text-(--faint) w-full"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'image', 'file'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={[
                  'px-3 h-8 rounded-(--r-sm) text-[13px] border transition-colors',
                  typeFilter === t
                    ? 'bg-(--accent) text-(--accent-ink) border-(--accent) font-semibold'
                    : 'bg-transparent text-(--muted) border-(--border) hover:bg-(--surface-2) hover:text-(--ink)',
                ].join(' ')}
              >
                {t === 'all' ? 'All' : t === 'image' ? 'Images' : 'Files'}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="p-(--pad)">
          {filtered.length > 0 ? (
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(188px, 1fr))' }}>
              {filtered.map((item) => (
                <MediaThumb key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-(--muted) text-[14px]">No files found.</div>
          )}
        </div>

        {/* Footer / Pagination */}
        <CardFooter>
          <span className="text-[13px] text-(--faint)">Showing 1–{filtered.length} of {filtered.length} files</span>
          <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
        </CardFooter>
      </Card>
    </div>
  )
}
