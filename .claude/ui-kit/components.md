# UI Kit — Component Library

This file defines the shared base components available in every project.
These live in `src/components/ui/` and are used across all features.

The visual reference for all components is `jsx/SeppiaCms.html` in this kit repo.

Claude must use these components (not re-implement them) when generating UI code.

**Template files** — the following components are defined as exact template files and must be
copied verbatim, not regenerated:

- `src/components/ui/`: `Button.tsx`, `Input.tsx`, `Textarea.tsx`, `Select.tsx`, `Spinner.tsx`,
  `Checkbox.tsx`, `Badge.tsx`, `Card.tsx`, `Calendar.tsx`, `Table.tsx`, `Chip.tsx`, `Avatar.tsx`,
  `Tabs.tsx`, `Modal.tsx`, `EmptyState.tsx`, `PageHeader.tsx`, `StatCard.tsx`, `SaveBar.tsx`,
  `Dropzone.tsx`, `Toggle.tsx`
- `src/layouts/`: `AdminLayout.tsx`, `AuthLayout.tsx`, `PublicLayout.tsx`, `Sidebar.tsx`,
  `Breadcrumb.tsx`, `Pagination.tsx`, `useTheme.ts`

Sources live in `.claude/templates/react-app/src/`.

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

**Props:**

```ts
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}
```

**Styling:** Primary: `bg-(--accent) text-(--accent-ink) hover:opacity-90 rounded-[9px]` /
Secondary: `border border-(--border) text-(--ink) hover:bg-(--surface-2) rounded-[9px]` /
Ghost: `text-(--muted) hover:bg-(--surface-2) hover:text-(--ink) rounded-[9px]` /
Danger: `bg-red-500/15 text-red-400 hover:bg-red-500/25 rounded-[9px]`

**Example:**

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

**Props:**

```ts
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}
```

**Styling:** Field: `bg-(--field) border border-(--field-border) rounded-[7px] text-(--ink)` /
Label: `text-[12.5px] font-semibold text-(--ink) mb-[7px]` /
Focus: `border-(--accent)` with `color-mix()` focus ring / Error: `text-red-400 text-xs`

---

## Textarea

**File:** `src/components/ui/Textarea.tsx`

Same prop interface as `Input` but renders a `<textarea>`. `min-h-[150px] resize-y`. Use for multi-line text.

---

## Select

**File:** `src/components/ui/Select.tsx`

**Props:**

```ts
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}
```

Same field styling as Input. `appearance-none` with `ArrowDown01Icon` positioned absolutely on the right.

---

## Checkbox

**File:** `src/components/ui/Checkbox.tsx` ← copy verbatim from template

`forwardRef` — compatible with React Hook Form `register()`. Native checkbox hidden with `sr-only peer`;
custom 17×17px box styled via `peer-checked:` variants.

**Props:**

```ts
interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}
```

**Styling:** Box: `w-[17px] h-[17px] rounded-[5px] border border-(--border) bg-(--box)` /
Checked: `peer-checked:bg-(--accent) peer-checked:border-(--accent) peer-checked:text-(--accent-ink)` /
Checkmark: inline SVG polyline

**Example:**

```tsx
<Checkbox id="terms" label="I agree to the terms" {...register('terms')} />
```

---

## Card

**File:** `src/components/ui/Card.tsx` ← copy verbatim from template

Three exports: `Card`, `CardHeader`, `CardFooter`.

**Props:**

```ts
interface CardProps {
  children: React.ReactNode
  flush?: boolean    // removes default padding — use when internal sections handle their own
  className?: string
}

interface CardHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

interface CardFooterProps {
  children: React.ReactNode
  className?: string
}
```

**Styling:** Card: `bg-(--box) border border-(--border) rounded-(--r) p-(--pad)` /
`flush` omits `p-(--pad)` — sections inside add their own padding /
`CardHeader`: title `text-[20px] font-semibold`, description `text-[13.5px] text-(--muted)` /
`CardFooter`: `border-t border-(--border) p-(--pad) flex items-center justify-between`

**Example:**

```tsx
<Card>
  <CardHeader title="Settings" description="Manage your account" action={<Button>Save</Button>} />
  {/* content */}
  <CardFooter><span className="text-xs text-(--faint)">Last saved 2 min ago</span></CardFooter>
</Card>

{/* flush: list rows handle their own padding */}
<Card flush>
  {items.map(item => (
    <div key={item.id} className="px-(--pad) py-3 border-b border-(--border)">{item.name}</div>
  ))}
</Card>
```

---

## Badge

**File:** `src/components/ui/Badge.tsx` ← copy verbatim from template

Inline status pill with a leading dot. `rounded-full`, `text-[11.5px] font-medium`.
Border uses `color-mix()` to tint `--border` on colored variants.

**Props:**

```ts
interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral'
  children: React.ReactNode
  className?: string
}
```

| Variant | Color |
| --- | --- |
| `success` | `text-(--accent)` with tinted accent border |
| `warning` | `text-[#d99a2b]` with tinted border |
| `error` | `text-[#e5484d]` with tinted border |
| `info` | `text-(--muted)` with `--border` |
| `neutral` | `text-(--faint)` with `--border` |

**Example:**

```tsx
<Badge variant="success">Published</Badge>
<Badge variant="neutral">Draft</Badge>
<Badge variant="warning">Review</Badge>
```

---

## Calendar

**File:** `src/components/ui/Calendar.tsx` ← copy verbatim from template

Requires `npm install react-day-picker date-fns`. Two exports:

- `DatePicker` — input trigger that opens a dropdown calendar popover on click
- `InlineCalendar` — always-visible calendar (no trigger)

`react-day-picker` v9 is used headless — no default stylesheet; all styling applied via `classNames` prop.

**Props:**

```ts
// DatePicker
interface DatePickerProps {
  label?: string
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  dateFormat?: string   // date-fns format string, default 'dd/MM/yyyy'
}

// InlineCalendar
interface InlineCalendarProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  className?: string
}
```

**Styling:** Trigger field matches `Input.tsx` exactly (same border, label, focus ring with `color-mix()`) /
Calendar popover: `bg-(--box) border border-(--border) rounded-(--r) shadow-(--shadow)` /
Selected day: `bg-(--accent) text-(--accent-ink)` / Today: border `border-(--accent)` /
Month nav arrows: `ArrowLeft01Icon` / `ArrowRight01Icon` via `Chevron` component override

**Example:**

```tsx
{/* Controlled with React Hook Form */}
<Controller
  control={control}
  name="dueDate"
  render={({ field }) => (
    <DatePicker label="Due date" value={field.value} onChange={field.onChange} />
  )}
/>

{/* Always visible */}
<InlineCalendar value={selectedDate} onChange={setSelectedDate} />
```

---

## Chip

**File:** `src/components/ui/Chip.tsx` ← copy verbatim from template

Filter toggle button. Used above tables to filter by status, type, etc.

**Props:**

```ts
interface ChipProps {
  active?: boolean
  count?: number
  onClick?: () => void
  children: React.ReactNode
}
```

**Styling:** Default: `bg-(--surface-2) text-(--muted) rounded-full px-3 py-1 text-sm` /
Active: `bg-(--accent) text-(--accent-ink)` /
Count badge: `bg-black/20 rounded-full px-1.5 text-xs ml-1`

**Example:**

```tsx
<div className="flex gap-2">
  <Chip active={filter === 'all'} count={42} onClick={() => setFilter('all')}>All</Chip>
  <Chip active={filter === 'published'} count={31} onClick={() => setFilter('published')}>Published</Chip>
  <Chip active={filter === 'draft'} count={11} onClick={() => setFilter('draft')}>Draft</Chip>
</div>
```

---

## Avatar

**File:** `src/components/ui/Avatar.tsx` ← copy verbatim from template

User initials circle. No image support needed unless specified.

**Props:**

```ts
interface AvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
}
```

| Size | Dimensions |
| --- | --- |
| `sm` | 28px |
| `md` | 34px (default) |
| `lg` | 80px |

**Styling:** `rounded-full bg-(--accent) text-(--accent-ink) font-semibold flex items-center justify-center`

---

## Table

**File:** `src/components/ui/Table.tsx` ← copy verbatim from template

Composable table primitive. Use for entity list pages.

Sub-components: `Table` (outer `<div px-(--pad)>` + `<table>`) / `TableHeader` (`<thead>`) /
`TableBody` (`<tbody>`) / `TableRow` (`<tr>`, `hover:bg-(--surface-2)`, row dividers via `border-t border-(--border)`) /
`TableHead` (`<th>`, `text-[11px] font-bold uppercase tracking-[.06em] text-(--muted) bg-(--surface-2)`, first/last rounded `[5px]`) /
`TableCell` (`<td>`, `px-[14px] h-[var(--row-h)] align-middle`) /
`TableCheckCell` (fixed 44px checkbox column) / `RowTitle` (title + optional subtitle inside a cell)

**Example:**

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

**File:** `src/components/ui/Tabs.tsx` ← copy verbatim from template

Underline-style tab bar. Used in entity edit pages (e.g. Profile / Notifications / Integrations).

**Props:**

```ts
interface TabsProps {
  tabs: { key: string; label: string }[]
  active: string
  onChange: (key: string) => void
}
```

**Styling:** Container: `flex gap-1 border-b border-(--border)` /
Active tab: `border-b-2 border-(--accent) text-(--accent)` /
Inactive: `text-(--muted) hover:text-(--ink)`

---

## Modal

**File:** `src/components/ui/Modal.tsx` ← copy verbatim from template

Dialog overlay for confirmations and small forms.

**Props:**

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

**Styling:** Backdrop: `fixed inset-0 bg-black/60` /
Panel: `bg-(--box) border border-(--border) rounded-xl shadow-(--shadow)`

---

## PageHeader

**File:** `src/components/ui/PageHeader.tsx` ← copy verbatim from template

Consistent page title + action area. Used at the top of every admin page, below the breadcrumb.

**Props:**

```ts
interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
  backHref?: string
}
```

**Styling:** Container: `flex items-start justify-between gap-4 mb-6` /
Title: `text-2xl font-semibold text-(--selected) tracking-tight` /
Description: `text-sm text-(--muted) mt-1` /
Back button (when `backHref` provided): ghost button with `ArrowLeft01Icon`

---

## StatCard

**File:** `src/components/ui/StatCard.tsx` ← copy verbatim from template

Dashboard metric card with icon, value, and optional delta indicator.

**Props:**

```ts
interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  delta?: string
  deltaUp?: boolean
}
```

**Styling:** Card: `bg-(--box) border border-(--border) rounded-xl p-5` /
Icon container: `w-10 h-10 rounded-xl bg-(--accent)/15 text-(--accent)` /
Value: `text-2xl font-bold text-(--selected) mt-3` /
Delta up: `text-green-400`, delta down: `text-red-400`

---

## SaveBar

**File:** `src/components/ui/SaveBar.tsx` ← copy verbatim from template

Sticky bottom action bar. Used on entity edit pages.

**Props:**

```ts
interface SaveBarProps {
  lastSaved?: string
  onSave: () => void
  onDiscard?: () => void
  isLoading?: boolean
}
```

**Styling:** `sticky bottom-0 flex items-center justify-between border-t border-(--border) bg-(--box) px-5 py-3` /
Timestamp: `text-xs text-(--faint)`

---

## Toggle

**File:** `src/components/ui/Toggle.tsx` ← copy verbatim from template

On/off switch for boolean fields (active, visible, enabled, etc.).

**Props:**

```ts
interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string  // e.g. "Visible on site" / "Hidden from site"
  disabled?: boolean
}
```

**Styling:** Pill-shaped button, 38×22px. Off: `var(--box)` background, `var(--muted)` knob.
On: `var(--accent)` background, `var(--accent-ink)` knob. Knob slides 16px on toggle.

---

## Dropzone

**File:** `src/components/ui/Dropzone.tsx` ← copy verbatim from template

File drag-and-drop upload area.

**Props:**

```ts
interface DropzoneProps {
  onFilesSelected: (files: File[]) => void
  accept?: string
  multiple?: boolean
  children?: React.ReactNode
}
```

**Styling:** Default: `border-2 border-dashed border-(--field-border) rounded-xl p-8 text-center text-(--muted)` /
Drag-over: `border-(--accent) bg-(--accent)/5`

---

## EmptyState

**File:** `src/components/ui/EmptyState.tsx` ← copy verbatim from template

Shown when a list has no items.

**Props:**

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

## Layout shells

These live in `src/layouts/` — not in `ui/`. Every route uses one of these as its outermost wrapper.
All are copied verbatim from templates.

### AdminLayout

**File:** `src/layouts/AdminLayout.tsx`

CSS Grid shell (`grid-template-columns: var(--sb-w) 1fr`). Sidebar on the left, main content
on the right. The pagebox (`bg-(--box) rounded-[16px]`) scrolls independently. `<Breadcrumb />`
renders inside the pagebox above `<Outlet />`.

### AuthLayout

**File:** `src/layouts/AuthLayout.tsx`

Centered card shell used by login, forgot-password, and reset-password pages.
Shows brand mark + project name at the top; theme toggle fixed top-right.

### PublicLayout

**File:** `src/layouts/PublicLayout.tsx`

Placeholder for the public-facing frontend. Defined per-project.

### Sidebar

**File:** `src/layouts/Sidebar.tsx`

Left navigation inside `AdminLayout`. Contains: brand area (project name + collapse toggle),
nav groups with icons, user card at bottom with dark/light toggle and sign out.
Navigation items are defined per-project from `specs/project.md`.

### Breadcrumb

**File:** `src/layouts/Breadcrumb.tsx`

Floating pill at the top of the pagebox inside `AdminLayout`. Derives crumb items from the
current route path. Style: `bg-(--panel) rounded-[7px] px-4 py-[11px] mb-[18px]`.

### Pagination

**File:** `src/layouts/Pagination.tsx` ← copy verbatim from template

Server-side pagination. Shows a page window with prev/next arrows and ellipsis for large ranges.

**Props:** `currentPage: number`, `totalPages: number`, `onPageChange: (page: number) => void`, `className?: string`

**Styling:** Prev/next arrow buttons / Page buttons: `min-w-[34px] h-[34px] rounded-(--r-sm)` /
Active: `bg-(--accent) text-(--accent-ink) border-(--accent) font-semibold`

### useTheme

**File:** `src/layouts/useTheme.ts`

Manages `data-theme` attribute on `<html>`. Exports `{ theme, setTheme }`.
Default: dark. Persists to `localStorage` under key `theme`.
Shared by `AdminLayout`, `AuthLayout`, and `Sidebar`.

---

## Component generation rules

When Claude generates a new feature, it must:

1. Use components from this file — never re-implement Button, Input, Table, etc.
2. Import UI components from `@/components/ui/[Component]`
3. Import layout shells from `@/layouts/[Layout]`
4. Use CSS var tokens (`text-(--ink)`, `bg-(--box)`) — never hardcode hex colors
5. Use icons from `@/lib/icons` — never import directly from `@hugeicons/react` or `@hugeicons/core-free-icons`
6. Only create new components in `src/components/ui/` if a genuinely new primitive is needed
7. Keep feature-specific components inside `src/features/[entity]/components/`
