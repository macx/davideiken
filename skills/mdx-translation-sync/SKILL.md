---
name: mdx-translation-sync
description: Synchronizes and translates English MDX pages to German based on Astro best practices.
---

# MDX Translation Sync Skill

This skill automates the translation and synchronization of English MDX pages into German. 

## Core Principles

This skill strictly follows the [Astro Internationalization Guidelines](https://docs.astro.build/en/guides/internationalization/).

1. **Source of Truth**: The English file located at `src/pages/<slug>.mdx` is ALWAYS the source of truth.
2. **Target Location**: The German translation must be placed at `src/pages/de/<slug>.mdx`.
3. **Efficiency First**: To avoid wasting tokens, perform this sync only as a final step after the English file is fully written or explicitly modified. Do not attempt partial syncing while drafting.

## Execution Rules

When invoked, perform the following steps based on the action taken on the English file:

### 1. Creation or Modification
If an English MDX file has been created or modified:
- **Read** the English source file.
- **Translate** the text content into German. Match the tone and style of the original content.
- **Preserve Components**: DO NOT translate or modify MDX component tags, Astro layout imports, variable names, or logic. Only translate the textual content passed to them.
- **Adjust Paths**: Since the German file is one directory deeper (`src/pages/de/`), you MUST adjust all relative paths for `layout` in the frontmatter and any component imports (e.g., `../components/...` becomes `../../components/...`).
- **Frontmatter**: Translate relevant frontmatter fields (like `title`, `description`, `navTitle`). Preserve all other metadata (`layout`, `navOrder`, etc.) exactly as they are.
- **Write/Update** the corresponding German file.

### 2. Deletion
If an English MDX file is deleted:
- **Delete** the corresponding German MDX file under `src/pages/de/` if it exists.

### 3. Renaming / Moving
If an English MDX file is renamed or its slug changes:
- **Rename/Move** the corresponding German MDX file under `src/pages/de/` to match the new English slug exactly.

## Verification
- Always ensure the translated MDX file is valid and correctly imports the layout.
- Check that no broken links or invalid components were introduced during translation.
