// Typed schema for a Tiempo Circular program session.
//
// The shape is deliberately identical to GuateGeeks SMARS's
// (`src/data/guategeeks/types.ts`): both programs are rendered by the same
// <SessionModule>, so both registries must satisfy the same contract. The types
// are re-declared here rather than imported so each program owns its own data
// layer and neither can break the other by editing a shared file — the same
// reasoning that keeps the CiudadBots and GuateGeeks data layers separate.

import type {PhaseKind} from '@site/src/data/ciudadbots/types';

export type {PhaseKind};

/**
 * Which of the program's four macro-phases a session belongs to. Distinct from
 * `PhaseKind`: that describes the mini-cycle *inside* every session, while this
 * groups the twelve sessions into the program's overall arc.
 */
export type ProgramPhase = 'activar' | 'explorar' | 'crear' | 'reflexionar';

/**
 * Challenge level, rising across the program.
 * 0 documentar · 1 observar · 2 modificar · 3 algoritmos · 4 ingeniería
 */
export type RetoLevel = 0 | 1 | 2 | 3 | 4;

/**
 * Reference to one of the six ESP32 sketches written for this program. The
 * `dir` doubles as the sketch's folder name under `arduino/tiempo-circular/`
 * and, per the Arduino IDE's convention, as the `.ino` filename stem.
 */
export interface SketchRef {
  /** Folder and file stem, e.g. "01_pantalla_viva". */
  dir: string;
  /** Human label for the resources panel, e.g. "Pantalla viva". */
  label: string;
}

export interface Session {
  /** Stable id, e.g. "tc1" — referenced from MDX as <SessionModule id="tc1" />. */
  id: string;
  /** Two-digit number, e.g. "01". */
  n: string;
  /** URL/file slug, e.g. "sistemas-de-una-pantalla". */
  slug: string;
  /** Which macro-phase of the program this session belongs to. */
  programPhase: ProgramPhase;
  /**
   * Ordered sequence of the four mini-cycle phase kinds, driving accent colour
   * and matching each locale's <SessionModule.Phase> order.
   */
  phaseKinds: readonly [PhaseKind, PhaseKind, PhaseKind, PhaseKind];
  /** Challenge level introduced in this session. */
  retoLevel: RetoLevel;
  /** The Arduino sketch this session works with, when there is one. */
  sketch?: SketchRef;
}
