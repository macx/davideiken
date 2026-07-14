import { defineConfig, fontProviders } from "astro/config";
import mdx from "@astrojs/mdx";
import node from "@astrojs/node";
import { satteri } from "@astrojs/markdown-satteri";
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";
import { resolveToEsbuildTarget } from "esbuild-plugin-browserslist";

// Single source of truth: the "browserslist" field in package.json.
const targets = browserslist();
const lightningcssTargets = browserslistToTargets(targets);

// Astro forces Vite's `build.target` to "esnext", which `build.cssTarget`
// would otherwise inherit — leaving CSS minification with no browser info.
// Set it explicitly from the same browserslist config instead.
const cssTarget = resolveToEsbuildTarget(targets);

// https://astro.build/config
export default defineConfig({
  adapter: node({
    mode: "standalone",
  }),
  vite: {
    ssr: {
      noExternal: process.argv.includes("build") ? true : undefined,
    },
    css: {
      devSourcemap: true,
      transformer: "lightningcss",
      lightningcss: {
        targets: lightningcssTargets,
      },
    },
    build: {
      cssTarget,
    },
  },
  security: {
    checkOrigin: false,
  },
  prefetch: {
    defaultStrategy: "viewport",
  },
  i18n: {
    locales: ["en", "de"],
    defaultLocale: "de",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Strichpunkt Sans",
      cssVariable: "--ff-heading",
      weights: [400, 900],
      subsets: ["latin"],
      fallbacks: ["sans-serif"],
      options: {
        experimental: {
          variableAxis: {
            wdth: [["100", "150"]],
          },
        },
      },
    },
    {
      provider: fontProviders.fontsource(),
      name: "Geologica",
      cssVariable: "--ff-copy",
    },
  ],
  markdown: {
    processor: satteri({
      features: {
        smartPunctuation: { dashes: true },
      },
    }),
  },
  integrations: [mdx()],
  // v7 default: JSX-style whitespace handling (collapses line breaks,
  // preserves intentional inline spacing).
  compressHTML: "jsx",
});
