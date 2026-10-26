import {sessions, getSession, SKETCHES_BASE, WIRING_REFERENCE} from './sessions';

export * from './types';
export * from './titles';
export {sessions, getSession, SKETCHES_BASE, WIRING_REFERENCE};

// Import-time integrity check, mirroring the CiudadBots data layer. Runs during
// SSR/build (and in the browser), so a malformed session set fails the build
// instead of shipping silently. Compile-time, the
// `readonly [PhaseKind, PhaseKind, PhaseKind, PhaseKind]` tuple in types.ts
// already guarantees exactly four mini-cycle phases per session.
export const EXPECTED_SESSION_COUNT = 12;

(function validateSessions(): void {
  if (sessions.length !== EXPECTED_SESSION_COUNT) {
    throw new Error(
      `GuateGeeks: expected ${EXPECTED_SESSION_COUNT} sessions, found ${sessions.length}.`,
    );
  }

  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();

  for (const [i, s] of sessions.entries()) {
    if (!s.id || seenIds.has(s.id)) {
      throw new Error(`GuateGeeks: invalid or duplicate session id: "${s.id}".`);
    }
    seenIds.add(s.id);

    if (!s.slug.trim()) {
      throw new Error(`GuateGeeks: session "${s.id}" has no slug.`);
    }
    if (seenSlugs.has(s.slug)) {
      throw new Error(`GuateGeeks: duplicate session slug: "${s.slug}".`);
    }
    seenSlugs.add(s.slug);

    if (s.phaseKinds.length !== 4) {
      throw new Error(
        `GuateGeeks: session "${s.id}" must have 4 phase kinds, has ${s.phaseKinds.length}.`,
      );
    }

    // Sessions are declared in program order, so the two-digit number must
    // match the position. Catches a session inserted or reordered by mistake.
    const expectedN = String(i + 1).padStart(2, '0');
    if (s.n !== expectedN) {
      throw new Error(
        `GuateGeeks: session "${s.id}" is at position ${i + 1} but is numbered "${s.n}".`,
      );
    }
  }

  // Challenge levels rise across the program; they may repeat, never regress.
  for (let i = 1; i < sessions.length; i++) {
    if (sessions[i].retoLevel < sessions[i - 1].retoLevel) {
      throw new Error(
        `GuateGeeks: reto level regresses from session "${sessions[i - 1].id}" ` +
          `(${sessions[i - 1].retoLevel}) to "${sessions[i].id}" (${sessions[i].retoLevel}).`,
      );
    }
  }
})();
