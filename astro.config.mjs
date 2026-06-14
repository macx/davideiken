import { defineConfig, fontProviders } from "astro/config";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  i18n: {
    locales: ["en", "de"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Manrope",
      cssVariable: "--ff-copy",
      weights: [400, 500, 700],
      styles: ["normal"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Space Grotesk",
      cssVariable: "--ff-label",
      weights: ["300 700"],
      styles: ["normal"],
    },
  ],
  markdown: {
    shikiConfig: { wrap: true },
    gfm: true,
    smartypants: {
      dashes: true,
      openingQuotes: { double: "„", single: "„" },
      closingQuotes: { double: "“", single: "“" },
      ellipses: true,
      quotes: false,
    },
  },
  integrations: [mdx()],
  experimental: {
    rustCompiler: true,
    queuedRendering: {
      enabled: true,
    },
  },
});
