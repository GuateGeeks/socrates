import {modules, getModule, PROGRAMS_BASE, BUILD_GUIDE_BASE} from './modules';

export * from './types';
export * from './standards';
export * from './titles';
export * from './experience';
export * from './types';
export * from './challenges';
export * from './assessment';
export {modules, getModule, PROGRAMS_BASE, BUILD_GUIDE_BASE};

// Import-time integrity check. Runs during SSR/build (and in the browser),
// so a malformed module set fails the build instead of shipping silently.
// Compile-time: the `readonly [PhaseKind, PhaseKind, PhaseKind, PhaseKind]`
// tuple in types.ts already guarantees exactly four phase kinds per module.
export const EXPECTED_MODULE_COUNT = 12;

(function validateModules(): void {
  if (modules.length !== EXPECTED_MODULE_COUNT) {
    throw new Error(
      `CiudadBots: expected ${EXPECTED_MODULE_COUNT} modules, found ${modules.length}.`,
    );
  }
  const seen = new Set<string>();
  for (const m of modules) {
    if (!m.id || seen.has(m.id)) {
      throw new Error(`CiudadBots: invalid or duplicate module id: "${m.id}".`);
    }
    seen.add(m.id);
    if (!m.slug.trim()) {
      throw new Error(`CiudadBots: module "${m.id}" has no slug.`);
    }
    if (m.phaseKinds.length !== 4) {
      throw new Error(
        `CiudadBots: module "${m.id}" must have 4 phase kinds, has ${m.phaseKinds.length}.`,
      );
    }
  }
})();
