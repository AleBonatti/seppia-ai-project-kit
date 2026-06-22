// Template: Entity List Page
// Replace every occurrence of "Entity" / "entity" / "entities" with the real entity name.
// Replace column definitions, filters, and badge logic to match the entity spec.

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Add01Icon, Search01Icon, PencilEdit01Icon, Delete01Icon } from '@/lib/icons'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, CardFooter } from '@/components/ui/Card'
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell, TableCheckHead, TableCheckCell, RowTitle } from '@/components/ui/Table'
import { Pagination } from '@/layouts/Pagination'
import { useDebounce } from '@/hooks/useDebounce'
// Replace with: import { useEntityList } from '../hooks/useEntityList'

// ── Types ─────────────────────────────────────────────────────────────────────

// Replace with the real entity type from features/[entity]/types.ts
interface Entity {
  id: number
  title: string
  slug: string
  status: 'published' | 'draft'
  author: string
  createdAt: string
}

// ── Placeholder data (remove when wired to React Query) ───────────────────────

const PLACEHOLDER_ROWS: Entity[] = [
  { id: 1, title: 'Example entry one',   slug: 'example-entry-one',   status: 'published', author: 'Admin', createdAt: 'Jun 10, 2026' },
  { id: 2, title: 'Example entry two',   slug: 'example-entry-two',   status: 'draft',     author: 'Admin', createdAt: 'Jun 8, 2026' },
  { id: 3, title: 'Example entry three', slug: 'example-entry-three', status: 'published', author: 'Admin', createdAt: 'Jun 5, 2026' },
]

// ── Page ──────────────────────────────────────────────────────────────────────

export default function EntityListPage() {
  const [search, setSearch]           = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [page, setPage]               = useState(1)

  const debouncedSearch = useDebounce(search)

  // Replace with: const { data, isLoading } = useEntityList({ search: debouncedSearch, status: statusFilter, page })
  const rows = PLACEHOLDER_ROWS
  const total = rows.length
  const totalPages = 1

  return (
    <div className="flex flex-col gap-(--gap)">
      <Card flush>
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap px-(--pad) pt-(--pad) pb-4">
          <h1 className="text-[20px] font-semibold text-(--ink)">Entities</h1>
          <div className="flex gap-[9px]">
            <Button variant="secondary">Export</Button>
            <ButtonLink as={Link} to="/admin/entities/create" variant="primary" leftIcon={<Add01Icon size={16} strokeWidth={1.8} />}>
              New Entity
            </ButtonLink>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap px-(--pad) pb-4">
          <div className="flex items-center gap-2 border border-(--field-border) bg-(--field) rounded-(--r-sm) px-3 h-9 flex-1 min-w-[200px] max-w-[320px]">
            <Search01Icon size={16} strokeWidth={1.8} className="text-(--faint) flex-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search entities…"
              className="bg-transparent border-none outline-none text-[13.5px] text-(--ink) placeholder:text-(--faint) w-full"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'published', 'draft'] as const).map((f) => (
              <button
                key={f}
                onClick={() => { setStatusFilter(f); setPage(1) }}
                className={[
                  'px-3 h-8 rounded-(--r-sm) text-[13px] border transition-colors capitalize',
                  statusFilter === f
                    ? 'bg-(--accent) text-(--accent-ink) border-(--accent) font-semibold'
                    : 'bg-transparent text-(--muted) border-(--border) hover:bg-(--surface-2) hover:text-(--ink)',
                ].join(' ')}
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <tr>
              <TableCheckHead />
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCheckCell>
                  <input type="checkbox" className="w-4 h-4 accent-(--accent) cursor-pointer" />
                </TableCheckCell>
                <TableCell>
                  <RowTitle title={row.title} sub={`/${row.slug}`} />
                </TableCell>
                <TableCell className="text-[13.5px] text-(--muted)">{row.author}</TableCell>
                <TableCell>
                  <Badge variant={row.status === 'published' ? 'success' : 'neutral'}>
                    {row.status === 'published' ? 'Published' : 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell className="text-[13px] text-(--muted) tabular-nums">{row.createdAt}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      to={`/admin/entities/${row.id}/edit`}
                      className="w-[34px] h-[34px] flex items-center justify-center rounded-(--r-sm) border border-transparent text-(--muted) hover:bg-(--surface-2) hover:text-(--ink) hover:border-(--border) transition-colors"
                      title="Edit"
                    >
                      <PencilEdit01Icon size={16} strokeWidth={1.8} />
                    </Link>
                    <button
                      className="w-[34px] h-[34px] flex items-center justify-center rounded-(--r-sm) border border-transparent text-(--muted) hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-colors"
                      title="Delete"
                    >
                      <Delete01Icon size={16} strokeWidth={1.8} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Footer / Pagination */}
        <CardFooter>
          <span className="text-[13px] text-(--faint)">
            {total} {total === 1 ? 'entry' : 'entries'}
          </span>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </CardFooter>
      </Card>
    </div>
  )
}
