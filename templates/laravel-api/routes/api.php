<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ExampleController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| All routes are prefixed with /api/v1 via RouteServiceProvider config.
| All routes below (except auth) require Sanctum authentication.
*/

// ── Auth (public) ────────────────────────────────────────────────────────────
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// ── Authenticated routes ──────────────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // ── Entities ──────────────────────────────────────────────────────────────
    Route::apiResource('examples', ExampleController::class);

    // Add more entity resource routes here:
    // Route::apiResource('products', ProductController::class);
    // Route::apiResource('orders', OrderController::class);
});
