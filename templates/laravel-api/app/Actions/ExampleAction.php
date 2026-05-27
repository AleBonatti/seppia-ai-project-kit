<?php

declare(strict_types=1);

namespace App\Actions\Example;

use App\DTOs\Example\ExampleData;
use App\Models\Example;

class CreateExampleAction
{
    public function execute(ExampleData $data): Example
    {
        return Example::create([
            'title'   => $data->title,
            'body'    => $data->body,
            'user_id' => $data->userId,
        ]);
    }
}
