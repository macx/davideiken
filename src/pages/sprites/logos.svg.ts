import type { APIRoute } from "astro";
import { brandLogos, logoSymbolId } from "../../data/brandLogos";

const rawLogos = import.meta.glob<string>("../../assets/images/brands/*.svg", {
  query: "?raw",
  import: "default",
  eager: true,
});

// Each source SVG is a single optimized `<svg ...>...</svg>` (viewBox +
// fill="currentColor" for light/dark theming). Renaming the root tag to
// `<symbol>` keeps every attribute and path untouched so we don't disturb
// that optimization — it just lets multiple logos live in one cacheable file.
const symbols = brandLogos
  .map(({ file }) => {
    const raw = rawLogos[`../../assets/images/brands/${file}`];
    if (!raw) return "";
    const id = logoSymbolId(file);
    return raw
      .replace(/^<svg/, `<symbol id="${id}"`)
      .replace(/<\/svg>\s*$/, "</symbol>");
  })
  .join("");

const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">${symbols}</svg>`;

export const GET: APIRoute = () => {
  return new Response(sprite, {
    headers: { "Content-Type": "image/svg+xml" },
  });
};
