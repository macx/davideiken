# davideiken

Personal website built with Astro, TypeScript, MDX, and custom CSS.

## 🚀 Getting Started

This project uses **pnpm** as the package manager, enabled via corepack.

### Prerequisites

- Node.js 20 or higher
- Corepack enabled: `corepack enable`

### Installation

```bash
# Install dependencies
pnpm install

# Install Playwright browsers (required for tests)
pnpx playwright install chromium
```

### Development

```bash
# Start development server
pnpm dev

# Open http://localhost:4321
```

### Building

The build script runs three steps:

1. TypeScript type checking via `astro check`
2. End-to-end tests via Playwright
3. Production build

```bash
# Build the site (includes TypeScript check and tests)
pnpm build

# Preview the production build
pnpm preview
```

**Note:** CodeQL security analysis runs automatically via GitHub Actions on every push and pull request. See `.github/workflows/codeql.yml` for configuration.

### Testing

```bash
# Run Playwright tests
pnpm test
```

**Note:** Tests require the site to be built first. The test runner automatically starts a preview server from the `dist` folder.

## 🧞 Project Structure

```
/
├── public/          # Static assets
├── src/
│   ├── layouts/     # Layout components
│   ├── pages/       # Page components (.astro, .mdx)
│   └── components/  # Reusable components
├── tests/           # Playwright end-to-end tests
└── dist/           # Build output (generated)
```

## ✨ Features

- 🌓 **Dark/Light Mode** - Toggle with theme persistence
- ♿ **Accessible** - ARIA labels, keyboard navigation
- ⚡ **Fast** - Built with Astro for optimal performance
- 📝 **MDX Support** - Rich content with Markdown and JSX
- 🎨 **Custom CSS** - Native CSS structure with layers
- 🔒 **Type-safe** - Strict TypeScript configuration
- 🧪 **Tested** - Playwright end-to-end tests
- 🔐 **Secure** - CodeQL security scanning via GitHub Actions

## 🌐 Deployment & CDN

Production traffic for `davideiken.de` is served through a **Bunny.net CDN** (EU-only region, chosen for GDPR reasons) in front of the Plesk origin server. A few things that matter for local dev and future changes:

- **Trailing slashes are mandatory.** `astro.config.mjs` sets `trailingSlash: "always"` so canonical tags, hreflang, the sitemap, and internal links all agree. Any `fetch`/form `action` pointing at an `src/pages/api/*` route must use the trailing-slash URL (`/api/contact/`, not `/api/contact`) — the slash-less form gets 301-redirected, which silently turns a POST into a GET in the browser.
- **CDN cache is purged automatically on deploy.** `.github/workflows/ci.yml` calls the Bunny purge API as the last deploy step, since HTML pages are cached for 30 days at the edge and keep the same URL across deploys (unlike the content-hashed `/_astro/*` assets, which never need purging). If you add a new deploy step, keep the purge step last.
- **`DEPLOY_HOST` (GitHub secret) is the origin server IP, not the domain** — `davideiken.de` now resolves to the CDN, so pointing deploy/SSH at the domain would target Bunny instead of the server.
- Deeper infrastructure notes (DNS provider, shared-IP origin config, SMTP setup) live in [AGENTS.md](AGENTS.md#10-infrastructure--deployment).

## 🔒 Security

This project uses GitHub CodeQL for automated security analysis. CodeQL scans run:

- On every push to main and feature branches
- On every pull request
- Weekly on a schedule

Security findings are reported in the GitHub Security tab.

## 📄 License

See [LICENSE](LICENSE) file for details.
