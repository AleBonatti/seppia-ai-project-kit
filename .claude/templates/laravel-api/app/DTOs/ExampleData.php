<?php

declare(strict_types=1);

namespace App\DTOs\Example;

use App\Http\Requests\StoreExampleRequest;

class ExampleData
{
    public function __construct(
        public readonly string $title,
        public readonly string $body,
        public readonly int $userId,
    ) {}

    public static function fromRequest(StoreExampleRequest $request): self
    {
        return new self(
            title:  $request->validated('title'),
            body:   $request->validated('body'),
            userId: $request->user()->id,
        );
    }

    public static function fromArray(array $data): self
    {
        return new self(
            title:  $data['title'],
            body:   $data['body'],
            userId: $data['user_id'],
        );
    }
}
