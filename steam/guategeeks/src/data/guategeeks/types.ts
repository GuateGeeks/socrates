// Typed schema for a GuateGeeks SMARS program session.
// Structural, locale-independent fields only — narrative content (title,
// driving question, context, concepts, phase text, CNB, standards,
// evaluation) is authored per locale in each session's MDX file and supplied
// to the <SessionModule> compound component as children, mirroring how
// CiudadBots handles <Module>.

// The four-phase learning cycle (Activar · Explorar · Crear · Reflexionar) is
// shared pedagogical vocabulary across GuateGeeks programs, not something
// specific to either one. It is imported here as a type-only dependency so the
// two programs cannot drift apart, and so <PhaseTimeline> — which is typed
// against the same union — accepts GuateGeeks phases without modification.
// Type-only imports are erased at compile time, so this creates no runtime
// coupling between the two data layers.
import type {PhaseKind} from '@site/src/data/ciudadbots/types';

export type {PhaseKind};

/**
 * Which general stage of the program a session belongs to. Distinct from
 * `PhaseKind`: that describes the four-part learning cycle inside every
 * 60-minute session.
 */
export type ProgramStage = 'comprender' | 'construir' | 'programar' | 'integrar';

/**
 * Challenge level, rising across the program.
 * 0 documentar · 1 observar · 2 modificar · 3 algoritmos · 4 ingeniería
 */
export type RetoLevel = 0 | 1 | 2 | 3 | 4;

/**
 * Reference to one of the five adopted upstream Arduino sketches. The `dir`
 * doubles as the sketch's folder name under `arduino/guategeeks/` and, per the
 * Arduino IDE's convention, as the `.ino` filename stem.
 */
export interface SketchRef {
  /** Folder and file stem, e.g. "01_botones_y_buzzer". */
  dir: string;
  /** Human label for the resources panel, e.g. "Botones y buzzer". */
  label: string;
}

export interface Session {
  /** Stable id, e.g. "s1" — referenced from MDX as <SessionModule id="s1" />. */
  id: string;
  /** Two-digit number, e.g. "01". */
  n: string;
  /** URL/file slug, e.g. "sistemas-del-robot". */
  slug: string;
  /** Which general stage of the program this session belongs to. */
  programStage: ProgramStage;
  /**
   * Ordered sequence of the four mini-cycle phase kinds, driving accent colour
   * and matching each locale's <SessionModule.Phase> order.
   */
  phaseKinds: readonly [PhaseKind, PhaseKind, PhaseKind, PhaseKind];
  /** Challenge level introduced in this session. */
  retoLevel: RetoLevel;
  /** Suggested number of 60-minute blocks for the experience. */
  recommendedBlocks: number;
  /** The Arduino sketch this session works with, when there is one. */
  sketch?: SketchRef;
}
