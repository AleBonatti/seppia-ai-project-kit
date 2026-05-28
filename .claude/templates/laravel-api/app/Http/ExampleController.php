<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Example\CreateExampleAction;
use App\Actions\Example\UpdateExampleAction;
use App\Actions\Example\DeleteExampleAction;
use App\DTOs\Example\ExampleData;
use App\Http\Requests\StoreExampleRequest;
use App\Http\Requests\UpdateExampleRequest;
use App\Http\Resources\ExampleResource;
use App\Models\Example;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class ExampleController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Example::class);

        $examples = Example::query()
            ->with('author')
            ->latest()
            ->paginate();

        return ExampleResource::collection($examples);
    }

    public function show(Example $example): ExampleResource
    {
        $this->authorize('view', $example);

        return new ExampleResource($example->load('author'));
    }

    public function store(StoreExampleRequest $request, CreateExampleAction $action): ExampleResource
    {
        $this->authorize('create', Example::class);

        $example = $action->execute(ExampleData::fromRequest($request));

        return new ExampleResource($example);
    }

    public function update(UpdateExampleRequest $request, Example $example, UpdateExampleAction $action): ExampleResource
    {
        $this->authorize('update', $example);

        $example = $action->execute($example, ExampleData::fromRequest($request));

        return new ExampleResource($example);
    }

    public function destroy(Example $example, DeleteExampleAction $action): Response
    {
        $this->authorize('delete', $example);

        $action->execute($example);

        return response()->noContent();
    }
}
