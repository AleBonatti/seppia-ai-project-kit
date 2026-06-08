# UI Kit — Component Library

This file defines the shared base components available in every project.
These live in `src/components/ui/` and are used across all features.

The visual reference for all components is `jsx/SeppiaCms.html` in this kit repo.

Claude must use these components (not re-implement them) when generating UI code.

---

## Button

**File:** `src/components/ui/Button.tsx`

### Variants

| Variant | Use |
| --- | --- |
| `primary` | Main CTA — filled with `--accent` background |
| `secondary` | Secondary actions — bordered, no fill |
| `danger` | Destructive actions — red tones |
| `ghost` | Low-emphasis — no border, no fill |

### Sizes

| Size | Use |
| --- | --- |
| `sm` | Table row actions, compact contexts |
| `md` | Default |
| `lg` | Page-level primary actions |

### Props

```ts
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}
```

### Styling notes

- Primary: `bg-(--accent) text-(--accent-ink) hover:opacity-90 rounded-[9px]`
- Secondary: `border border-(--border) text-(--ink) hover:bg-(--surface-2) rounded-[9px]`
- Ghost: `text-(--muted) hover:bg-(--surface-2) hover:text-(--ink) rounded-[9px]`
- Danger: `bg-red-500/15 text-red-400 hover:bg-red-500/25 rounded-[9px]`

### Usage

```tsx
<Button variant="primary" onClick={handleSave} isLoading={isSaving}>
  Save changes
</Button>

<Button variant="danger" size="sm" leftIcon={<Delete02Icon size={14} strokeWidth={1.8} />}>
  Delete
</Button>
```

---

## Input

**File:** `src/components/ui/Input.tsx`

### Props

```ts
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}
```

### Styling notes

- Wrapper: `bg-(--field) border border-(--field-border) rounded-xl text-(--ink)`
- Label: `text-sm font-medium text-(--muted)`
- Error: `text-red-400 text-xs`
- Focus: `focus:border-(--accent) focus:outline-none`

---

## Textarea

**File:** `src/components/ui/Textarea.tsx`

Same prop interface as `Input` but renders a `<textarea>`. Use for multi-line text.

---

## Select

**File:** `src/components/ui/Select.tsx`

### Props

```ts
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}
```

Same styling as Input. Use a caret icon on the right.

---

## Card

**File:** `src/components/ui/Card.tsx`

A surface container. Background `bg-(--box)`, border `border border-(--border)`, radius `rounded-xl`, padding `p-5`.

### Props

```ts
interface CardProps {
  title?: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}
```

---

## Badge

**File:** `src/components/ui/Badge.tsx`

Inline status indicators. Small pill shape, `rounded-full`, `text-xs font-medium`.

### Props

```ts
interface BadgeProps {
  variant: 'success' | 'warning' | 'error' | 'info' | 'neutral'
  children: React.ReactNode
}
```

### Styling per variant

| Variant | Classes |
| --- | --- |
| `success` | `bg-green-500/15 text-green-400` |
| `warning` | `bg-orange-500/15 text-orange-400` |
| `error` | `bg-red-500/15 text-red-400` |
| `info` | `bg-blue-500/15 text-blue-400` |
| `neutral` | `bg-zinc-500/15 text-zinc-400` |

### Usage

```tsx
<Badge variant="success">Published</Badge>
<Badge variant="neutral">Draft</Badge>
<Badge variant="warning">Review</Badge>
```

---

## Chip

**File:** `src/components/ui/Chip.tsx`

Filter toggle button. Used above tables to filter by status, type, etc.

### Props

```ts
interface ChipProps {
  active?: boolean
  count?: number
  onClick?: () => void
  children: React.ReactNode
}
```

### Styling notes

- Default: `bg-(--surface-2) text-(--muted) rounded-full px-3 py-1 text-sm`
- Active: `bg-(--accent) text-(--accent-ink)`
- Count badge inside: `bg-black/20 rounded-full px-1.5 text-xs ml-1`

### Usage

```tsx
<div className="flex gap-2">
  <Chip active={filter === 'all'} count={42} onClick={() => setFilter('all')}>All</Chip>
  <Chip active={filter === 'published'} count={31} onClick={() => setFilter('published')}>Published</Chip>
  <Chip active={filter === 'draft'} count={11} onClick={() => setFilter('draft')}>Draft</Chip>
</div>
```

---

## Avatar

**File:** `src/components/ui/Avatar.tsx`

User initials circle. No image support needed unless specified.

### Props

```ts
interface AvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
}
```

### Sizing

| Size | Dimensions |
| --- | --- |
| `sm` | 28px |
| `md` | 34px (default) |
| `lg` | 80px |

Styling: `rounded-full bg-(--accent) text-(--accent-ink) font-semibold flex items-center justify-center`

---

## Table

**File:** `src/components/ui/Table.tsx`

Composable table primitive. Use for entity list pages.

### Sub-components

- `Table` — `<table>` wrapper, `w-full`
- `TableHeader` — `<thead>` with `border-b border-(--border)`
- `TableBody` — `<tbody>` with `divide-y divide-(--border-soft)`
- `TableRow` — `<tr>` with `hover:bg-(--surface-2) transition-colors`
- `TableHead` — `<th>` — `text-xs uppercase tracking-wider text-(--faint) font-medium px-4`
- `TableCell` — `<td>` — `px-4 text-sm text-(--ink)`, height via `--row-h`

### Usage

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Title</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Date</TableHead>
      <TableHead />
    </TableRow>
  </TableHeader>
  <TableBody>
    {posts.map(post => (
      <TableRow key={post.id}>
        <TableCell>
          <div className="font-medium text-(--selected)">{post.title}</div>
          <div className="text-xs text-(--faint)">{post.slug}</div>
        </TableCell>
        <TableCell><Badge variant="success">{post.status}</Badge></TableCell>
        <TableCell className="text-(--muted)">{formatDate(post.date)}</TableCell>
        <TableCell>
          <Button variant="ghost" size="sm">Edit</Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

## Tabs

**File:** `src/components/ui/Tabs.tsx`

Underline-style tab bar. Used in entity edit pages (e.g. Profile / Notifications / Integrations).

### Props

```ts
interface TabsProps {
  tabs: { key: string; label: string }[]
  active: string
  onChange: (key: string) => void
}
```

### Styling notes

- Container: `flex gap-1 border-b border-(--border)`
- Tab: `px-4 py-2 text-sm font-medium transition-colors`
- Active: `border-b-2 border-(--accent) text-(--accent)`
- Inactive: `text-(--muted) hover:text-(--ink)`

---

## Breadcrumb

**File:** `src/components/ui/Breadcrumb.tsx`

Page-level breadcrumb bar. Sits at the top of the main content area, above the page header.

### Props

```ts
interface BreadcrumbProps {
  items: { label: string; href?: string; icon?: React.ReactNode }[]
}
```

### Styling notes

- Container: `flex items-center gap-1.5 px-5 py-3 border-b border-(--border) text-sm text-(--muted)`
- Separator: `/` or `>` character in `text-(--faint)`
- Last item: `text-(--ink) font-medium` (not a link)

---

## Modal

**File:** `src/components/ui/Modal.tsx`

Dialog overlay for confirmations and small forms.

### Props

```ts
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
}
```

### Styling notes

- Backdrop: `fixed inset-0 bg-black/60`
- Panel: `bg-(--box) border border-(--border) rounded-xl shadow-(--shadow)`

---

## Pagination

**File:** `src/components/ui/Pagination.tsx`

Server-side pagination. Shows page numbers with prev/next.

### Props

```ts
interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}
```

### Styling notes

- Container: `flex items-center gap-1`
- Page button: `w-8 h-8 rounded-[9px] text-sm text-(--muted) hover:bg-(--surface-2)`
- Active page: `bg-(--accent) text-(--accent-ink) font-medium`

---

## PageHeader

**File:** `src/components/ui/PageHeader.tsx`

Consistent page title + action area. Used at the top of every admin page, below the breadcrumb.

### Props

```ts
interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
  backHref?: string
}
```

### Styling notes

- Container: `flex items-start justify-between gap-4 mb-6`
- Title: `text-2xl font-semibold text-(--selected) tracking-tight`
- Description: `text-sm text-(--muted) mt-1`
- Back button (when `backHref` provided): ghost button with `ArrowLeft01Icon`

---

## StatCard

**File:** `src/components/ui/StatCard.tsx`

Dashboard metric card with icon, value, and optional delta indicator.

### Props

```ts
interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  delta?: string
  deltaUp?: boolean
}
```

### Styling notes

- Card: `bg-(--box) border border-(--border) rounded-xl p-5`
- Icon container: `w-10 h-10 rounded-xl bg-(--accent)/15 text-(--accent) flex items-center justify-center`
- Value: `text-2xl font-bold text-(--selected) mt-3`
- Delta up: `text-green-400`, delta down: `text-red-400`

---

## SaveBar

**File:** `src/components/ui/SaveBar.tsx`

Sticky bottom action bar. Used on entity edit pages.

### Props

```ts
interface SaveBarProps {
  lastSaved?: string
  onSave: () => void
  onDiscard?: () => void
  isLoading?: boolean
}
```

### Styling notes

- Container: `sticky bottom-0 flex items-center justify-between border-t border-(--border) bg-(--box) px-5 py-3`
- Timestamp: `text-xs text-(--faint)`

---

## Dropzone

**File:** `src/components/ui/Dropzone.tsx`

File drag-and-drop upload area.

### Props

```ts
interface DropzoneProps {
  onFilesSelected: (files: File[]) => void
  accept?: string
  multiple?: boolean
  children?: React.ReactNode
}
```

### Styling notes

- Default: `border-2 border-dashed border-(--field-border) rounded-xl p-8 text-center text-(--muted)`
- Drag-over: `border-(--accent) bg-(--accent)/5`

---

## EmptyState

**File:** `src/components/ui/EmptyState.tsx`

Shown when a list has no items.

### Props

```ts
interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}
```

---

## Spinner

**File:** `src/components/ui/Spinner.tsx`

Loading indicator. Sizes: `sm` (16px), `md` (24px), `lg` (40px).

---

## Layout components

These live in `src/components/layout/` and are not part of `ui/`.

### AdminLayout

**File:** `src/components/layout/AdminLayout.tsx`

CSS Grid shell — sidebar + main content. See `design-system.md` § Layout.

### Sidebar

**File:** `src/components/layout/Sidebar.tsx`

Left navigation. Contains: brand area, nav groups, user card with theme toggle and logout.
Navigation items are defined per-project from `specs/project.md`.

### Breadcrumb (layout-level)

**File:** `src/components/layout/Breadcrumb.tsx`

Sits at the top of the main column. Uses the `Breadcrumb` UI component. Driven by current route.

---

## Component generation rules

When Claude generates a new feature, it must:

1. Use components from this file — never re-implement Button, Input, Table, etc.
2. Import from `@/components/ui/[Component]`
3. Use CSS var tokens (`text-(--ink)`, `bg-(--box)`) — never hardcode hex colors
4. Use Hugeicons for all icons — never Lucide or other libraries
5. Only create new components in `src/components/ui/` if a genuinely new primitive is needed
6. Keep feature-specific components inside `src/features/[entity]/components/`
