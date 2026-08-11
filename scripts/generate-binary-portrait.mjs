// One-off build script: samples the portrait photo into a coarse grid and
// re-renders it as an SVG made of "0"/"1" glyphs via ordered (Bayer) dithering.
// Generates two variants because the overlay is drawn in a single theme color
// (currentColor via --clr-text): the "light" variant puts glyphs where the
// photo is dark (dark ink on a light card), the "dark" variant puts glyphs
// where the photo is light (light ink on a dark card) -- so in both themes
// dense glyphs still read as the photo's dark regions, not the inverse.
// Run manually after replacing the source photo: `node scripts/generate-binary-portrait.mjs`
import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, "../src/assets/images/david-portrait-color.jpg");
const OUT_DIR = join(__dirname, "../src/assets/images");

const COLS = 64;
const CHAR_ASPECT = 0.52; // monospace glyph width/height ratio, approximated

// 4x4 Bayer matrix: ordered dithering across the whole frame, so glyph
// density follows the actual grayscale value everywhere (background
// included) instead of a hard silhouette cutoff.
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

function buildSvg({ data, cols, rows, meta, invert }) {
  const cell = 10;
  const lines = [];
  for (let y = 0; y < rows; y++) {
    let line = "";
    for (let x = 0; x < cols; x++) {
      const v = data[y * cols + x];
      const tone = invert ? v / 255 : (255 - v) / 255;
      const threshold = (BAYER[y % 4][x % 4] + 0.5) / 16;
      line += tone > threshold ? (v % 2 === 0 ? "0" : "1") : " ";
    }
    lines.push(line);
  }

  // viewBox must match the source photo's aspect ratio (not rows*cell) so the
  // SVG fills the same box as the <Image> it overlays, with no letterboxing.
  const width = cols * cell;
  const height = width / (meta.width / meta.height);
  const rowHeight = height / rows;
  const fontSize = rowHeight * 0.92;

  const textRows = lines
    .map((line, i) => {
      const y = i * rowHeight + rowHeight * 0.85;
      const escaped = line.replace(/</g, "&lt;").replace(/&/g, "&amp;");
      return `<text x="0" y="${y}" textLength="${width}" lengthAdjust="spacingAndGlyphs" xml:space="preserve">${escaped}</text>`;
    })
    .join("\n    ");

  return {
    svg: `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="presentation" aria-hidden="true" fill="currentColor" font-family="ui-monospace, monospace" font-size="${fontSize}">
    ${textRows}
</svg>
`,
    glyphCount: lines.join("").replace(/ /g, "").length,
  };
}

async function main() {
  const meta = await sharp(SRC).metadata();
  const rows = Math.round(COLS * (meta.height / meta.width) * CHAR_ASPECT);

  const { data } = await sharp(SRC)
    .resize(COLS, rows, { fit: "fill" })
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (const [variant, invert] of [
    ["light", false],
    ["dark", true],
  ]) {
    const { svg, glyphCount } = buildSvg({ data, cols: COLS, rows, meta, invert });
    const out = join(OUT_DIR, `david-portrait-binary-${variant}.svg`);
    await writeFile(out, svg, "utf8");
    console.log(`Wrote ${out} (${COLS}x${rows} grid, ${glyphCount} glyphs)`);
  }
}

main();
