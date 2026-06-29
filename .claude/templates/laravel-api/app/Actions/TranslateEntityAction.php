<?php

declare(strict_types=1);

namespace App\Actions;

use Anthropic\Client;
use Anthropic\Messages\ToolUseBlock;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;
use RuntimeException;

/**
 * The translation agent.
 *
 * Loads an entity's primary-locale fields, asks the Claude API to translate
 * them into each target locale via a single forced tool call, then persists
 * the result onto the entity's translation table with updateOrCreate.
 *
 * This action assumes the multi-locale pattern used by the kit:
 *   - a locale-independent table  (e.g. `pages`)
 *   - a locale-specific table     (e.g. `page_translations`) related via `translations()`
 *     with columns: <entity>_id, locale, + the translatable text fields.
 *
 * Generated only when `.claude/specs/agents/translation-agent.md` is present.
 * Adapt the field list and relation/foreign-key names per entity from that spec.
 */
class TranslateEntityAction
{
    /**
     * @param class-string<Model>  $entityClass
     * @param array<int, string>   $targetLocales
     */
    public function execute(
        string $entityClass,
        int $entityId,
        string $sourceLocale,
        array $targetLocales,
    ): void {
        $entity = $entityClass::query()->with('translations')->find($entityId);

        if ($entity === null) {
            Log::warning('TranslateEntityAction: entity not found', [
                'entity' => $entityClass,
                'id'     => $entityId,
            ]);

            return;
        }

        $source = $entity->translations->firstWhere('locale', $sourceLocale);

        if ($source === null) {
            Log::warning('TranslateEntityAction: source translation missing', [
                'entity' => $entityClass,
                'id'     => $entityId,
                'locale' => $sourceLocale,
            ]);

            return;
        }

        // The translatable fields. Per entity, narrow this to the fields listed in
        // the translation-agent spec (never include slug, ids, dates, or booleans).
        $fields = $this->translatableFields($source);

        if ($fields === []) {
            return;
        }

        foreach ($targetLocales as $targetLocale) {
            $translated = $this->translateFields($fields, $sourceLocale, $targetLocale);

            $this->persist($entity, $targetLocale, $translated);
        }
    }

    /**
     * Extract the translatable text fields from the source translation row.
     *
     * @return array<string, string>
     */
    private function translatableFields(Model $source): array
    {
        // Adapt this list per entity from the translation-agent spec.
        // Only locale-specific text fields belong here.
        $keys = ['title', 'short_text', 'full_text'];

        $fields = [];

        foreach ($keys as $key) {
            $value = $source->getAttribute($key);

            if (is_string($value) && $value !== '') {
                $fields[$key] = $value;
            }
        }

        return $fields;
    }

    /**
     * Call the Claude API once, forcing a single `set_translation` tool call,
     * and return the translated field map.
     *
     * @param  array<string, string>  $fields
     * @return array<string, string>
     */
    private function translateFields(array $fields, string $sourceLocale, string $targetLocale): array
    {
        $apiKey = (string) config('services.anthropic.key');

        if ($apiKey === '') {
            throw new RuntimeException('Anthropic API key is not configured (services.anthropic.key / ANTHROPIC_API_KEY).');
        }

        $client = new Client(apiKey: $apiKey);

        $tool = [
            'name'        => 'set_translation',
            'description' => 'Return the translated values for the requested locale.',
            'inputSchema' => [
                'type'       => 'object',
                'properties' => [
                    'fields' => [
                        'type'                 => 'object',
                        'description'          => 'Map of field name to translated string.',
                        'additionalProperties' => ['type' => 'string'],
                    ],
                ],
                'required'   => ['fields'],
            ],
        ];

        $response = $client->messages->create(
            model: (string) config('agents.translation.model', 'claude-sonnet-4-6'),
            maxTokens: 8000,
            system: $this->systemPrompt(),
            tools: [$tool],
            toolChoice: ['type' => 'tool', 'name' => 'set_translation'],
            messages: [
                [
                    'role'    => 'user',
                    'content' => $this->userPrompt($fields, $sourceLocale, $targetLocale),
                ],
            ],
        );

        foreach ($response->content as $block) {
            if ($block instanceof ToolUseBlock && $block->name === 'set_translation') {
                /** @var array{fields?: array<string, mixed>} $input */
                $input = $block->input;

                return $this->sanitize($input['fields'] ?? [], array_keys($fields));
            }
        }

        throw new RuntimeException('Claude did not return a set_translation tool call.');
    }

    private function systemPrompt(): string
    {
        // Mirror the "Style instructions" block from the translation-agent spec.
        return <<<'PROMPT'
        You are a professional translator for a content management system.
        Translate the provided fields faithfully and in a professional, neutral tone.
        Preserve all HTML tags and their attributes exactly.
        Do not translate brand names, product names, or code.
        Do not add or remove information.
        Return your answer only by calling the set_translation tool.
        PROMPT;
    }

    /**
     * @param array<string, string> $fields
     */
    private function userPrompt(array $fields, string $sourceLocale, string $targetLocale): string
    {
        $json = json_encode($fields, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        return <<<PROMPT
        Translate the following fields from "{$sourceLocale}" to "{$targetLocale}".
        Return the same field keys with their translated values.

        {$json}
        PROMPT;
    }

    /**
     * Keep only the expected field keys and coerce values to strings.
     *
     * @param  array<string, mixed>  $values
     * @param  array<int, string>    $allowedKeys
     * @return array<string, string>
     */
    private function sanitize(array $values, array $allowedKeys): array
    {
        $clean = [];

        foreach ($allowedKeys as $key) {
            if (isset($values[$key]) && is_string($values[$key])) {
                $clean[$key] = $values[$key];
            }
        }

        return $clean;
    }

    /**
     * Persist the translated fields onto the entity's translation table.
     *
     * @param array<string, string> $translated
     */
    private function persist(Model $entity, string $targetLocale, array $translated): void
    {
        if ($translated === []) {
            return;
        }

        $entity->translations()->updateOrCreate(
            ['locale' => $targetLocale],
            $translated,
        );
    }
}
