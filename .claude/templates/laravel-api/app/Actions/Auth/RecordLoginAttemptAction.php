<?php

namespace App\Actions\Auth;

use App\DTOs\Auth\LoginAttemptData;
use App\Models\LoginAttempt;

class RecordLoginAttemptAction
{
    public function execute(LoginAttemptData $data): void
    {
        LoginAttempt::create([
            'email'      => $data->email,
            'successful' => $data->successful,
            'ip_address' => $data->ipAddress,
            'user_agent' => $data->userAgent,
            'created_at' => now(),
        ]);
    }
}
