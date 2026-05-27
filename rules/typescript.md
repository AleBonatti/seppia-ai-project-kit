# TypeScript Rules

These rules apply to all TypeScript code in every project generated from this kit.

---

## Strictness

- Always use strict mode (`"strict": true` in `tsconfig.json`)
- Never use `any` — if the type is unknown, use `unknown` and narrow it
- Never use `@ts-ignore` or `@ts-expect-error` without a comment explaining why
- Never use non-null assertion (`!`) unless you have verified the value cannot be null

---

## Types vs Interfaces

- Use `interface` for object shapes that describe domain entities or props
- Use `type` for unions, intersections, and utility types
- Export types and interfaces from the feature's `types.ts` file

```ts
// ✅ Interface for domain entity
interface Post {
  id: number
  title: string
  body: string
  createdAt: string
}

// ✅ Type for union
type UserRole = 'admin' | 'user'

// ✅ Type for utility
type PostPayload = Pick<Post, 'title' | 'body'>
```

---

## Return types

- Always declare explicit return types on exported functions and hooks
- Implicit return types are allowed for small private helpers inside a file

```ts
// ✅ Explicit return type on exported function
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString()
}

// ✅ Explicit return type on hook
export function usePostList(): UseQueryResult<PostListResponse> {
  return useQuery(...)
}
```

---

## API types

- Keep domain types separate from API/transport types
- Domain types represent what the UI works with
- API types represent what comes back from the server (snake_case, raw dates, etc.)
- Transform API types to domain types at the boundary (in `api.ts` or a mapper)

```ts
// src/types/api.ts — raw API shape
interface ApiPost {
  id: number
  title: string
  created_at: string   // snake_case from Laravel
}

// features/posts/types.ts — domain shape
interface Post {
  id: number
  title: string
  createdAt: string    // camelCase for the UI
}
```

---

## Generics

- Use generics to avoid duplication when the shape is reusable
- Always constrain generics — avoid unconstrained `<T>`

```ts
// ✅ Typed API response wrapper
interface ApiResponse<T> {
  data: T
}

interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    perPage: number
    currentPage: number
  }
}
```

---

## Enums

- Prefer string literal union types over TypeScript `enum`
- Enums compile to extra JS; string unions are simpler and tree-shakeable

```ts
// ✅ Preferred
type Status = 'draft' | 'published' | 'archived'

// ❌ Avoid
enum Status {
  Draft = 'draft',
  Published = 'published',
}
```

---

## Discriminated unions

- Use discriminated unions for state machines or variant shapes

```ts
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }
```

---

## What never to do

- ❌ `any` — use `unknown` and narrow, or define the type properly
- ❌ `object` as a type — always be explicit about the shape
- ❌ Casting with `as` to avoid a type error — fix the type instead
- ❌ Importing types without the `type` keyword (`import type { Foo }`)
- ❌ Implicit `any` from untyped third-party libraries — add or find type definitions
