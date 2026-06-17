# AI Agent Guide (Single Source of Truth)

This repository uses this file as the central policy for AI coding agents.
If a tool supports its own instruction files (for example Copilot, Cursor, Claude),
those files must reference these rules and must not contradict them.

## 1) Product and Stack Context

- Framework: Astro (v6)
- Language: TypeScript
- Content: Prefer MDX for content pages
- Styling: Native CSS with layers, no Tailwind
- Package Manager: pnpm
- Tests: Playwright (local only), Vitest (local & CI)

## 2) Architecture Decisions

- Prefer MDX for content pages under `src/pages/**`.
- Use `*.astro` primarily for layout, structure, and composition.
- For editorial content: MDX first, Astro only when truly necessary.
- Preserve the current project structure; avoid unnecessary rewrites.

## 3) CSS Conventions

- Entry point: `src/styles/main.css`
- Layers: `base`, `components` (optional later: `utilities`)
- Tokens live in `src/styles/base/variables.css`
- Prefix conventions:
  - Colors: `--clr-*`
  - Font family: `--ff-*`
  - Spacing: `--sp`, `--sp-*`
- Keep the reset minimal-modern (no heavy legacy reset).
- Do not introduce Tailwind utilities.
- For component-specific styles (for example header/navigation), define styles in the component `*.astro` file via `<style>` so they stay scoped.
- Prefer nested CSS style structure for component styles.
- Avoid BEM naming in new styles.
- For Media Queries, always use `em` units instead of `px` (e.g. `@media (min-width: 40em)`).

### Color Roles (Current Design Baseline)

- Default theme: dark-first only, no light theme unless explicitly requested.
- Source of truth for color values: `src/styles/base/variables.css`.
- Agents must reference colors via `--clr-*` tokens only (no hardcoded color values in new code).
- Background (Deep): `--clr-bg`
- Surface (Card): `--clr-surface` (For sections and card backgrounds.)
- Primary (Indigo): `--clr-primary` (Accent color for CTAs and highlights.)
- Secondary (Cyan): `--clr-secondary` (Technical contrast color for metrics.)
- Tertiary (Rose): `--clr-tertiary`
- Text (Primary): `--clr-text`
- Text (Muted): `--clr-text-muted` (Soft violet-gray for technical details.)
- Build tonal steps from core colors with semantic tokens (`-weak`, base, `-strong`, `-deep`).

## 4) Code and File Rules

- Prefer small, focused changes over large refactors.
- Do not add new dependencies without clear value.
- Never commit secrets or credentials.
- Add comments only when they add real value.
- Respect existing formatting (Prettier for Astro/MDX).

## 5) Collaboration and Language Preferences

- The user may ask questions in German.
- Prefer answering the user in German.
- For minimal, non-invasive changes: implement directly.
- For larger or potentially invasive changes: propose first and ask for confirmation.

## 6) Execution Rules for Agents

For each task, follow this order:

1. Read existing files before editing.
2. Choose the minimal solution path.
3. **Always use the current official documentation** for the installed package versions (see Section 1). Never rely on memorized API patterns that may be outdated. If uncertain whether an API still exists, verify against the docs before using it.
   - Astro v6 docs: https://docs.astro.build
   - Known breaking changes to watch for: `Astro.glob` was removed in Astro v5 → use `import.meta.glob` instead.
4. Run relevant scripts if behavior is affected:
   - `pnpm astro check`
   - `pnpm test` (to run Vitest unit tests when behavior is affected)
   - `pnpm test:e2e` (to run Playwright E2E tests locally when relevant)
5. Briefly document what changed and why.

## 7) Content Preference

When a new content page is requested:

1. Standard: `src/pages/<slug>.mdx`
2. Only for layout/interactivity: `src/pages/<slug>.astro`
3. Reuse shared visual rules from tokens/layers.

When editing content, write primarily MDX instead of using HTML tags. Use double "--" for en-dashes, single "-" for hyphens and single "'" for apostrophes.

## 8) Maintenance of This Guide

- Add new standards here first.
- Keep tool-specific files as thin adapters.
- If conflicts appear, this file always wins.

## 9) MDX Translation Sync

- Any time an German MDX file under `src/pages/` is fully drafted, modified, renamed, or deleted, you MUST trigger the `mdx-translation-sync` skill.
- Read the instructions in `skills/mdx-translation-sync/SKILL.md` to perform the sync.
- To save tokens, do not perform line-by-line translations during drafting. Only execute the sync as a final step when the German file is ready.
