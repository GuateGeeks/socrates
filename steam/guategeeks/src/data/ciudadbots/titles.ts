// Minimal locale-keyed module title index. Per-module narrative content
// (including each module's own title) lives in that module's per-locale MDX
// file — but a few surfaces (ProgressTracker, the student view) need every
// module's display name in aggregate, outside that module's own render tree,
// where neither MDX children nor Docusaurus's useDoc() can reach. This is the
// one deliberate exception: title strings only, nothing narrative.

export type Locale = 'es' | 'en';

export const moduleTitles: Record<Locale, Record<string, string>> = {
  es: {
    m1: 'Robot Cartógrafo',
    m2: 'Robot de Entregas',
    m3: 'Montacargas',
    m4: 'Brazo Reparador',
    m5: 'Grúa Torre',
    m6: 'Cargador Compacto',
    m7: 'Brazo Clasificador',
    m8: 'Constructor de Puentes',
    m9: 'Elevador',
    m10: 'Auto Urbano',
    m11: 'Unidad de Rescate',
    m12: 'Rueda de la Fortuna',
  },
  en: {
    m1: 'Mapper Bot',
    m2: 'Delivery Bot',
    m3: 'Forklift',
    m4: 'Repair Arm',
    m5: 'Tower Crane',
    m6: 'Compact Loader',
    m7: 'Sorting Arm',
    m8: 'Bridge Builder',
    m9: 'Elevator',
    m10: 'City Car',
    m11: 'Fire Rescue Unit',
    m12: 'Ferris Wheel',
  },
};

/** Resolve a module's title for a given locale, falling back to `es`. */
export function getModuleTitle(id: string, locale: string): string {
  const table = moduleTitles[locale as Locale] ?? moduleTitles.es;
  return table[id] ?? moduleTitles.es[id] ?? id;
}
