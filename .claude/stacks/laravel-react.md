# Stack: Laravel API + React SPA (TypeScript)

This is the primary stack for all Seppia projects.

- **Backend:** Laravel (API only, no Blade views)
- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Auth:** Laravel Sanctum (SPA cookie auth)
- **State:** React Query (server) + local hooks (UI)

---

## 0. Installation

### Folder structure

Every project has two top-level folders:

```text
project-root/
  api/          ← Laravel API
  frontend/     ← React SPA
```

### Laravel (`api/`)

```bash
composer create-project laravel/laravel api
cd api
composer require laravel/sanctum
composer require spatie/laravel-query-builder
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### React (`frontend/`)

```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install \
  @tanstack/react-query \
  axios \
  react-router-dom \
  react-hook-form \
  @hookform/resolvers \
  zod \
  lucide-react \
  clsx \
  tailwind-merge
npm install -D \
  tailwindcss \
  @tailwindcss/vite \
  autoprefixer \
  @types/node
```

### Tailwind setup

In `frontend/vite.config.ts`:

```ts
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/storage': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
```

The `/api` and `/storage` proxies only apply during `vite dev`. Sanctum SPA cookie auth requires the frontend and API to appear same-origin to the browser — the `/api` proxy achieves this in development. The `/storage` proxy makes Laravel's uploaded files accessible at `localhost:5173/storage/...`. In production, Vite is not involved — nginx handles routing directly.

**Production nginx config** (single domain, Laravel + React on same server):

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/project/frontend/dist;

    # Laravel storage files
    location /storage {
        alias /var/www/project/api/storage/app/public;
        try_files $uri 404;
    }

    # Laravel API
    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # React SPA — all other routes serve index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

In `frontend/src/index.css`:

```css
@import "tailwindcss";
```

In `frontend/tsconfig.app.json`, under `compilerOptions`:

```json
"paths": { "@/*": ["./src/*"] }
```

### Environment files

`api/.env` (minimum required):

```text
FRONTEND_URL=http://localhost:5173
SESSION_DRIVER=cookie
SESSION_DOMAIN=localhost
SANCTUM_STATEFUL_DOMAINS=localhost:5173
```

`frontend/.env`:

```text
VITE_API_URL=http://localhost:8000/api/v1
```

### Post-install commands

```bash
# In api/
php artisan key:generate
php artisan migrate
php artisan storage:link
```

---

## 1. Backend (Laravel)

### Philosophy

- API-first: Laravel serves JSON only, no HTML rendering
- Thin controllers: a controller method should be 5–10 lines max
- Business logic lives exclusively in Actions
- No "god services" — one Action = one operation

### Directory structure

```text
app/
  Actions/
    [Entity]/
      Create[Entity]Action.php
      Update[Entity]Action.php
      Delete[Entity]Action.php
  DTOs/
    [Entity]/
      [Entity]Data.php          ← input DTO
      [Entity]Resource.php      ← output (can use Laravel API Resources)
  Http/
    Controllers/
      [Entity]Controller.php
    Requests/
      Store[Entity]Request.php
      Update[Entity]Request.php
  Models/
    [Entity].php
  Policies/
    [Entity]Policy.php
  Queries/
    [Entity]Query.php           ← optional, for complex filtered lists
routes/
  api.php
tests/
  Feature/
    [Entity]/
      [Entity]CrudTest.php
```

### Controller pattern

```php
// Thin controller — always looks like this
class PostController extends Controller
{
    public function store(StorePostRequest $request, CreatePostAction $action): PostResource
    {
        $post = $action->execute(PostData::fromRequest($request));
        return new PostResource($post);
    }
}
```

### Action pattern

```php
class CreatePostAction
{
    public function execute(PostData $data): Post
    {
        return Post::create([
            'title'   => $data->title,
            'slug'    => Str::slug($data->title),
            'body'    => $data->body,
            'user_id' => $data->userId,
        ]);
    }
}
```

### DTO pattern

```php
class PostData
{
    public function __construct(
        public readonly string $title,
        public readonly string $body,
        public readonly int $userId,
    ) {}

    public static function fromRequest(StorePostRequest $request): self
    {
        return new self(
            title:  $request->validated('title'),
            body:   $request->validated('body'),
            userId: $request->user()->id,
        );
    }
}
```

### API response format

Success (single resource):

```json
{ "data": { "id": 1, "title": "..." } }
```

Success (collection):

```json
{ "data": [...], "meta": { "total": 10, "per_page": 15 } }
```

Error:

```json
{ "message": "Validation failed", "errors": { "title": ["Required"] } }
```

### Auth

- Laravel Sanctum with SPA cookie-based auth
- `auth:sanctum` middleware on all protected routes
- Roles handled via a `role` column on `users` table (simple enum: `admin`, `user`)
- Policies gate every resource operation

### Testing (Pest PHP)

```php
it('creates a post', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->postJson('/api/posts', [
            'title' => 'Hello World',
            'body'  => 'Content here',
        ]);

    $response->assertCreated();
    $this->assertDatabaseHas('posts', ['title' => 'Hello World']);
});
```

---

## 2. Frontend (React + TypeScript)

### Philosophy

- Feature-based: code is grouped by domain, not by type
- Each feature is self-contained: its own components, hooks, pages, types, API calls
- No barrel files (`index.ts` re-exports) unless strictly needed
- Types are explicit — never inferred from API responses without a type definition

### Directory structure

```text
src/
  app/
    App.tsx               ← router + providers
    router.tsx            ← route definitions
    queryClient.ts        ← React Query config
  features/
    auth/
      components/
        LoginForm.tsx
      hooks/
        useLogin.ts
      pages/
        LoginPage.tsx
      types.ts
      api.ts
    [entity]/
      components/
        [Entity]Form.tsx
        [Entity]Table.tsx
        [Entity]Card.tsx
      hooks/
        use[Entity]List.ts
        use[Entity].ts
        useCreate[Entity].ts
        useUpdate[Entity].ts
        useDelete[Entity].ts
      pages/
        [Entity]ListPage.tsx
        [Entity]DetailPage.tsx
      types.ts              ← domain types for this entity
      api.ts                ← axios calls for this entity
  components/
    ui/                   ← base UI components (Button, Input, Modal…)
    layout/
      AdminLayout.tsx
      Topbar.tsx
      Sidebar.tsx
  hooks/
    useDebounce.ts
    usePagination.ts
  lib/
    axios.ts              ← configured axios instance
    utils.ts
  types/
    global.d.ts
    api.ts                ← shared API response types
```

### API call pattern

```ts
// features/posts/api.ts
import { api } from '@/lib/axios'
import type { Post, PostPayload } from './types'

export const postsApi = {
  list: (params?: Record<string, unknown>) =>
    api.get<{ data: Post[]; meta: Meta }>('/posts', { params }),

  show: (id: number) =>
    api.get<{ data: Post }>(`/posts/${id}`),

  create: (payload: PostPayload) =>
    api.post<{ data: Post }>('/posts', payload),

  update: (id: number, payload: Partial<PostPayload>) =>
    api.patch<{ data: Post }>(`/posts/${id}`, payload),

  delete: (id: number) =>
    api.delete(`/posts/${id}`),
}
```

### Hook pattern (React Query)

```ts
// features/posts/hooks/usePostList.ts
import { useQuery } from '@tanstack/react-query'
import { postsApi } from '../api'

export function usePostList(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => postsApi.list(params).then(r => r.data),
  })
}
```

### Types pattern

```ts
// features/posts/types.ts
export interface Post {
  id: number
  title: string
  body: string
  createdAt: string
  updatedAt: string
  author: {
    id: number
    name: string
  }
}

export interface PostPayload {
  title: string
  body: string
}
```

---

## 3. Styling (Tailwind CSS)

- Utility-first — avoid custom CSS unless absolutely necessary
- All spacing on 8px grid (use `p-2`, `p-4`, `p-6`, `p-8` etc.)
- Mobile-first — start with mobile breakpoint, add `md:` and `lg:` as needed
- Dark mode via `dark:` variant — always provide dark mode styles
- No inline styles

---

## 4. Admin panel pattern

Every project gets a generated admin panel. It follows this pattern:

- `AdminLayout` wraps all admin pages (sidebar + topbar)
- Each entity gets: List page, Detail/Edit page, optional Create page
- Tables use server-side pagination (page, per_page params to API)
- Forms use React Hook Form + Zod for validation

---

## 5. Icons

- **Lucide React** exclusively
- Consistent `size` prop (default `16` for inline, `20` for buttons, `24` for headings)
- Never mix with other icon libraries

---

## 6. Anti-patterns — never do these

### Backend

- ❌ Business logic in controllers
- ❌ Service classes that grow into "god services"
- ❌ Dynamic/JSON-driven schema systems
- ❌ `DB::` facade calls in controllers
- ❌ Returning raw model instances from controllers (use Resources)

### Frontend

- ❌ `any` in TypeScript
- ❌ `useEffect` for data fetching (use React Query)
- ❌ Global state for server data (use React Query)
- ❌ Deeply nested component trees without extracting components
- ❌ Mixing feature code into `components/ui/`
- ❌ Implicit API response types (always define them explicitly)
