---
name: llms-markdown-sync
description: Generates the English Markdown twin of a page for LLMs (llmstxt.org), using a small model on the raw English MDX.
---

# LLM Markdown Sync Skill

Every indexable page has a clean, structured Markdown twin for LLMs and agents, following
[llmstxt.org](https://llmstxt.org/): same URL as the page plus `index.html.md`.

## Core Principles

1. **English only**: Twins are generated from the English MDX (`src/pages/en/**`) only. German
   pages link to the English twin via `<link rel="alternate" type="text/markdown">` in
   `src/layouts/Layout.astro`.
2. **Run after `mdx-translation-sync`**: The English MDX must be final before this skill runs.
3. **Small model, raw input**: Delegate generation to a subagent with `model: "haiku"`, one call
   per changed page (parallel if several). Pass the raw English MDX path, no pre-processing.
4. **No translation, no invention**: The twin restructures what the page shows. Nothing more.

## Path Mapping

| Source                             | Twin                                         |
| ---------------------------------- | -------------------------------------------- |
| `src/pages/en/index.mdx`           | `public/en/index.html.md`                    |
| `src/pages/en/<slug>.mdx`          | `public/en/<slug>/index.html.md`             |
| `src/pages/en/<dir>/index.mdx`     | `public/en/<dir>/index.html.md`              |
| `src/pages/en/<dir>/<slug>.mdx`    | `public/en/<dir>/<slug>/index.html.md`       |

Pages with `noindex: true` in the frontmatter get no twin.

## Execution Rules

### 1. Creation or Modification

Spawn one subagent per page (`model: "haiku"`) with this prompt, filling in the placeholders:

> Read `skills/llms-markdown-sync/SKILL.md` (sections "Template" and "Rules") and `<source MDX>`.
> If the MDX imports JSON data (e.g. `src/data/experience.en.json`) or uses `<LogoGrid />`, read
> that data file too. Write `<twin path>`. German route for "Related": `<German route>`.
> Do not read any other files.

**Template:**

```md
# <Page title as plain text>

> <frontmatter description, one sentence>

<PageHeader lead as plain Markdown>

## <Heading>

<Section content as plain Markdown>

## Related

- [German version](https://davideiken.de/<German route>/)
- [Site overview](https://davideiken.de/llms.txt)
```

**Rules:**

- H1: use the `PageHeader` `title` (resolve `{frontmatter.title}`), strip `__`/`**` markup.
- Keep **every** H2/H3 of the page (Markdown `##` or HTML `<h2>`/`<h3>`) with its exact wording.
  Only replace `<br />` with a space, `&ndash;`/`--` with `–` and `&nbsp;` with a space.
- Convert HTML to Markdown: `<dl>` → `- **Term:** definition`, `<ul>/<li>` → lists, `<address>`
  → plain lines. Output no HTML or JSX.
- Images and logos: drop them. Keep a `figcaption` as a sentence only if it adds information.
- Component props that carry visible text (e.g. `TerminalWindow` `command`) become content (a
  code block for commands).
- Data-driven lists (timeline): one `### <date> – <title>, <company>` per entry, followed by the
  impact text, in source order.
- `<LogoGrid />`: one comma-separated sentence of **all** `name` values in
  `src/data/brandLogos.ts`, in source order. Count them, none may be missing.
- Omit runtime values that change on their own (e.g. `{pkg.version}`, dates computed in code),
  including the label around them. The twin must not go stale between edits.
- Links: make them absolute (`/en/experience/` → `https://davideiken.de/en/experience/`).
- Do not translate, summarize away or add facts. Keep the English wording of the page.
- German route for "Related": passed in the prompt by the main agent (from `localizedRoutes` in
  `src/i18n/routes.ts`).

### 2. Deletion / Renaming

- Delete or move the twin under `public/en/` to match the new English slug.
- Update the links in `public/llms.txt`.

## Verification

Run `pnpm test`. `src/tests/llms.test.ts` checks that every twin exists, has the H1 + summary
structure, contains every H2 of the English MDX and that `llms.txt` links resolve.
