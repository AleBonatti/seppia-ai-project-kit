# Translation Agent

> Background agent for SeppiaCms. After a page is saved in Italian, it auto-generates the English
> translation via the Claude API. This file being present (with `enabled: true`) is what turns the
> feature on for this project.

---

## Status

```
enabled: true
```

---

## Locales

```
primary:   it
secondary: [en]
```

The Page entity stores per-locale content in `page_translations` (one row per locale), matching
these locales exactly.

---

## Entities to translate

| Entity | Fields to translate          | Trigger  |
|--------|------------------------------|----------|
| Page   | title, short_text, full_text | on_save  |

---

## Fields never to translate

- `slug` — authored per-locale by hand; never auto-translated.
- Any field not listed above (ids, `active`, timestamps, foreign keys).

---

## Style instructions

```
Translate in a professional, neutral tone suitable for a public-facing website.
Preserve all HTML tags and their attributes exactly.
Do not translate brand names, product names, or code.
Keep the meaning faithful; do not add or remove information.
```

---

## Generated artifacts

When this project is scaffolded, the following exist because of this spec:

- `app/Jobs/TranslateEntityJob.php`
- `app/Actions/TranslateEntityAction.php` (field list narrowed to `title`, `short_text`, `full_text`)
- `config/agents.php` with the `translation` block
- `anthropic` block in `config/services.php`
- `ANTHROPIC_API_KEY`, `TRANSLATION_AGENT_ENABLED`, `TRANSLATION_AGENT_MODEL` in `.env.example`
- Dispatch hook at the end of `CreatePageAction::execute()` and `UpdatePageAction::execute()`:

  ```php
  if (config('agents.translation.enabled')) {
      TranslateEntityJob::dispatch(
          entityClass:   Page::class,
          entityId:      $page->id,
          sourceLocale:  'it',
          targetLocales: ['en'],
      );
  }

  return $page;
  ```

---

## Model

`claude-sonnet-4-6` (default). Override via `TRANSLATION_AGENT_MODEL`.
