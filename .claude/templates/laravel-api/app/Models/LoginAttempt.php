<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LoginAttempt extends Model
{
    // Attempts are append-only — no updates, no soft deletes.
    public $timestamps = false;

    protected $fillable = [
        'email',
        'ip_address',
        'user_agent',
        'successful',
        'created_at',
    ];

    protected $casts = [
        'successful' => 'boolean',
        'created_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'email', 'email');
    }
}
