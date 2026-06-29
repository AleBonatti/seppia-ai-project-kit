<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Actions\TranslateEntityAction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

/**
 * Queued background job that translates a single entity's content
 * from its primary locale into one or more secondary locales.
 *
 * Dispatched by an entity's Create/Update action when the translation
 * agent feature is enabled. All work is delegated to TranslateEntityAction.
 *
 * @param class-string                          $entityClass  Eloquent model class, e.g. App\Models\Page::class
 * @param int                                   $entityId     Primary key of the entity row
 * @param string                                $sourceLocale Locale the content was authored in, e.g. 'it'
 * @param array<int, string>                    $targetLocales Locales to translate into, e.g. ['en', 'fr']
 */
class TranslateEntityJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    /** Number of times the job may be attempted before failing. */
    public int $tries = 3;

    /** Seconds to wait before retrying a failed attempt. */
    public int $backoff = 10;

    public function __construct(
        public readonly string $entityClass,
        public readonly int $entityId,
        public readonly string $sourceLocale,
        public readonly array $targetLocales,
    ) {}

    public function handle(TranslateEntityAction $action): void
    {
        $action->execute(
            entityClass: $this->entityClass,
            entityId: $this->entityId,
            sourceLocale: $this->sourceLocale,
            targetLocales: $this->targetLocales,
        );
    }
}
