import type {Session} from './types';

/** Where this program's sketches are served from for download. */
export const SKETCHES_BASE = '/arduino/tiempo-circular/';

/** Pin table and wiring reference for this program. */
export const WIRING_REFERENCE = '/tiempo-circular/materiales';

// Structural data for the twelve Tiempo Circular sessions — id, number, slug,
// macro-phase, mini-cycle phase sequence, challenge level, and the ESP32 sketch
// each session works with. Narrative content (title, question, context,
// concepts, phase text, CNB, standards, evaluation) lives in each session's MDX
// file under docs/tiempo-circular/ and is supplied to <SessionModule> as
// compound-component children.
//
// Sessions 1, 2 and 12 have no sketch: they cover what a display is, how to
// power it safely, and the final design challenge. Sessions 5, 6 and 7 share
// 03_geometria_circular, switching the SESION constant inside it; sessions 8
// and 9 share 04_reloj_millis — first building the clock, then measuring how
// much it drifts.
export const sessions: readonly Session[] = [
  {
    id: 'tc1',
    n: '01',
    slug: 'sistemas-de-una-pantalla',
    programPhase: 'activar',
    phaseKinds: ['act', 'exp', 'cre', 'ref'],
    retoLevel: 0,
  },
  {
    id: 'tc2',
    n: '02',
    slug: 'energia-y-conexiones-seguras',
    programPhase: 'activar',
    phaseKinds: ['act', 'exp', 'cre', 'ref'],
    retoLevel: 0,
  },
  {
    id: 'tc3',
    n: '03',
    slug: 'el-primer-pixel',
    programPhase: 'explorar',
    phaseKinds: ['act', 'exp', 'cre', 'ref'],
    retoLevel: 1,
    sketch: {dir: '01_pantalla_viva', label: 'Pantalla viva'},
  },
  {
    id: 'tc4',
    n: '04',
    slug: 'el-color-es-un-numero',
    programPhase: 'explorar',
    phaseKinds: ['act', 'exp', 'cre', 'ref'],
    retoLevel: 1,
    sketch: {dir: '02_color_y_bits', label: 'El color es un número'},
  },
  {
    id: 'tc5',
    n: '05',
    slug: 'la-pantalla-es-un-plano',
    programPhase: 'crear',
    phaseKinds: ['act', 'exp', 'cre', 'ref'],
    retoLevel: 1,
    sketch: {dir: '03_geometria_circular', label: 'Geometría circular'},
  },
  {
    id: 'tc6',
    n: '06',
    slug: 'angulos-notables',
    programPhase: 'crear',
    phaseKinds: ['act', 'exp', 'cre', 'ref'],
    retoLevel: 2,
    sketch: {dir: '03_geometria_circular', label: 'Geometría circular'},
  },
  {
    id: 'tc7',
    n: '07',
    slug: 'seno-y-coseno',
    programPhase: 'crear',
    phaseKinds: ['act', 'exp', 'cre', 'ref'],
    retoLevel: 2,
    sketch: {dir: '03_geometria_circular', label: 'Geometría circular'},
  },
  {
    id: 'tc8',
    n: '08',
    slug: 'el-reloj-que-deriva',
    programPhase: 'crear',
    phaseKinds: ['act', 'exp', 'cre', 'ref'],
    retoLevel: 2,
    sketch: {dir: '04_reloj_millis', label: 'Reloj sobre millis()'},
  },
  {
    id: 'tc9',
    n: '09',
    slug: 'medir-la-deriva',
    programPhase: 'crear',
    phaseKinds: ['act', 'exp', 'cre', 'ref'],
    retoLevel: 3,
    sketch: {dir: '04_reloj_millis', label: 'Reloj sobre millis()'},
  },
  {
    id: 'tc10',
    n: '10',
    slug: 'la-hora-de-la-red',
    programPhase: 'crear',
    phaseKinds: ['act', 'exp', 'cre', 'ref'],
    retoLevel: 3,
    sketch: {dir: '05_reloj_ntp', label: 'Reloj por NTP'},
  },
  {
    id: 'tc11',
    n: '11',
    slug: 'cholqij',
    programPhase: 'crear',
    phaseKinds: ['act', 'exp', 'cre', 'ref'],
    retoLevel: 3,
    sketch: {dir: '06_cholqij', label: "Carátula Cholq'ij"},
  },
  {
    id: 'tc12',
    n: '12',
    slug: 'reto-integrador',
    programPhase: 'reflexionar',
    phaseKinds: ['act', 'exp', 'cre', 'ref'],
    retoLevel: 4,
  },
];

export function getSession(id: string): Session {
  const found = sessions.find((s) => s.id === id);
  if (!found) {
    throw new Error(
      `Tiempo Circular: no session with id "${id}". Valid ids: ${sessions.map((s) => s.id).join(', ')}.`,
    );
  }
  return found;
}
