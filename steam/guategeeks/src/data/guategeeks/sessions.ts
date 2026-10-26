import type {Session} from './types';

/** Where the adopted sketches are served from for download. */
export const SKETCHES_BASE = '/arduino/guategeeks/';

/** Upstream wiring diagram and pin table, referenced rather than redrawn. */
export const WIRING_REFERENCE = '/guategeeks/materiales';

// Structural data for the twelve GuateGeeks SMARS experiences — id, number,
// slug, program stage, four-part 60-minute cycle, challenge level, and Arduino
// sketch each session works with. Narrative content (title, question, context,
// concepts, phase text, CNB, standards, evaluation) lives in each session's
// per-locale MDX file under docs/guategeeks/ and is supplied to
// <SessionModule> as compound-component children.
//
// Sessions 1-5 and 12 have no sketch: they cover systems, safety, fabrication,
// mechanical assembly and the final challenge. Sessions 9 and 10 share
// 04_smars_autonomo — first reading it, then running it.
export const sessions: readonly Session[] = [
  {
    id: 's1',
    n: '01',
    slug: 'sistemas-del-robot',
    programStage: 'comprender',
    phaseKinds: ['act', 'exp', 'cre', 'ref'],
    retoLevel: 0,
    recommendedBlocks: 1,
  },
  {
    id: 's2',
    n: '02',
    slug: 'seguridad-y-energia',
    programStage: 'comprender',
    phaseKinds: ['act', 'exp', 'cre', 'ref'],
    retoLevel: 0,
    recommendedBlocks: 1,
  },
  {
    id: 's3',
    n: '03',
    slug: 'slicer-y-tolerancias',
    programStage: 'construir',
    phaseKinds: ['act', 'exp', 'cre', 'ref'],
    retoLevel: 1,
    recommendedBlocks: 2,
  },
  {
    id: 's4',
    n: '04',
    slug: 'impresion-y-control-de-calidad',
    programStage: 'construir',
    phaseKinds: ['act', 'exp', 'cre', 'ref'],
    retoLevel: 1,
    recommendedBlocks: 1,
  },
  {
    id: 's5',
    n: '05',
    slug: 'ensamblaje-de-orugas',
    programStage: 'construir',
    phaseKinds: ['act', 'exp', 'cre', 'ref'],
    retoLevel: 1,
    recommendedBlocks: 2,
  },
  {
    id: 's6',
    n: '06',
    slug: 'botones-y-buzzer',
    programStage: 'programar',
    phaseKinds: ['act', 'exp', 'cre', 'ref'],
    retoLevel: 2,
    recommendedBlocks: 1,
    sketch: {dir: '01_botones_y_buzzer', label: 'Botones y buzzer'},
  },
  {
    id: 's7',
    n: '07',
    slug: 'dos-motores-y-direccion',
    programStage: 'programar',
    phaseKinds: ['act', 'exp', 'cre', 'ref'],
    retoLevel: 2,
    recommendedBlocks: 2,
    sketch: {dir: '02_prueba_motores', label: 'Prueba de motores'},
  },
  {
    id: 's8',
    n: '08',
    slug: 'sensor-ultrasonico',
    programStage: 'programar',
    phaseKinds: ['act', 'exp', 'cre', 'ref'],
    retoLevel: 2,
    recommendedBlocks: 2,
    sketch: {dir: '03_prueba_ultrasonido', label: 'Prueba de ultrasonido'},
  },
  {
    id: 's9',
    n: '09',
    slug: 'lectura-de-codigo',
    programStage: 'integrar',
    phaseKinds: ['act', 'exp', 'cre', 'ref'],
    retoLevel: 3,
    recommendedBlocks: 1,
    sketch: {dir: '04_smars_autonomo', label: 'Curiosity autónomo'},
  },
  {
    id: 's10',
    n: '10',
    slug: 'integracion-autonoma',
    programStage: 'integrar',
    phaseKinds: ['act', 'exp', 'cre', 'ref'],
    retoLevel: 3,
    recommendedBlocks: 2,
    sketch: {dir: '04_smars_autonomo', label: 'Curiosity autónomo'},
  },
  {
    id: 's11',
    n: '11',
    slug: 'calibracion',
    programStage: 'integrar',
    phaseKinds: ['act', 'exp', 'cre', 'ref'],
    retoLevel: 3,
    recommendedBlocks: 2,
    sketch: {dir: '05_asistente_calibracion', label: 'Asistente de calibración'},
  },
  {
    id: 's12',
    n: '12',
    slug: 'reto-integrador',
    programStage: 'integrar',
    phaseKinds: ['act', 'exp', 'cre', 'ref'],
    retoLevel: 4,
    recommendedBlocks: 2,
  },
];

export function getSession(id: string): Session {
  const found = sessions.find((s) => s.id === id);
  if (!found) {
    throw new Error(
      `GuateGeeks: no session with id "${id}". Valid ids: ${sessions.map((s) => s.id).join(', ')}.`,
    );
  }
  return found;
}
