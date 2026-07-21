export const localizedRoutes: Array<{ de: string; en: string }> = [
  { de: "/", en: "/en" },
  { de: "/imprint", en: "/en/imprint" },
  { de: "/engineering", en: "/en/engineering" },
  { de: "/experience", en: "/en/experience" },
  { de: "/datenschutz", en: "/en/privacy" },
  { de: "/datenschutz/kamera", en: "/en/privacy/camera" },
  { de: "/eigentumsnachweis", en: "/en/proof-of-ownership" },
];

export function getAlternates(pathname: string) {
  const normalized =
    pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  return localizedRoutes.find(
    (route) => route.de === normalized || route.en === normalized,
  );
}
