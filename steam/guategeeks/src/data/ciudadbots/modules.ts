import type {Module, SessionComplexity, SessionRouteRef} from './types';

// Base URLs for CiudadBots static assets (served from static/assets/ciudadbots/).
export const PROGRAMS_BASE = '/assets/ciudadbots/programs/';
export const BUILD_GUIDE_BASE = '/assets/ciudadbots/build-guides/';

// Structural data for the 12 CiudadBots modules — id, number, slug, session
// range, downloadable program filename, phase-kind sequence, and optional
// build-guide metadata. Narrative content (title, question, context,
// concepts, phase text, CNB, standards, evaluation) lives in each module's
// per-locale MDX file (docs/ for es, i18n/en/docusaurus-plugin-content-docs/
// current/ for en) and is supplied to <Module> as compound-component
// children. See openspec design for `neutralize-module-names-i18n`.
const baseModules: readonly Omit<Module, 'guidedSessions' | 'openSessions'>[] = [
  {
    id: 'm1',
    n: '01',
    slug: 'robot-cartografo',
    sessions: '2-3',
    program: '01-robot-cartografo.llsp',
    phaseKinds: ['act', 'exp', 'cre', 'ref'],
    guide: {pages: 47, imageBase: `${BUILD_GUIDE_BASE}1_Cartografo/`, imageExtension: 'png', pdf: `${BUILD_GUIDE_BASE}PDFS/1-robot-cartografo-guia-construccion.pdf`, pageDigits: 0, version: '2026-08-25'},
    finalVisual: {src: '/assets/ciudadbots/final-visuals/m1-robot-cartografo.png', version: '2026-08-26'},
  },
  {
    id: 'm2',
    n: '02',
    slug: 'robot-de-entregas',
    sessions: '2-3',
    program: '02-robot-de-entregas.llsp',
    phaseKinds: ['act', 'exp', 'cre', 'ref'],
    guide: {pages: 54, imageBase: `${BUILD_GUIDE_BASE}2_Entregas/`, imageExtension: 'png', pdf: `${BUILD_GUIDE_BASE}PDFS/2-robot-de-entregas-guia-construccion.pdf`, pageDigits: 0, version: '2026-08-25'},
    finalVisual: {src: '/assets/ciudadbots/final-visuals/m2-robot-de-entregas.png', version: '2026-08-26'},
  },
  {
    id: 'm3',
    n: '03',
    slug: 'montacargas',
    sessions: '2-3',
    program: '03-montacargas.llsp',
    phaseKinds: ['act', 'exp', 'cre', 'ref'],
    guide: {pages: 62, imageBase: `${BUILD_GUIDE_BASE}3_Montacargas/`, imageExtension: 'png', pdf: `${BUILD_GUIDE_BASE}PDFS/3-montacargas-guia-construccion.pdf`, pageDigits: 0, version: '2026-08-25'},
    finalVisual: {src: '/assets/ciudadbots/final-visuals/m3-montacargas.png', version: '2026-08-26'},
  },
  {
    id: 'm4',
    n: '04',
    slug: 'brazo-reparador',
    sessions: '2-3',
    program: '04-brazo-reparador.llsp',
    phaseKinds: ['act', 'exp', 'cre', 'ref'],
    guide: {pages: 75, imageBase: `${BUILD_GUIDE_BASE}4_Brazoreparador/`, imageExtension: 'png', pdf: `${BUILD_GUIDE_BASE}PDFS/4-brazo-reparador-guia-construccion.pdf`, pageDigits: 0, version: '2026-08-25'},
    finalVisual: {src: '/assets/ciudadbots/final-visuals/m4-brazo-reparador.png', version: '2026-08-26'},
  },
  {
    id: 'm5',
    n: '05',
    slug: 'grua-torre',
    sessions: '2-4',
    program: '05-grua-torre.llsp',
    phaseKinds: ['act', 'exp', 'cre', 'ref'],
    guide: {pages: 70, imageBase: `${BUILD_GUIDE_BASE}5_GruaTorre/`, imageExtension: 'png', pdf: `${BUILD_GUIDE_BASE}PDFS/5-grua-torre-guia-construccion.pdf`, pageDigits: 0, version: '2026-08-25'},
    finalVisual: {src: '/assets/ciudadbots/final-visuals/m5-grua-torre.png', version: '2026-08-26'},
  },
  {
    id: 'm6',
    n: '06',
    slug: 'cargador-compacto',
    sessions: '2-3',
    program: '06-cargador-compacto.llsp',
    phaseKinds: ['act', 'exp', 'cre', 'ref'],
    guide: {pages: 44, imageBase: `${BUILD_GUIDE_BASE}6_CargadorCompacto/`, imageExtension: 'png', pdf: `${BUILD_GUIDE_BASE}PDFS/6-cargador-compacto-guia-construccion.pdf`, pageDigits: 0, version: '2026-08-25'},
    finalVisual: {src: '/assets/ciudadbots/final-visuals/m6-cargador-compacto.png', version: '2026-08-26'},
  },
  {
    id: 'm7',
    n: '07',
    slug: 'brazo-clasificador',
    sessions: '3-4',
    program: '07-brazo-clasificador.llsp',
    phaseKinds: ['act', 'exp', 'cre', 'ref'],
    guide: {pages: 56, imageBase: `${BUILD_GUIDE_BASE}7_BrazoClasificador/`, imageExtension: 'png', pdf: `${BUILD_GUIDE_BASE}PDFS/7-brazo-clasificador-guia-construccion.pdf`, pageDigits: 0, version: '2026-08-25'},
    finalVisual: {src: '/assets/ciudadbots/final-visuals/m7-brazo-clasificador.png', version: '2026-08-26'},
  },
  {
    id: 'm8',
    n: '08',
    slug: 'constructor-de-puentes',
    sessions: '2-4',
    program: '08-constructor-de-puentes.llsp',
    phaseKinds: ['act', 'exp', 'cre', 'ref'],
    guide: {pages: 54, imageBase: `${BUILD_GUIDE_BASE}8_ConstructorPuentes/`, imageExtension: 'png', pdf: `${BUILD_GUIDE_BASE}PDFS/8-constructor-de-puentes-guia-construccion.pdf`, pageDigits: 0, version: '2026-08-25'},
    finalVisual: {src: '/assets/ciudadbots/final-visuals/m8-constructor-de-puentes.png', version: '2026-08-26'},
  },
  {
    id: 'm9',
    n: '09',
    slug: 'elevator',
    sessions: '3-4',
    program: '09-elevator.llsp',
    phaseKinds: ['act', 'exp', 'cre', 'ref'],
    finalVisual: {src: '/assets/ciudadbots/final-visuals/m9-elevador.png', version: '2026-08-26'},
  },
  {
    id: 'm10',
    n: '10',
    slug: 'city-car',
    sessions: '2-4',
    program: '10-city-car.llsp',
    phaseKinds: ['act', 'exp', 'cre', 'ref'],
    finalVisual: {src: '/assets/ciudadbots/final-visuals/m10-auto-urbano.png', version: '2026-08-26'},
  },
  {
    id: 'm11',
    n: '11',
    slug: 'fire-rescue-unit',
    sessions: '2-4',
    program: '11-fire-rescue-unit.llsp',
    phaseKinds: ['act', 'exp', 'cre', 'ref'],
    finalVisual: {src: '/assets/ciudadbots/final-visuals/m11-unidad-de-rescate.png', version: '2026-08-26'},
  },
  {
    id: 'm12',
    n: '12',
    slug: 'ferris-wheel',
    sessions: '2-3',
    program: '12-ferris-wheel.llsp',
    phaseKinds: ['act', 'exp', 'cre', 'ref'],
    finalVisual: {src: '/assets/ciudadbots/final-visuals/m12-rueda-de-la-fortuna.png', version: '2026-08-26'},
  },
];

const openBlockCounts: Record<string, number> = {
  m1: 1, m2: 1, m3: 2, m4: 2, m5: 2, m6: 2,
  m7: 2, m8: 3, m9: 3, m10: 3, m11: 3, m12: 3,
};

function routeRefs(moduleId: string, kind: 'guided' | 'open'): SessionRouteRef[] {
  if (kind === 'open') {
    const suggestedBlocks = openBlockCounts[moduleId] || 1;
    return [{id: `open-${moduleId}`, kind, order: 1, duration: `${suggestedBlocks} × 60 min`, complexity: suggestedBlocks === 1 ? 'ajuste' : suggestedBlocks === 2 ? 'restriccion' : 'integracion', suggestedBlocks}];
  }
  return ['base', 'ajuste', 'integracion'].map((complexity, index) => ({
    id: `${kind}-${moduleId}-s${index + 1}`,
    kind,
    order: index + 1,
    duration: index === 0 ? '60 min' : '60 min + continuidad',
    complexity: complexity as SessionComplexity,
    suggestedBlocks: index === 0 ? 1 : 2,
  }));
}

export const modules: readonly Module[] = baseModules.map((module) => ({
  ...module,
  guidedSessions: routeRefs(module.id, 'guided'),
  openSessions: routeRefs(module.id, 'open'),
}));

/** Lookup a module by its id (e.g. "m1"). Throws if not found. */
export function getModule(id: string): Module {
  const found = modules.find((m) => m.id === id);
  if (!found) {
    throw new Error(`CiudadBots: no module with id "${id}".`);
  }
  return found;
}
