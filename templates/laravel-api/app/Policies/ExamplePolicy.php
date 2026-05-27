<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Example;
use App\Models\User;

class ExamplePolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Example $example): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Example $example): bool
    {
        return $user->id === $example->user_id || $user->role === 'admin';
    }

    public function delete(User $user, Example $example): bool
    {
        return $user->role === 'admin';
    }
}
