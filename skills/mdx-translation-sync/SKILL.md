---
name: mdx-translation-sync
description: Synchronizes and translates German MDX pages to English based on Astro best practices.
---

# MDX Translation Sync Skill

This skill automates the translation and synchronization of German MDX pages into English.

## Core Principles

This skill strictly follows the [Astro Internationalization Guidelines](https://docs.astro.build/en/guides/internationalization/).

1. **Source of Truth**: The German file located at `src/pages/<slug>.mdx` is ALWAYS the source of truth.
2. **Target Location**: The English translation must be placed at `src/pages/en/<slug>.mdx`.
3. **Efficiency First**: To avoid wasting tokens, perform this sync only as a final step after the German file is fully written or explicitly modified. Do not attempt partial syncing while drafting.

## Execution Rules

When invoked, perform the following steps based on the action taken on the German file:

### 1. Creation or Modification

If an German MDX file has been created or modified:

- **Read** the German source file.
- **Translate** the text content into English. Match the tone and style of the original content.
- **Preserve Components**: DO NOT translate or modify MDX component tags, Astro layout imports, variable names, or logic. Only translate the textual content passed to them.
- **Adjust Paths**: Since the German file is one directory deeper (`src/pages/en/`), you MUST adjust all relative paths for `layout` in the frontmatter and any component imports (e.g., `../components/...` becomes `../../components/...`).
- **Frontmatter**: Translate relevant frontmatter fields (like `title`, `description`, `navTitle`). Preserve all other metadata (`layout`, `navOrder`, etc.) exactly as they are.
- **Write/Update** the corresponding English file.

### 2. Deletion

If an German MDX file is deleted:

- **Delete** the corresponding English MDX file under `src/pages/en/` if it exists.

### 3. Renaming / Moving

If an German MDX file is renamed or its slug changes:

- **Rename/Move** the corresponding English MDX file under `src/pages/en/` to match the new English slug exactly.

## Verification

- Always ensure the translated MDX file is valid and correctly imports the layout.
- Check that no broken links or invalid components were introduced during translation.
