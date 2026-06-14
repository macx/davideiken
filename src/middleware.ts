import { defineMiddleware } from "astro:middleware";
import { getRelativeLocaleUrl } from "astro:i18n";

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname, search } = context.url;

  // Keep localized and non-root routes untouched.
  if (pathname !== "/") {
    return next();
  }

  // Browser language detection provided by Astro i18n.
  const preferred = context.preferredLocale;

  // Default locale is English at root (/). Redirect only for German.
  if (preferred === "de") {
    const target = getRelativeLocaleUrl("de", "");
    return context.redirect(`${target}${search}`);
  }

  return next();
});
