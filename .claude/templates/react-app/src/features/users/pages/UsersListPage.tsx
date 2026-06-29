import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Add01Icon, Search01Icon, PencilEdit01Icon, Delete01Icon } from '@/lib/icons'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Card, CardFooter } from '@/components/ui/Card'
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell, TableCheckHead, TableCheckCell, RowTitle } from '@/components/ui/Table'
import { Pagination } from '@/layouts/Pagination'
import { useDebounce } from '@/hooks/useDebounce'
// Replace with: import { useUserList } from '../hooks/useUserList'
// Replace with: import { useDeleteUsers } from '../hooks/useDeleteUsers'

// ── Types ─────────────────────────────────────────────────────────────────────

type UserRole = 'admin' | 'editor' | 'author' | 'user'

interface UserRow {
  id: number
  name: string
  email: string
  phone?: string
  role: UserRole
  initials: string
}

// ── Role badge ────────────────────────────────────────────────────────────────

const ROLE_VARIANT: Record<UserRole, 'success' | 'info' | 'neutral' | 'warning'> = {
  admin:  'success',
  editor: 'info',
  author: 'warning',
  user:   'neutral',
}

const ROLE_LABEL: Record<UserRole, string> = {
  admin:  'Administrator',
  editor: 'Editor',
  author: 'Author',
  user:   'User',
}

// ── Placeholder data (remove when wired to React Query) ───────────────────────

const PLACEHOLDER_USERS: UserRow[] = [
  { id: 1, name: 'Ann Bolton',          email: 'a.bolton@yahoo.com',      phone: '334.843.4437',    role: 'admin',  initials: 'AB' },
  { id: 2, name: 'Catherine Robertson', email: 'francisco94@hotmail.com', phone: '0447.055.169',    role: 'editor', initials: 'CR' },
  { id: 3, name: 'Cristobal Menchaca',  email: 'cristobal@hotmail.com',   phone: '395.004.7974',    role: 'author', initials: 'CM' },
  { id: 4, name: 'Aurelia Zygmunt',     email: 'oprygiel@rejek.org',      phone: '+48 734 736 471', role: 'editor', initials: 'AZ' },
  { id: 5, name: 'Tomas Wallin',        email: 'andersson@nilsson.com',   phone: '08-17 78 52',     role: 'author', initials: 'TW' },
  { id: 6, name: 'Olaf Lether',         email: 'zzevenboom@hotmail.com',  phone: '0161-692845',     role: 'author', initials: 'OL' },
]

// ── Page ──────────────────────────────────────────────────────────────────────

export default function UsersListPage() {
  const [search, setSearch]   = useState('')
  const [page, setPage]       = useState(1)
  const [selected, setSelected] = useState<Set<number>>(new Set())

  const debouncedSearch = useDebounce(search)

  // Replace with: const { data, isLoading } = useUserList({ search: debouncedSearch, page })
  const users = PLACEHOLDER_USERS
  const total = users.length
  const totalPages = 1

  // Replace with: const deleteMutation = useDeleteUsers()

  function toggleRow(id: number): void {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleAll(): void {
    if (selected.size === users.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(users.map((u) => u.id)))
    }
  }

  function handleDeleteSelected(): void {
    const count = selected.size
    if (!window.confirm(`Delete ${count} ${count === 1 ? 'user' : 'users'}? This cannot be undone.`)) return
    // Replace with: deleteMutation.mutate([...selected], { onSuccess: () => setSelected(new Set()) })
    setSelected(new Set())
  }

  const allChecked  = users.length > 0 && selected.size === users.length
  const someChecked = selected.size > 0 && selected.size < users.length

  return (
    <div className="flex flex-col gap-(--gap)">
      <Card flush>
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap px-(--pad) pt-(--pad) pb-4">
          <h1 className="text-[20px] font-semibold text-(--ink)">Users</h1>
          <div className="flex gap-[9px]">
            <Button variant="secondary">Export</Button>
            <ButtonLink as={Link} to="/admin/users/create" variant="primary" leftIcon={<Add01Icon size={16} strokeWidth={1.8} />}>
              New User
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
              placeholder="Search users…"
              className="bg-transparent border-none outline-none text-[13.5px] text-(--ink) placeholder:text-(--faint) w-full"
            />
          </div>
          <Button
            variant="danger"
            leftIcon={<Delete01Icon size={15} strokeWidth={1.8} />}
            disabled={selected.size === 0}
            onClick={handleDeleteSelected}
          >
            Delete{selected.size > 0 ? ` (${selected.size})` : ''}
          </Button>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <tr>
              <TableCheckHead>
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-(--accent) cursor-pointer"
                  checked={allChecked}
                  ref={(el) => { if (el) el.indeterminate = someChecked }}
                  onChange={toggleAll}
                />
              </TableCheckHead>
              <TableHead className="w-[50px]" />
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} data-selected={selected.has(user.id) || undefined}>
                <TableCheckCell>
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-(--accent) cursor-pointer"
                    checked={selected.has(user.id)}
                    onChange={() => toggleRow(user.id)}
                  />
                </TableCheckCell>
                <TableCell>
                  <Avatar initials={user.initials} size="md" />
                </TableCell>
                <TableCell>
                  <RowTitle title={user.name} />
                  <div className="mt-1">
                    <Badge variant={ROLE_VARIANT[user.role]}>{ROLE_LABEL[user.role]}</Badge>
                  </div>
                </TableCell>
                <TableCell className="text-[13px] text-(--muted) font-mono">{user.email}</TableCell>
                <TableCell className="text-[13px] text-(--muted) font-mono">{user.phone ?? '—'}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      to={`/admin/users/${user.id}/edit`}
                      className="w-[34px] h-[34px] flex items-center justify-center rounded-(--r-sm) border border-transparent text-(--muted) hover:bg-(--surface-2) hover:text-(--ink) hover:border-(--border) transition-colors"
                      title="Edit"
                    >
                      <PencilEdit01Icon size={16} strokeWidth={1.8} />
                    </Link>
                    <button
                      className="w-[34px] h-[34px] flex items-center justify-center rounded-(--r-sm) border border-transparent text-(--muted) hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-colors"
                      title="Delete"
                      onClick={() => {
                        if (window.confirm('Delete this user? This cannot be undone.')) {
                          // Replace with: deleteMutation.mutate([user.id])
                        }
                      }}
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
          <span className="text-[13px] text-(--faint)">{total} {total === 1 ? 'user' : 'users'}</span>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </CardFooter>
      </Card>
    </div>
  )
}
