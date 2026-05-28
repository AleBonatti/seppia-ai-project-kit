<?php

use App\Models\Example;
use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

beforeEach(function () {
    $this->admin = User::factory()->create(['role' => 'admin']);
    $this->user  = User::factory()->create(['role' => 'user']);
});

it('lists examples', function () {
    Example::factory()->count(3)->create();

    $this->actingAs($this->user)
        ->getJson('/api/v1/examples')
        ->assertOk()
        ->assertJsonCount(3, 'data');
});

it('shows an example', function () {
    $example = Example::factory()->create();

    $this->actingAs($this->user)
        ->getJson("/api/v1/examples/{$example->id}")
        ->assertOk()
        ->assertJsonPath('data.id', $example->id);
});

it('creates an example', function () {
    $this->actingAs($this->user)
        ->postJson('/api/v1/examples', [
            'title' => 'Test title',
            'body'  => 'Test body content',
        ])
        ->assertCreated()
        ->assertJsonPath('data.title', 'Test title');

    $this->assertDatabaseHas('examples', ['title' => 'Test title']);
});

it('validates required fields on create', function () {
    $this->actingAs($this->user)
        ->postJson('/api/v1/examples', [])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['title', 'body']);
});

it('updates an example', function () {
    $example = Example::factory()->create(['user_id' => $this->user->id]);

    $this->actingAs($this->user)
        ->patchJson("/api/v1/examples/{$example->id}", ['title' => 'Updated title'])
        ->assertOk()
        ->assertJsonPath('data.title', 'Updated title');
});

it('prevents a user from updating another user\'s example', function () {
    $other   = User::factory()->create();
    $example = Example::factory()->create(['user_id' => $other->id]);

    $this->actingAs($this->user)
        ->patchJson("/api/v1/examples/{$example->id}", ['title' => 'Hacked'])
        ->assertForbidden();
});

it('deletes an example as admin', function () {
    $example = Example::factory()->create();

    $this->actingAs($this->admin)
        ->deleteJson("/api/v1/examples/{$example->id}")
        ->assertNoContent();

    $this->assertDatabaseMissing('examples', ['id' => $example->id]);
});

it('prevents a non-admin from deleting an example', function () {
    $example = Example::factory()->create();

    $this->actingAs($this->user)
        ->deleteJson("/api/v1/examples/{$example->id}")
        ->assertForbidden();
});

it('returns 401 for unauthenticated requests', function () {
    $this->getJson('/api/v1/examples')->assertUnauthorized();
});
