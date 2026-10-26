import type {GradeId, SessionPlan, SessionKind} from './experience';

export type AssessmentMode = 'required' | 'optional' | 'observation';
export type AssessmentLevel = readonly [string, string, string, string];

export interface AssessmentCriterion {
  id: string;
  title: string;
  evidence: string;
  levels: AssessmentLevel;
}

export interface SessionAssessment {
  grade: GradeId;
  route: SessionKind;
  sessionId: string;
  blockId: string;
  mode: AssessmentMode;
  context: string;
  focus: string;
  criteria: readonly AssessmentCriterion[];
  nextStep: string;
}

const gradeFocus: Record<GradeId, {es: string; en: string}> = {
  '1-basico': {es: 'Reconocer, seguir y explicar con apoyo visual.', en: 'Recognize, follow, and explain with visual support.'},
  '2-basico': {es: 'Medir, comparar y justificar ajustes con datos.', en: 'Measure, compare, and justify adjustments with data.'},
  '3-basico': {es: 'Diseñar, documentar y defender una solución propia.', en: 'Design, document, and defend an original solution.'},
};

const modeFor = (session: SessionPlan): AssessmentMode => session.evaluation === 'required' ? 'required' : session.evaluation === 'optional' ? 'optional' : 'observation';

export function getSessionAssessment(session: SessionPlan, grade: GradeId, blockIndex = 0, isEnglish = false): SessionAssessment {
  const focus = gradeFocus[grade][isEnglish ? 'en' : 'es'];
  const block = session.blocks?.[Math.min(blockIndex, (session.blocks?.length || 1) - 1)] || session.blocks?.[0];
  const open = session.kind === 'open';
  const routeName = open ? (isEnglish ? 'Open challenge' : 'Desafío abierto') : (isEnglish ? 'Guided route' : 'Ruta guiada');
  const criteria = open
    ? (isEnglish ? [
      ['need', 'Problem and scope', 'The team names the people affected, the need, and a criterion that can be checked.'],
      ['design', 'Design decisions', 'The team explains what it changed in the structure or program and why.'],
      ['transfer', 'Iteration and communication', 'The team shows a test, an adjustment, and a clear explanation of the result.'],
    ] : [
      ['need', 'Necesidad y alcance', 'El equipo nombra a quién afecta la necesidad, qué debe resolver y qué límite respetará.'],
      ['design', 'Decisiones de diseño', 'El equipo explica qué cambió en la estructura o el programa y por qué.'],
      ['transfer', 'Iteración y comunicación', 'El equipo muestra una prueba, un ajuste y una explicación clara del resultado.'],
    ])
    : (isEnglish ? [
      ['build', 'Construction and system', 'The team identifies the parts involved and relates the built structure to the task.'],
      ['code', 'Program and behavior', 'The team connects a block, parameter, or sensor reading with the robot behavior.'],
      ['test', 'Test and next step', 'The team describes the result, the main error, and the next useful action.'],
    ] : [
      ['build', 'Construcción y sistema', 'El equipo identifica las partes que intervienen y relaciona la estructura armada con la tarea.'],
      ['code', 'Programa y comportamiento', 'El equipo conecta un bloque, parámetro o lectura de sensor con el comportamiento del robot.'],
      ['test', 'Prueba y siguiente paso', 'El equipo describe el resultado, el error principal y la siguiente acción útil.'],
    ]);
  const guidedBlockLabels = isEnglish ? [
    [['build', 'Parts and task fit', 'Identify the structure and explain how each part supports the mission.'], ['code', 'Sequence intention', 'Point to the blocks that make the robot begin, move, or stop.'], ['test', 'Expected result', 'State what should happen before running the first test.']],
    [['build', 'Build and mechanism', 'Explain how the assembled mechanism transfers movement to the task.'], ['code', 'Program execution', 'Run the sequence and connect a code change to a behavior change.'], ['test', 'First adjustment', 'Record the first error and choose one parameter or part to adjust.']],
    [['build', 'Calibration and precision', 'Check alignment, stability, and the physical conditions that affect the result.'], ['code', 'Control refinement', 'Adjust timing, distance, angle, or sensor logic and explain the choice.'], ['test', 'Result and explanation', 'Compare the result with the criterion and justify the next improvement.']],
  ] : [
    [['build', 'Partes y relación con la tarea', 'Identifica la estructura y explica cómo cada parte apoya la misión.'], ['code', 'Intención de la secuencia', 'Señala los bloques que hacen que el robot inicie, avance o se detenga.'], ['test', 'Resultado esperado', 'Expresa qué debería ocurrir antes de ejecutar la primera prueba.']],
    [['build', 'Armado y mecanismo', 'Explica cómo el mecanismo armado transmite el movimiento a la tarea.'], ['code', 'Ejecución del programa', 'Ejecuta la secuencia y relaciona un cambio de código con un cambio de comportamiento.'], ['test', 'Primer ajuste', 'Registra el primer error y elige un parámetro o pieza para ajustar.']],
    [['build', 'Calibración y precisión', 'Revisa alineación, estabilidad y condiciones físicas que afectan el resultado.'], ['code', 'Refinamiento del control', 'Ajusta tiempo, distancia, ángulo o lógica del sensor y explica la elección.'], ['test', 'Resultado y explicación', 'Compara el resultado con el criterio y justifica la siguiente mejora.']],
  ];
  const openBlockLabels = isEnglish ? [
    [['need', 'Need and user', 'Name who is affected and define the need in a checkable way.'], ['design', 'First concept', 'Sketch a solution and explain the most important design decision.'], ['transfer', 'Success criterion', 'State how the team will know whether the proposed solution helps.']],
    [['need', 'Scope and constraints', 'Set a realistic scope, materials, and constraint for the prototype.'], ['design', 'Prototype decisions', 'Build a first version and connect each change to the need.'], ['transfer', 'Evidence of progress', 'Show a test and explain what it taught the team.']],
    [['need', 'Final problem framing', 'Defend the problem, users, risks, and criteria that guide the final version.'], ['design', 'Iteration and system', 'Explain the system, algorithm, and trade-offs behind the final design.'], ['transfer', 'Impact and next version', 'Defend the result, its limits, and the next experiment or application.']],
  ] : [
    [['need', 'Necesidad y usuario', 'Nombra a quién afecta y define la necesidad de una forma comprobable.'], ['design', 'Primera idea', 'Esboza una solución y explica la decisión de diseño más importante.'], ['transfer', 'Criterio de éxito', 'Expresa cómo sabrá el equipo si la solución propuesta ayuda.']],
    [['need', 'Alcance y restricciones', 'Define un alcance realista, materiales y una restricción para el prototipo.'], ['design', 'Decisiones del prototipo', 'Construye una primera versión y relaciona cada cambio con la necesidad.'], ['transfer', 'Evidencia de avance', 'Muestra una prueba y explica qué aprendió el equipo.']],
    [['need', 'Formulación final del problema', 'Defiende problema, usuarios, riesgos y criterios que guían la versión final.'], ['design', 'Iteración y sistema', 'Explica sistema, algoritmo e intercambios detrás del diseño final.'], ['transfer', 'Impacto y siguiente versión', 'Defiende resultado, límites y el siguiente experimento o aplicación.']],
  ];
  const blockLabels = open ? openBlockLabels : guidedBlockLabels;
  const activeBlockLabels = blockLabels[Math.min(blockIndex, blockLabels.length - 1)];

  const subject = session.title.replace(/^.*?·\s*/, '').replace(/\s+/g, ' ').trim();
  const blockSubject = block?.title ? `${subject} · ${block.title}` : subject;
  const descriptorSets: Record<string, Record<GradeId, AssessmentLevel>> = isEnglish ? {
    build: {
      '1-basico': [`Identifies the parts in ${blockSubject} and explains their roles independently.`, `Names the main parts of ${blockSubject} and follows the visual sequence.`, `Recognizes some parts with visual or teacher support.`, `Does not yet connect the structure to the task.`],
      '2-basico': [`Explains how the mechanism in ${blockSubject} affects precision and stability.`, `Relates the structure to the task and identifies one useful adjustment.`, `Identifies the mechanism but needs help explaining its effect.`, `Does not yet relate the build to the observed result.`],
      '3-basico': [`Justifies a redesign of ${blockSubject} using constraints, function, and local context.`, `Documents the system and explains why its structure serves the need.`, `Presents a partial redesign and needs support to justify it.`, `Does not yet connect design choices with the need.`],
    },
    code: {
      '1-basico': [`Explains how the blocks make ${blockSubject} perform its mission.`, `Follows the base program and identifies the action of key blocks.`, `Runs the program with support and explains only one action.`, `Does not yet connect a block with the robot's behavior.`],
      '2-basico': [`Debugs ${blockSubject} systematically and justifies parameters with test data.`, `Changes a parameter or control block and explains its effect.`, `Changes the program but needs guidance to interpret the effect.`, `Does not yet use the program to explain a result.`],
      '3-basico': [`Defends a modular algorithm for ${blockSubject} and explains its limits and alternatives.`, `Documents the control logic and relates it to the solution's behavior.`, `Documents part of the logic and needs support to defend decisions.`, `Does not yet connect algorithm, system, and purpose.`],
    },
    test: {
      '1-basico': [`Describes a test of ${blockSubject}, names the error, and proposes the next action.`, `Reports what happened and suggests one simple change.`, `Observes the result with support but cannot yet explain the error.`, `Does not yet distinguish the expected result from the observed result.`],
      '2-basico': [`Compares tests of ${blockSubject}, identifies a pattern, and defends the best adjustment.`, `Records two attempts and explains which change improved the result.`, `Records an attempt but needs help comparing the results.`, `Does not yet use evidence to choose the next step.`],
      '3-basico': [`Analyzes ${blockSubject} results against constraints and proposes a transferable next experiment.`, `Documents iterations and justifies the final decision with evidence.`, `Shows changes but leaves the comparison or conclusion incomplete.`, `Does not yet connect tests, constraints, and improvement.`],
    },
    need: {
      '1-basico': ['Names who is affected, what the solution should do, and one limit.', 'Describes the need and defines a simple, achievable goal.', 'Identifies part of the need with guiding questions.', 'Does not yet distinguish the need from the proposed object.'],
      '2-basico': ['Prioritizes the need, criteria, and constraints using evidence.', 'Defines a measurable challenge and explains its relevance.', 'Defines a broad challenge and needs help setting criteria.', 'Does not yet establish a checkable problem.'],
      '3-basico': ['Frames a real Guatemalan need with users, risks, constraints, and impact.', 'Defines a viable challenge with a clear scope and success criteria.', 'Presents a partial framing and needs support to prioritize.', 'Does not yet connect the challenge with affected people.'],
    },
    design: {
      '1-basico': ['Explains the chosen design and how it responds to the need.', 'Builds a first solution and identifies its main decision.', 'Makes a change with support but cannot yet explain why.', 'Does not yet connect the design with the need.'],
      '2-basico': ['Justifies structure and program decisions by comparing alternatives.', 'Explains a design change and the result it was intended to improve.', 'Makes a change but provides limited justification.', 'Does not yet justify a design decision.'],
      '3-basico': ['Defends an original architecture with trade-offs, constraints, and expected impact.', 'Explains the main design decisions and their relationship to the problem.', 'Presents a partial design rationale and needs support.', 'Does not yet connect decisions with constraints or users.'],
    },
    transfer: {
      '1-basico': ['Shows a test, explains what changed, and communicates the result clearly.', 'Presents the prototype and describes one improvement.', 'Communicates with visual support and incomplete evidence.', 'Does not yet communicate the process or result.'],
      '2-basico': ['Uses before-and-after evidence to defend the iteration and its usefulness.', 'Shows a test, adjustment, and measurable improvement.', 'Shows an adjustment but lacks enough evidence to support it.', 'Does not yet show a verifiable improvement.'],
      '3-basico': ['Defends iteration, impact, limits, and the next version with technical clarity.', 'Communicates the solution and supports decisions with organized evidence.', 'Presents the prototype with gaps in evidence or impact.', 'Does not yet defend the solution with evidence.'],
    },
  } : {
    build: {
      '1-basico': [`Identifica las partes de ${blockSubject} y explica su función con autonomía inicial.`, `Nombra las partes principales de ${blockSubject} y sigue la secuencia visual.`, `Reconoce algunas partes con apoyo visual o del docente.`, `Aún no relaciona la estructura con la tarea.`],
      '2-basico': [`Explica cómo el mecanismo de ${blockSubject} afecta la precisión y la estabilidad.`, `Relaciona la estructura con la tarea e identifica un ajuste útil.`, `Identifica el mecanismo, pero necesita ayuda para explicar su efecto.`, `Aún no relaciona el armado con el resultado observado.`],
      '3-basico': [`Justifica un rediseño de ${blockSubject} usando restricciones, función y contexto local.`, `Documenta el sistema y explica por qué su estructura responde a la necesidad.`, `Presenta un rediseño parcial y necesita apoyo para justificarlo.`, `Aún no conecta las decisiones de diseño con la necesidad.`],
    },
    code: {
      '1-basico': [`Explica cómo los bloques hacen que ${blockSubject} cumpla su misión.`, `Sigue el programa base e identifica la acción de los bloques principales.`, `Ejecuta el programa con apoyo y explica solo una acción.`, `Aún no conecta un bloque con el comportamiento del robot.`],
      '2-basico': [`Depura ${blockSubject} sistemáticamente y justifica parámetros con datos de prueba.`, `Cambia un parámetro o bloque de control y explica su efecto.`, `Modifica el programa, pero necesita orientación para interpretar el efecto.`, `Aún no usa el programa para explicar un resultado.`],
      '3-basico': [`Defiende un algoritmo modular para ${blockSubject} y explica sus límites y alternativas.`, `Documenta la lógica de control y la relaciona con el comportamiento de la solución.`, `Documenta parte de la lógica y necesita apoyo para defender decisiones.`, `Aún no conecta algoritmo, sistema y propósito.`],
    },
    test: {
      '1-basico': [`Describe una prueba de ${blockSubject}, nombra el error y propone el siguiente paso.`, `Informa qué ocurrió y sugiere un cambio sencillo.`, `Observa el resultado con apoyo, pero aún no explica el error.`, `Aún no distingue el resultado esperado del observado.`],
      '2-basico': [`Compara pruebas de ${blockSubject}, identifica un patrón y defiende el mejor ajuste.`, `Registra dos intentos y explica qué cambio mejoró el resultado.`, `Registra un intento, pero necesita ayuda para comparar resultados.`, `Aún no usa evidencia para elegir el siguiente paso.`],
      '3-basico': [`Analiza los resultados de ${blockSubject} frente a restricciones y propone un experimento transferible.`, `Documenta iteraciones y justifica la decisión final con evidencia.`, `Muestra cambios, pero deja incompleta la comparación o conclusión.`, `Aún no conecta pruebas, restricciones y mejora.`],
    },
    need: {
      '1-basico': ['Nombra a quién afecta, qué debe hacer la solución y un límite.', 'Describe la necesidad y define una meta sencilla y alcanzable.', 'Identifica parte de la necesidad con preguntas guía.', 'Aún no distingue la necesidad del objeto propuesto.'],
      '2-basico': ['Prioriza necesidad, criterios y restricciones usando evidencia.', 'Define un reto medible y explica su relevancia.', 'Define un reto amplio y necesita ayuda para fijar criterios.', 'Aún no establece un problema comprobable.'],
      '3-basico': ['Formula una necesidad real de Guatemala con usuarios, riesgos, restricciones e impacto.', 'Define un desafío viable con alcance y criterios de éxito claros.', 'Presenta una formulación parcial y necesita apoyo para priorizar.', 'Aún no relaciona el desafío con las personas afectadas.'],
    },
    design: {
      '1-basico': ['Explica el diseño elegido y cómo responde a la necesidad.', 'Construye una primera solución e identifica su decisión principal.', 'Hace un cambio con apoyo, pero aún no explica por qué.', 'Aún no conecta el diseño con la necesidad.'],
      '2-basico': ['Justifica decisiones de estructura y programa comparando alternativas.', 'Explica un cambio de diseño y el resultado que buscaba mejorar.', 'Hace un cambio, pero ofrece una justificación limitada.', 'Aún no justifica una decisión de diseño.'],
      '3-basico': ['Defiende una arquitectura propia con intercambios, restricciones e impacto esperado.', 'Explica las decisiones principales y su relación con el problema.', 'Presenta una justificación parcial y necesita apoyo.', 'Aún no conecta las decisiones con restricciones o usuarios.'],
    },
    transfer: {
      '1-basico': ['Muestra una prueba, explica qué cambió y comunica el resultado con claridad.', 'Presenta el prototipo y describe una mejora.', 'Comunica con apoyo visual y evidencia incompleta.', 'Aún no comunica el proceso ni el resultado.'],
      '2-basico': ['Usa evidencia antes/después para defender la iteración y su utilidad.', 'Muestra prueba, ajuste y una mejora medible.', 'Muestra un ajuste, pero no reúne evidencia suficiente.', 'Aún no muestra una mejora verificable.'],
      '3-basico': ['Defiende iteración, impacto, límites y siguiente versión con claridad técnica.', 'Comunica la solución y sustenta decisiones con evidencia organizada.', 'Presenta el prototipo con vacíos de evidencia o impacto.', 'Aún no defiende la solución con evidencia.'],
    },
  };

  return {
    grade,
    route: session.kind,
    sessionId: session.id,
    blockId: block?.id || `${session.id}-block-1`,
    mode: modeFor(session),
    context: `${routeName} · ${session.title} · ${block?.title || ''}`.replace(/ · $/, ''),
    focus,
    criteria: criteria.map(([id, title, evidence], index) => {
      const [blockId, blockTitle, blockEvidence] = activeBlockLabels[index];
      return {id: blockId, title: blockTitle, evidence: blockEvidence, levels: descriptorSets[id][grade]};
    }),
    nextStep: block?.continuation || session.nextStep,
  };
}
