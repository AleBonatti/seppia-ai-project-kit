# UI Kit — Component Library

This file defines the shared base components available in every project.
These live in `src/components/ui/` and are used across all features.

Claude must use these components (not re-implement them) when generating UI code.

---

## Button

**File:** `src/components/ui/Button.tsx`

### Variants

| Variant     | Use                                        |
| ----------- | ------------------------------------------ |
| `primary`   | Main CTA — create, save, submit            |
| `secondary` | Secondary actions — cancel, back           |
| `danger`    | Destructive actions — delete, remove       |
| `ghost`     | Low-emphasis actions — icon buttons, links |

### Sizes

| Size   | Use                                |
| ------ | ---------------------------------- |
| `sm`   | Compact contexts (table row actions) |
| `md`   | Default (most buttons)             |
| `lg`   | Page-level primary actions         |

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

### Usage

```tsx
<Button variant="primary" onClick={handleSave} isLoading={isSaving}>
  Save changes
</Button>

<Button variant="danger" size="sm" leftIcon={<Trash size={14} />}>
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

### Usage

```tsx
<Input
  label="Title"
  placeholder="Enter a title"
  error={form.formState.errors.title?.message}
  {...form.register('title')}
/>
```

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

---

## Card

**File:** `src/components/ui/Card.tsx`

A surface container with padding and optional header.

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

### Usage

```tsx
<Card title="Recent Orders" description="Last 10 orders placed">
  <OrderTable />
</Card>
```

---

## Badge

**File:** `src/components/ui/Badge.tsx`

Inline status indicators.

### Props

```ts
interface BadgeProps {
  variant: 'success' | 'warning' | 'error' | 'info' | 'neutral'
  children: React.ReactNode
}
```

### Usage

```tsx
<Badge variant="success">Published</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Archived</Badge>
```

---

## Table

**File:** `src/components/ui/Table.tsx`

A composable table primitive. Use for entity list pages.

### Sub-components

- `Table` — wrapper
- `TableHeader` — `<thead>`
- `TableBody` — `<tbody>`
- `TableRow` — `<tr>`
- `TableHead` — `<th>`
- `TableCell` — `<td>`

### Usage

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Title</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Created</TableHead>
      <TableHead />
    </TableRow>
  </TableHeader>
  <TableBody>
    {posts.map(post => (
      <TableRow key={post.id}>
        <TableCell>{post.title}</TableCell>
        <TableCell><Badge variant="success">{post.status}</Badge></TableCell>
        <TableCell>{formatDate(post.createdAt)}</TableCell>
        <TableCell>
          <Button variant="ghost" size="sm">Edit</Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

## Modal

**File:** `src/components/ui/Modal.tsx`

A dialog overlay for confirmations and small forms.

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

### Usage

```tsx
<Modal
  isOpen={isDeleteModalOpen}
  onClose={() => setIsDeleteModalOpen(false)}
  title="Delete post"
  description="This action cannot be undone."
  footer={
    <>
      <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
        Cancel
      </Button>
      <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>
        Delete
      </Button>
    </>
  }
>
  <p>Are you sure you want to delete "{post.title}"?</p>
</Modal>
```

---

## Spinner

**File:** `src/components/ui/Spinner.tsx`

Loading indicator. Use in place of content while data is fetching.

### Props

```ts
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}
```

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

### Usage

```tsx
<EmptyState
  icon={<FileText size={32} />}
  title="No posts yet"
  description="Create your first post to get started."
  action={<Button variant="primary">Create post</Button>}
/>
```

---

## Pagination

**File:** `src/components/ui/Pagination.tsx`

Server-side pagination controls. Connects to API `meta.currentPage` and `meta.total`.

### Props

```ts
interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}
```

---

## PageHeader

**File:** `src/components/ui/PageHeader.tsx`

Consistent page title + action area used at the top of every admin page.

### Props

```ts
interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
}
```

### Usage

```tsx
<PageHeader
  title="Posts"
  description="Manage all posts"
  action={
    <Button variant="primary" leftIcon={<Plus size={16} />} onClick={handleCreate}>
      New post
    </Button>
  }
/>
```

---

## Layout components

These live in `src/components/layout/` and are not part of `ui/`.

### AdminLayout

**File:** `src/components/layout/AdminLayout.tsx`

Wraps every admin page. Renders Sidebar + Topbar + scrollable content area.

```tsx
// Usage — every admin page looks like this
export function PostListPage() {
  return (
    <AdminLayout>
      <PageHeader title="Posts" action={...} />
      <PostTable />
    </AdminLayout>
  )
}
```

### Sidebar

**File:** `src/components/layout/Sidebar.tsx`

Left navigation panel. Navigation items are defined per-project based on `specs/project.md`.

### Topbar

**File:** `src/components/layout/Topbar.tsx`

Top bar with project name, current user, and logout button.

---

## Component generation rules

When Claude generates a new feature, it must:

1. Use components from this file — never re-implement Button, Input, Table, etc.
2. Import from `@/components/ui/[Component]`
3. Only create new components in `src/components/ui/` if a genuinely new primitive is needed
4. Keep feature-specific components inside `src/features/[entity]/components/`
