# Backend Rules (Laravel)

These rules apply to every Laravel project generated from this kit.
Claude must follow them strictly when writing any backend code.

---

## Controllers

- Controllers are HTTP adapters only — they receive a request, call an Action, return a response
- Maximum ~10 lines per method
- No `if`, no `foreach`, no database calls inside controllers
- Always type-hint the Action via constructor injection (Laravel DI handles it)
- Always return a typed API Resource, never a raw model or array

```php
// ✅ Correct
public function store(StorePostRequest $request, CreatePostAction $action): PostResource
{
    return new PostResource($action->execute(PostData::fromRequest($request)));
}

// ❌ Wrong
public function store(Request $request): JsonResponse
{
    $validated = $request->validate([...]);
    $post = Post::create($validated);
    return response()->json($post);
}
```

---

## Actions

- One Action = one business operation (Create, Update, Delete, Publish, etc.)
- Actions live in `app/Actions/[Entity]/`
- Actions receive a DTO, return a Model or void
- Actions can call other Actions if needed, but keep chains shallow
- No HTTP concerns inside Actions (no `request()`, no `response()`)

```php
// ✅ Correct
class CreatePostAction
{
    public function execute(PostData $data): Post
    {
        return Post::create([...]);
    }
}
```

---

## DTOs (Data Transfer Objects)

- DTOs are readonly value objects — they carry validated data between layers
- Input DTOs live in `app/DTOs/[Entity]/[Entity]Data.php`
- DTOs have a `fromRequest()` static factory for controller use
- DTOs can also have `fromArray()` for use in tests or commands
- Never pass a raw `Request` object into an Action

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

---

## Form Requests (Validation)

- All validation lives in `app/Http/Requests/`
- Name pattern: `Store[Entity]Request`, `Update[Entity]Request`
- Always extend `FormRequest`
- Always define `authorize()` — return `true` if authorization is handled by Policy
- Always define `rules()` with explicit types and constraints

```php
class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Policy handles authorization separately
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'body'  => ['required', 'string'],
        ];
    }
}
```

---

## Models

- Models define `$fillable` explicitly — never use `$guarded = []`
- Models define `$casts` for dates, booleans, enums
- Models define relationships as typed methods
- No business logic in models — only relationships, casts, scopes
- Scopes are allowed for reusable query constraints

```php
class Post extends Model
{
    protected $fillable = ['title', 'slug', 'body', 'user_id', 'published_at'];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->whereNotNull('published_at');
    }
}
```

---

## Policies

- Every model that is accessed via API must have a Policy
- Policy lives in `app/Policies/[Entity]Policy.php`
- Register policies in `AuthServiceProvider`
- Standard methods: `viewAny`, `view`, `create`, `update`, `delete`

```php
class PostPolicy
{
    public function update(User $user, Post $post): bool
    {
        return $user->id === $post->user_id || $user->role === 'admin';
    }
}
```

---

## API Resources

- Use Laravel API Resources for all output
- Resources live alongside DTOs or in `app/Http/Resources/`
- Always wrap collections in `ResourceCollection` for consistent `meta`
- Never return raw `$model->toArray()`

---

## Queries (Spatie QueryBuilder)

Use `spatie/laravel-query-builder` for all filterable, sortable, paginated index endpoints.

**Critical:** `allowedFilters()`, `allowedSorts()`, and `allowedIncludes()` are **variadic methods** —
they take individual arguments, never an array. Always pass arguments directly, or spread an array.

```php
// ✅ Correct — variadic arguments
QueryBuilder::for(Post::class)
    ->allowedFilters('title', 'status', AllowedFilter::exact('user_id'))
    ->allowedSorts('title', 'created_at', '-created_at')
    ->allowedIncludes('author', 'tags')
    ->paginate();

// ✅ Also correct — spread an array if you build it dynamically
$filters = ['title', 'status'];
QueryBuilder::for(Post::class)
    ->allowedFilters(...$filters)
    ->paginate();

// ❌ Wrong — passing an array causes a fatal TypeError
QueryBuilder::for(Post::class)
    ->allowedFilters(['title', 'status'])   // ← never do this
    ->paginate();
```

Complex queries go in `app/Queries/[Entity]Query.php` — keeps the controller thin:

```php
class PostQuery
{
    public function get(): LengthAwarePaginator
    {
        return QueryBuilder::for(Post::class)
            ->allowedFilters('title', 'status', AllowedFilter::exact('user_id'))
            ->allowedSorts('title', 'created_at')
            ->allowedIncludes('author')
            ->paginate();
    }
}
```

The controller then becomes a single line:

```php
public function index(PostQuery $query): AnonymousResourceCollection
{
    return PostResource::collection($query->get());
}
```

---

## Migrations

- Always use explicit column types and lengths
- Always add indexes for foreign keys and frequently filtered columns
- Always use `->after()` when adding columns to existing tables
- Never modify existing migration files — always create new ones

---

## Testing

- Use Pest PHP exclusively
- Feature tests preferred over unit tests for business logic
- Each entity gets a test file at `tests/Feature/[Entity]/[Entity]CrudTest.php`
- Every test uses `RefreshDatabase`
- Tests must cover: create, read (list + single), update, delete, validation errors, authorization
- Use `User::factory()` and model factories — never hardcode IDs

---

## What never to do

- ❌ Business logic in controllers
- ❌ `DB::` facade in controllers
- ❌ Raw `request()->input()` without validation
- ❌ Returning raw models from controllers
- ❌ `$guarded = []` on models
- ❌ `Service` classes that accumulate unrelated logic
- ❌ Dynamic schema / meta-programming patterns
- ❌ Logic inside migrations
