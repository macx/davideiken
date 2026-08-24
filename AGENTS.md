# AI Agent Guide (Single Source of Truth)

This repository uses this file as the central policy for AI coding agents.
If a tool supports its own instruction files (for example Copilot, Cursor, Claude),
those files must reference these rules and must not contradict them.

## 1) Product and Stack Context

- Framework: Astro (v6)
- Language: TypeScript
- Content: Prefer Markdown/MDX for content pages
- Styling: Native CSS with layers, no Tailwind
- Package Manager: pnpm
- Tests: Playwright (local only), Vitest (local & CI)

## 2) Architecture Decisions

- Prefer Markdown/MDX for content pages under `src/pages/**`.
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
- Prefer nested CSS style structure overall.
- Use semantic class names for components, but avoid BEM naming in new styles.
- Use Logical CSS properties (e.g., `margin-block`, `padding-inline`) instead of physical properties (e.g., `margin-top`, `padding-left`) for better internationalization support.
- For Media Queries, always use `em` units instead of `px` (e.g. `@media (min-width: 40em)`).

### Color Roles (Current Design Baseline)

- Default theme: Light and Dark Mode.
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
4. Briefly document what changed and why before any tests or commits. Ask the user for approval of the changes if necessary.
5. Run relevant scripts if behavior is affected, but only if the user has accepted the changes, has no corrections and has agreed to it.
   - `pnpm astro check`
   - `pnpm test` (to run Vitest unit tests when behavior is affected)
   - `pnpm test:e2e` (to run Playwright E2E tests locally when relevant)

## 7) Content Preference

When a new content page is requested:

1. Standard: `src/pages/<slug>.mdx`
2. Only for layout/interactivity: `src/pages/<slug>.astro`
3. Reuse shared visual rules from tokens/layers.

When editing content, write primarily MDX instead of using HTML tags. Only allowed HTML element for semantic address markup is `<address>`; other HTML may be used only when pure Markdown cannot achieve the required semantics (e.g., complex tables, custom embedded media). All structural markup must use MDX headings, lists, etc. Use double "--" for en‑dashes, single "-" for hyphens and single "'" for apostrophes.

## 8) Maintenance of This Guide

- Add new standards here first.
- Keep tool-specific files as thin adapters.
- If conflicts appear, this file always wins.

## 9) MDX Translation Sync

- Any time an German MDX file under `src/pages/` is fully drafted, modified, renamed, or deleted, you MUST trigger the `mdx-translation-sync` skill.
- Read the instructions in `skills/mdx-translation-sync/SKILL.md` to perform the sync.
- To save tokens, do not perform line-by-line translations during drafting. Only execute the sync as a final step when the German file is ready.

## 10) Infrastructure & Deployment

Not derivable from the code alone — established 2026-08-24 while migrating to a CDN and fixing the contact form.

### Hosting

- Origin server: Plesk (Ubuntu/Postfix), reachable at `46.252.196.112`. **Multiple unrelated sites share this IP** (name-based virtual hosting via SNI) — any origin config that bypasses normal DNS (CDN pull zone, ad-hoc SSH/curl tests) must explicitly send `Host: davideiken.de`, or Plesk cannot tell which site to serve.
- DNS is managed at a separate registrar reseller panel (`robot.s-dns.de`, INWX-style "Domain-Robot"), **not** in Plesk itself and **not** at Bunny. It supports `ALIAS` records on the zone apex (not just `CNAME`/`A`).
- Mail is fully migrated to **Fastmail** (MX, SPF, DKIM `fm1-3._domainkey` CNAMEs, DMARC all point there). The Plesk server still runs Postfix but it is legacy — do not assume `mail.davideiken.de` is a live mailbox for any address.

### CDN (Bunny.net)

- Chosen over Cloudflare specifically for GDPR reasons (Bunny is an EU/Slovenian company; only the "Europe & North America" pricing zone is enabled — Europe-only is the deliberate choice for data residency, at no cost difference since that tier bundles both regions).
- Root domain `davideiken.de` points to Bunny via an `ALIAS` record (DNS spec forbids `CNAME` on the apex) → `davideiken-de.b-cdn.net`. Pull Zone ID: `6404584`.
- Origin in the Pull Zone is the raw IP (`46.252.196.112`), with the **Host header** field (not an Edge Rule — the origin settings page has a native "Host header (optional)" field) set to `davideiken.de`, and "Forward Host Header" disabled. This is what makes the shared-IP origin resolve to the right site.
- Cache-Control on HTML is `public, max-age=2592000` (30 days, set by the origin/Astro, respected by Bunny). **Hashed `/_astro/*` assets never need purging** (filename changes with content), but HTML pages keep stable URLs and go stale in the CDN cache after every deploy. CI purges the whole zone via the Bunny API after each deploy (see below) — don't skip this step when touching the deploy workflow.

### `trailingSlash: "always"` (astro.config.mjs)

- Set deliberately to make canonical tags, hreflang, the sitemap, and internal links (`getRelativeLocaleUrl`, `getAlternates` in `src/i18n/routes.ts`) all agree on trailing-slash URLs — a mismatch here caused real Google Search Console "wrong canonical" reports.
- **Consequence for API/action URLs:** any `fetch`/form `action` pointing at a `src/pages/api/*` route must use the trailing-slash form (e.g. `/api/contact/`, not `/api/contact`). Astro 301-redirects the slash-less form, and browsers turn a POST into a GET on a 301 — this silently broke the contact form in production once already. When adding a new POST endpoint, point every caller (components, tests, Playwright route mocks) at the `/…/` URL directly.

### CI/CD (`.github/workflows/ci.yml`)

- Deploys only fire on `v*` tag pushes (i.e. via `pnpm release`), not on every push to `develop`.
- `DEPLOY_HOST` must be the origin **IP**, not the `davideiken.de` domain — since the domain now resolves to Bunny, using the domain here would point SSH/rsync at the CDN instead of the server.
- Deploy order: rsync `dist/` → rsync `node_modules/` → touch `tmp/restart.txt` (Phusion Passenger restart) → purge Bunny cache via `POST https://api.bunny.net/pullzone/6404584/purgeCache` (needs the `BUNNY_API_KEY` secret). If you reorder this, purge must stay **after** the restart, not before.

### Contact form SMTP (`src/pages/api/contact.ts`)

- Sends via Fastmail (`smtp.fastmail.com:465`). **`SMTP_USER` must be the actual Fastmail login address** (`hallo@davideiken.de`), not a domain alias (`noreply@davideiken.de` fails auth even though it's a valid alias/send-as address).
- `SMTP_FROM` (defaults to `SMTP_USER` if unset) controls the visible From address independently of the auth identity, so the mail doesn't have to appear from the same address it's sent to (`CONTACT_EMAIL`).
- All SMTP config is Plesk Node.js app env vars, not `.env` files in the repo. There is no accessible app-level stdout/stderr log in this Plesk setup for debugging — verify SMTP credentials directly via an `openssl s_client` `AUTH LOGIN` handshake against the host/port in question instead of relying on app logs.
