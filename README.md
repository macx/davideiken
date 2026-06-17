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

## 🔒 Security

This project uses GitHub CodeQL for automated security analysis. CodeQL scans run:

- On every push to main and feature branches
- On every pull request
- Weekly on a schedule

Security findings are reported in the GitHub Security tab.

## 📄 License

See [LICENSE](LICENSE) file for details.
