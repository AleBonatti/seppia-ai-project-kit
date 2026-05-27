# Frontend Rules (React + TypeScript)

These rules apply to every React frontend generated from this kit.
Claude must follow them strictly when writing any frontend code.

---

## Project structure

- Code is organized by **feature/domain**, not by technical type
- Each feature lives in `src/features/[entity]/`
- Shared UI components live in `src/components/ui/`
- Layout components live in `src/components/layout/`
- Shared hooks live in `src/hooks/`
- Global types live in `src/types/`
- Never put feature-specific code outside its feature folder

---

## Components

- One component per file
- File name = component name (PascalCase): `PostForm.tsx`, `PostTable.tsx`
- Components must have explicit prop types (never inlined `any`)
- Prefer small, focused components — if a component exceeds ~100 lines, split it
- Composition over nesting: extract sub-components rather than deeply nesting JSX
- No business logic in components — delegate to hooks

```tsx
// ✅ Correct — props typed, logic in hook
interface PostFormProps {
  postId?: number
  onSuccess: () => void
}

export function PostForm({ postId, onSuccess }: PostFormProps) {
  const { form, onSubmit, isLoading } = usePostForm({ postId, onSuccess })
  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>
}
```

---

## Hooks

- Custom hooks encapsulate all logic (data fetching, mutations, form state)
- Hook names start with `use`: `usePostList`, `useCreatePost`
- One hook per concern — don't combine unrelated logic
- Hooks that call the API always use React Query (`useQuery`, `useMutation`)
- Hooks live in `src/features/[entity]/hooks/`

```ts
// ✅ Correct — logic in hook, not in component
export function useCreatePost(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: PostPayload) => postsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      onSuccess?.()
    },
  })
}
```

---

## Data fetching

- **React Query exclusively** for all server state
- Never use `useEffect` + `fetch`/`axios` directly in components
- Never store server data in `useState`
- Query keys must be consistent: `['entity']` for lists, `['entity', id]` for singles
- Always invalidate related queries after mutations

---

## State management

- Server state → React Query
- Form state → React Hook Form
- Local UI state (open/closed, selected tab) → `useState` in the component
- Shared UI state that crosses multiple components → `useState` lifted to parent or context
- Global app state (auth user, theme) → Zustand, only when truly global
- **Never** put server data in Zustand

---

## Forms

- Always use **React Hook Form** for forms
- Always use **Zod** for schema validation
- Connect Zod to React Hook Form via `@hookform/resolvers/zod`
- Form submission calls a mutation hook — never calls API directly

```ts
const schema = z.object({
  title: z.string().min(1, 'Required').max(255),
  body:  z.string().min(1, 'Required'),
})

type FormValues = z.infer<typeof schema>
```

---

## Routing

- Use React Router v6+
- Route definitions live in `src/app/router.tsx`
- Lazy-load page components with `React.lazy`
- Protected routes wrap admin pages — redirect to login if unauthenticated
- Route params are typed explicitly

---

## Error handling

- Every `useQuery` should handle `isError` state — show a user-facing error
- Every `useMutation` should handle `onError` — show a toast or inline error
- Never silently swallow errors
- Use a toast library (e.g. `react-hot-toast` or `sonner`) for mutation feedback

---

## Naming conventions

| Thing           | Convention        | Example                    |
| --------------- | ----------------- | -------------------------- |
| Component file  | PascalCase        | `PostForm.tsx`             |
| Hook file       | camelCase         | `usePostList.ts`           |
| Type/Interface  | PascalCase        | `Post`, `PostPayload`      |
| API file        | camelCase         | `api.ts` inside feature    |
| CSS classes     | Tailwind utilities| `className="flex gap-4"`   |
| Boolean props   | `is`/`has` prefix | `isLoading`, `hasError`    |

---

## What never to do

- ❌ `any` in TypeScript — see `rules/typescript.md`
- ❌ `useEffect` for data fetching
- ❌ Server data in `useState` or Zustand
- ❌ API calls directly inside components
- ❌ Inline styles (`style={{ ... }}`)
- ❌ Logic inside page-level components (delegate to hooks)
- ❌ Feature code outside its feature folder
- ❌ Importing from another feature's internals (use shared `components/` or `hooks/` instead)
