# Translation Agent (optional feature)

> **This file is opt-in.** It is the spec for an optional background agent that auto-translates
> entity content into secondary locales via the Claude API after an entity is saved.
>
> - If a project **wants** this feature: copy this file into the project's
>   `.claude/specs/agents/translation-agent.md` and fill it in.
> - If a project does **not** want this feature: do not create this file. When it is absent,
>   Claude Code must generate **nothing** agent-related — no job, no action, no dispatch hooks,
>   no `config/agents.php`, no `ANTHROPIC_API_KEY`.
>
> The presence of a filled-in copy of this file is the single switch that turns the feature on.

---

## Status

```
enabled: true
```

Set `enabled: false` to keep the code generated but dormant (the dispatch hook checks
`config('agents.translation.enabled')` at runtime, which is driven by an env flag — see below).
Set `enabled: true` to generate and activate.

---

## Locales

```
primary:   it
secondary: [en, fr]
```

- `primary` is the locale the author writes content in — it is the **source** of every translation.
- `secondary` are the locales the agent fills in automatically.
- These must match the locales the entity's translation table actually supports.

---

## Entities to translate

List every entity the agent should handle, the translatable fields, and how it triggers.

| Entity | Fields to translate          | Trigger  |
|--------|------------------------------|----------|
| Page   | title, short_text, full_text | on_save  |
| Post   | title, body                  | manual   |

- **Fields to translate** — only locale-specific text fields. Never list slugs, IDs, dates,
  booleans, or foreign keys.
- **Trigger**
  - `on_save` — the `Create[Entity]Action` and `Update[Entity]Action` dispatch
    `TranslateEntityJob` after persisting. This is the default.
  - `manual` — no automatic dispatch; the job is dispatched only from an explicit
    endpoint/button (generate that endpoint only if the project asks for it).

---

## Fields never to translate

Always preserved verbatim, regardless of the table above:

- `slug` — URL identifiers are not translated by the agent (they are authored per-locale by hand
  if needed).
- Any field not explicitly listed in the "Fields to translate" column.

---

## Style instructions

Free-text guidance passed to the model as part of the prompt. Keep it short and concrete.

```
Translate in a professional, neutral tone.
Preserve all HTML tags and their attributes exactly.
Do not translate brand names, product names, or code.
Keep the meaning faithful; do not add or remove information.
```

---

## How Claude Code generates this feature

When this file is present and `enabled: true`, generate:

1. `app/Jobs/TranslateEntityJob.php` — from `.claude/templates/laravel-api/app/Jobs/TranslateEntityJob.php`
2. `app/Actions/TranslateEntityAction.php` — from `.claude/templates/laravel-api/app/Actions/TranslateEntityAction.php`
3. `config/agents.php`:

   ```php
   <?php

   return [
       'translation' => [
           'enabled' => (bool) env('TRANSLATION_AGENT_ENABLED', false),
           'model'   => env('TRANSLATION_AGENT_MODEL', 'claude-sonnet-4-6'),
       ],
   ];
   ```

4. Add an `anthropic` block to `config/services.php` (the action reads the key via
   `config('services.anthropic.key')`, the Laravel convention for third-party credentials):

   ```php
   'anthropic' => [
       'key' => env('ANTHROPIC_API_KEY'),
   ],
   ```

5. Append to `.env.example`:

   ```
   ANTHROPIC_API_KEY=
   TRANSLATION_AGENT_ENABLED=true
   TRANSLATION_AGENT_MODEL=claude-sonnet-4-6
   ```

6. For every entity with an `on_save` trigger, add the dispatch hook at the **end** of its
   `Create[Entity]Action::execute()` and `Update[Entity]Action::execute()`, after the model is
   saved and before it is returned:

   ```php
   if (config('agents.translation.enabled')) {
       TranslateEntityJob::dispatch(
           entityClass:  Page::class,
           entityId:     $page->id,
           sourceLocale: 'it',
           targetLocales: ['en', 'fr'],
       );
   }

   return $page;
   ```

7. Install the SDK once per project: `composer require anthropic-ai/sdk`.

The job runs on the queue (`QUEUE_CONNECTION`), so the user's save request returns immediately
and the translation happens in the background.

---

## Model

Default: `claude-sonnet-4-6` — translation is a high-volume, well-scoped task where Sonnet is a
good cost/quality fit. Override per project via `TRANSLATION_AGENT_MODEL`.
