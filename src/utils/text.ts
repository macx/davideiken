/**
 * Strips common Markdown syntax so frontmatter text can be safely used in
 * plain-text contexts like <title> or <meta> tags, where the raw markup
 * (e.g. "__Bold__") would otherwise show up literally instead of rendering.
 */
export function stripMarkdown(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links
    .replace(/(\*\*|__)(.*?)\1/g, "$2") // bold
    .replace(/(\*|_)(.*?)\1/g, "$2") // italic
    .replace(/~~(.*?)~~/g, "$1") // strikethrough
    .replace(/`([^`]*)`/g, "$1") // inline code
    .trim();
}
