<?php

namespace App\Http\Controllers;

use App\Actions\Auth\RecordLoginAttemptAction;
use App\DTOs\Auth\LoginAttemptData;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    // Maximum failed attempts before lockout.
    private const MAX_ATTEMPTS = 5;

    // Lockout duration in seconds.
    private const DECAY_SECONDS = 60;

    public function login(
        LoginRequest $request,
        RecordLoginAttemptAction $record,
    ): JsonResponse {
        $key = $this->throttleKey($request);

        if (RateLimiter::tooManyAttempts($key, self::MAX_ATTEMPTS)) {
            $seconds = RateLimiter::availableIn($key);

            return response()->json([
                'message' => "Too many login attempts. Please try again in {$seconds} seconds.",
            ], 429);
        }

        $credentials = $request->only('email', 'password');
        $successful  = Auth::attempt($credentials);

        $record->execute(LoginAttemptData::fromRequest($request, $successful));

        if (! $successful) {
            RateLimiter::hit($key, self::DECAY_SECONDS);

            return response()->json([
                'message' => 'These credentials do not match our records.',
            ], 422);
        }

        RateLimiter::clear($key);
        $request->session()->regenerate();

        return response()->json([
            'data' => new UserResource(Auth::user()),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out.']);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'data' => new UserResource($request->user()),
        ]);
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private function throttleKey(Request $request): string
    {
        // Key combines lowercased email + client IP so different IPs don't
        // share the same counter, and one IP can't lock out another user's account.
        return Str::lower($request->input('email', '')) . '|' . $request->ip();
    }
}
