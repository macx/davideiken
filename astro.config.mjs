import { defineConfig, fontProviders } from "astro/config";
import mdx from "@astrojs/mdx";
import node from "@astrojs/node";
import { satteri } from "@astrojs/markdown-satteri";
import remarkSmartypants from "remark-smartypants";

// https://astro.build/config
export default defineConfig({
  adapter: node({
    mode: "standalone",
  }),
  vite: {
    ssr: {
      noExternal: process.argv.includes("build") ? true : undefined,
    },
  },
  security: {
    checkOrigin: false,
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
        smartPunctuation: true,
      },
    }),
    smartypants: false,
    remarkPlugins: [
      [remarkSmartypants, { dashes: "oldschool" }],
    ],
    shikiConfig: { wrap: true },
  },
  integrations: [mdx()],
  experimental: {
    rustCompiler: true,
  },
});
