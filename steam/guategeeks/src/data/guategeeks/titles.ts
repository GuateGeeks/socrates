// Minimal locale-keyed session title index, mirroring the CiudadBots pattern.
// Each session's own title lives in its per-locale MDX frontmatter — but a few
// surfaces need every session's display name in aggregate, outside that
// session's own render tree, where neither MDX children nor Docusaurus's
// useDoc() can reach. Title strings only, nothing narrative.
//
// GuateGeeks ships in Spanish only (see design decision D10), so the `en` map
// intentionally carries the Spanish titles: an English-locale visitor sees the
// same names the material uses, rather than invented translations for pages
// that do not exist in English.

export type Locale = 'es' | 'en';

const es: Record<string, string> = {
  s1: 'Conoce tu Robot',
  s2: 'Energía Segura',
  s3: 'Del Diseño a la Pieza',
  s4: 'Piezas que Encajan',
  s5: 'Robot en Movimiento',
  s6: 'Botones y Señales',
  s7: 'Aprender a Girar',
  s8: 'Medir sin Tocar',
  s9: 'Leer el Cerebro del Robot',
  s10: 'Robot Autónomo',
  s11: 'Afinar el Movimiento',
  s12: 'Misión Autónoma',
};

export const sessionTitles: Record<Locale, Record<string, string>> = {
  es,
  en: es,
};

/** Resolve a session's title for a given locale, falling back to `es`. */
export function getSessionTitle(id: string, locale: string): string {
  const table = sessionTitles[locale as Locale] ?? sessionTitles.es;
  return table[id] ?? sessionTitles.es[id] ?? id;
}
