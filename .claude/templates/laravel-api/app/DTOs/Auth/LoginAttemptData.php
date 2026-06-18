<?php

namespace App\DTOs\Auth;

use Illuminate\Http\Request;

class LoginAttemptData
{
    public function __construct(
        public readonly string $email,
        public readonly bool   $successful,
        public readonly ?string $ipAddress,
        public readonly ?string $userAgent,
    ) {}

    public static function fromRequest(Request $request, bool $successful): self
    {
        return new self(
            email:      $request->input('email', ''),
            successful: $successful,
            ipAddress:  $request->ip(),
            userAgent:  $request->userAgent(),
        );
    }
}
