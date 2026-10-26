// Minimal locale-keyed session title index, mirroring the GuateGeeks SMARS and
// CiudadBots pattern. Each session's own title lives in its MDX frontmatter —
// but a few surfaces need every session's display name in aggregate, outside
// that session's own render tree. Title strings only, nothing narrative.
//
// Tiempo Circular ships in Spanish only (see design decision D10 of the
// tiempo-circular-segundo-basico change), so the `en` map intentionally carries
// the Spanish titles: an English-locale visitor sees the same names the
// material uses, rather than invented translations for pages that do not exist
// in English.

export type Locale = 'es' | 'en';

const es: Record<string, string> = {
  tc1: 'Sistemas de una pantalla',
  tc2: 'Energía y conexiones seguras',
  tc3: 'El primer píxel',
  tc4: 'El color es un número',
  tc5: 'La pantalla es un plano',
  tc6: 'Ángulos notables en la circunferencia',
  tc7: 'Seno y coseno colocan la manecilla',
  tc8: 'El reloj que deriva',
  tc9: 'Medir la deriva',
  tc10: 'La hora que viene de la red',
  tc11: "Cholq'ij: el 13 y el 20 en la carátula",
  tc12: 'Reto integrador: carátula propia',
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
