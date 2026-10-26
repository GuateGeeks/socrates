import type {GradeId} from './experience';

export interface GradeChallengeVariant {
  grade: GradeId;
  level: 'acompanado' | 'analitico' | 'autonomo';
  studentAction: string;
  teacherSupport: string;
  evidence: string;
}

export interface TransferChallenge {
  id: string;
  moduleId: string;
  title: string;
  context: string;
  question: string;
  concepts: readonly string[];
  constraints: readonly string[];
  successCriteria: readonly string[];
  teacherPrompts: readonly string[];
  evidence: readonly string[];
  cnb: readonly string[];
  indicators: readonly string[];
  standards: readonly string[];
  notApplicable: readonly string[];
  variants: readonly GradeChallengeVariant[];
}

export interface CapstoneMilestone {
  id: 'define' | 'prototype' | 'present';
  order: number;
  title: string;
  purpose: string;
  activities: readonly string[];
  evidence: readonly string[];
  nextStep: string;
}

export interface CapstoneGradeExpectation {
  grade: GradeId;
  focus: string;
  teacherSupport: string;
  evidence: string;
  indicators: readonly string[];
}

export interface AutonomousCapstone {
  title: string;
  description: string;
  problemContexts: readonly string[];
  milestones: readonly CapstoneMilestone[];
  expectations: readonly CapstoneGradeExpectation[];
  cnb: readonly string[];
  standards: readonly string[];
}

const gradeVariants: readonly GradeChallengeVariant[] = [
  {
    grade: '1-basico', level: 'acompanado',
    studentAction: 'Modifica una condición del modelo y explica qué cambió.',
    teacherSupport: 'Ofrezca una variable a la vez, una demostración corta y una lista visual de pasos.',
    evidence: 'Robot funcional, cambio visible y explicación oral o con dibujo.',
  },
  {
    grade: '2-basico', level: 'analitico',
    studentAction: 'Mide dos intentos, compara resultados y justifica un ajuste.',
    teacherSupport: 'Pida una meta numérica, una tabla de pruebas y una conclusión antes de cambiar otra variable.',
    evidence: 'Tabla con intentos, error, ajuste y mejora observable.',
  },
  {
    grade: '3-basico', level: 'autonomo',
    studentAction: 'Rediseña una parte de la solución bajo una restricción y defiende la decisión.',
    teacherSupport: 'Solicite problema, usuario, criterio de éxito, diagrama y revisión de seguridad.',
    evidence: 'Prototipo mejorado, algoritmo documentado y presentación técnica breve.',
  },
];

const topics: readonly [string, string, string, string][] = [
  ['m1', 'Mapa vivo de mi comunidad', 'Una ruta segura y accesible para conectar la escuela con un servicio importante.', 'planos, distancia, giros y secuencias'],
  ['m2', 'Entrega que sí llega', 'Un sistema para llevar agua, medicinas o útiles a un punto de la comunidad sin perder la ruta.', 'rutas, carga, decisiones y código'],
  ['m3', 'Mercado que se organiza', 'Una máquina que mueve productos con seguridad en un mercado o bodega escolar.', 'carga, precisión y maniobra'],
  ['m4', 'Agua que necesita reparación', 'Una herramienta para apoyar la revisión de una tubería o infraestructura comunitaria.', 'color, manipulación y control'],
  ['m5', 'Construcción segura', 'Una solución que mueve materiales en una obra sin poner en riesgo a las personas.', 'poleas, fuerza y control'],
  ['m6', 'Calles que cambian', 'Un vehículo que se adapta a una ruta con diferentes giros y condiciones.', 'dirección, giroscopio y calibración'],
  ['m7', 'Clasificar para ayudar', 'Un sistema que separa materiales para reutilización en la escuela o comunidad.', 'color, posiciones y subrutinas'],
  ['m8', 'Conectar territorios', 'Una estructura que ayuda a imaginar el paso seguro entre dos zonas separadas.', 'infraestructura, estabilidad y precisión'],
  ['m9', 'Acceso para todos', 'Un sistema que ayuda a mover materiales entre distintos niveles de un edificio.', 'variables, pisos y seguridad'],
  ['m10', 'Movilidad en la ciudad', 'Un vehículo que encuentra una ruta y respeta señales de un entorno urbano.', 'orientación, color y rutas'],
  ['m11', 'Respuesta ante emergencias', 'Una solución que apoya la búsqueda o entrega de ayuda después de una emergencia.', 'sensores, búsqueda y rescate'],
  ['m12', 'Feria de la comunidad', 'Una experiencia que comunica información o servicios mediante movimiento y control.', 'velocidad, variables y comunicación'],
];

export const transferChallenges: readonly TransferChallenge[] = topics.map(([moduleId, title, context, conceptText], index) => {
  const isMapper = moduleId === 'm1';
  const variants = isMapper ? [
    {...gradeVariants[0], studentAction: 'Dibuja una ruta entre la escuela y un punto importante, modificando una distancia o un giro.', evidence: 'Ruta dibujada, robot funcional y explicación sencilla del cambio.'},
    {...gradeVariants[1], studentAction: 'Compara dos rutas hacia un centro de salud o punto de abastecimiento de agua y mide cuál es más precisa.', evidence: 'Dos rutas, tabla de pruebas y justificación del ajuste elegido.'},
    {...gradeVariants[2], studentAction: 'Diseña una ruta accesible y segura considerando obstáculos, distancia, giros y eficiencia.', evidence: 'Prototipo rediseñado, programa documentado y defensa de la ruta.'},
  ] : gradeVariants;
  return {
    id: `challenge-${moduleId}`,
    moduleId,
    title,
    context,
    question: isMapper ? '¿Cómo puede un robot ayudar a mejorar una ruta de nuestra comunidad?' : `¿Cómo puede el equipo usar ${conceptText} para responder a una necesidad cercana?`,
    concepts: conceptText.split(', '),
    constraints: ['El equipo debe definir un criterio de éxito antes de probar.', 'La solución debe ser segura para las personas y el material.', 'El equipo debe registrar al menos un cambio y su resultado.'],
    successCriteria: ['La solución responde al problema definido.', 'El equipo puede explicar qué decisión tomó y por qué.', 'Existe evidencia de prueba, ajuste y siguiente mejora.'],
    teacherPrompts: ['¿Quién usaría esta solución?', '¿Qué debe ocurrir para decir que funciona?', '¿Qué variable pueden cambiar sin cambiar todo el diseño?', '¿Qué evidencia respalda su decisión?'],
    evidence: ['Boceto o diagrama del cambio.', 'Registro de una prueba y una iteración.', 'Explicación del equipo con vocabulario técnico.'],
    cnb: ['Matemática: medición, representación, patrones y resolución de problemas.', 'Ciencias Naturales: sistemas, movimiento, fuerza y seguridad.', 'TAC: creación, documentación y colaboración tecnológica.'],
    indicators: ['Define un criterio de éxito relacionado con el problema.', 'Prueba, registra y comunica una mejora observable.', 'Relaciona estructura, programación y resultado.'],
    standards: ['ISTE: diseñador innovador y pensador computacional.', 'CSTA: algoritmos, programación, sistemas y depuración.', 'NGSS MS-ETS1: criterios, pruebas y optimización.'],
    notApplicable: ['Modelo único de construcción y programa terminado: no aplican al desafío abierto.'],
    variants,
  } satisfies TransferChallenge;
});

export const autonomousCapstone: AutonomousCapstone = {
  title: 'Desafío final · Tecnología para mi comunidad',
  description: 'Integre lo aprendido para diseñar una respuesta tecnológica a una problemática de Guatemala. No existe un robot, una guía de armado ni un programa correcto predeterminado.',
  problemContexts: ['Rutas seguras durante lluvias o derrumbes.', 'Distribución de agua, medicinas o materiales.', 'Accesibilidad en espacios escolares o comunitarios.', 'Clasificación y aprovechamiento de residuos.', 'Respuesta y comunicación ante emergencias.'],
  milestones: [
    {id: 'define', order: 1, title: 'Investigar y diseñar', purpose: 'Convertir una necesidad cercana en un reto técnico posible.', activities: ['Elegir una problemática y las personas involucradas.', 'Definir alcance, restricciones y criterio de éxito.', 'Elaborar boceto, diagrama o pseudocódigo.'], evidence: ['Problema y usuario definidos.', 'Boceto o diagrama.', 'Criterios de éxito acordados.'], nextStep: 'Seleccionar materiales y construir una primera versión.'},
    {id: 'prototype', order: 2, title: 'Construir y mejorar', purpose: 'Prototipar, programar, probar e iterar con evidencia.', activities: ['Construir o modificar la solución.', 'Ejecutar pruebas y registrar errores.', 'Aplicar al menos un cambio justificado.'], evidence: ['Prototipo funcional o prueba demostrable.', 'Registro de intentos y ajustes.', 'Programa, algoritmo o lógica explicada.'], nextStep: 'Preparar la demostración y organizar la historia del proyecto.'},
    {id: 'present', order: 3, title: 'Presentar y defender', purpose: 'Comunicar el valor, las limitaciones y las decisiones de diseño.', activities: ['Mostrar el problema y la solución.', 'Presentar pruebas, cambios y resultados.', 'Responder preguntas y proponer una mejora futura.'], evidence: ['Presentación técnica.', 'Evidencia de iteración.', 'Limitación y siguiente mejora identificadas.'], nextStep: 'Cerrar la bitácora y reflexionar sobre el aprendizaje.'},
  ],
  expectations: [
    {grade: '1-basico', focus: 'Construye una solución acotada y explica cómo responde al reto.', teacherSupport: 'Ofrezca dos o tres opciones de materiales y ayude a dividir el reto en pasos.', evidence: 'Prototipo funcional, dibujo del proceso y explicación oral sencilla.', indicators: ['Define una necesidad con apoyo.', 'Sigue una secuencia y explica el resultado.']},
    {grade: '2-basico', focus: 'Mide, compara y depura una solución a partir de pruebas.', teacherSupport: 'Pida variables, tabla de intentos y una conclusión basada en datos.', evidence: 'Tabla comparativa, programa ajustado y justificación del cambio.', indicators: ['Interpreta datos de prueba.', 'Relaciona ajuste, evidencia y mejora.']},
    {grade: '3-basico', focus: 'Diseña, documenta, optimiza y defiende una solución pertinente.', teacherSupport: 'Revise usuario, restricciones, seguridad, algoritmo y evidencia de impacto.', evidence: 'Prototipo autónomo, documentación técnica y defensa de decisiones.', indicators: ['Propone una solución viable.', 'Documenta, itera y argumenta su impacto local.']},
  ],
  cnb: ['Matemática: modelación, medición, datos y resolución de problemas.', 'Ciencias Naturales: sistemas, ambiente, tecnología y seguridad.', 'TAC y Comunicación: diseño colaborativo, documentación y presentación técnica.', 'Emprendimiento para la Productividad: solución pertinente para el entorno.'],
  standards: ['ISTE: diseñador innovador, comunicador creativo y colaborador global.', 'CSTA: algoritmos, sistemas, datos, seguridad y sociedad.', 'NGSS MS-ETS1: definir, probar, comparar y optimizar soluciones.'],
};

export function getTransferChallenge(moduleId: string): TransferChallenge | undefined {
  return transferChallenges.find((challenge) => challenge.moduleId === moduleId);
}

export function getChallengeVariant(moduleId: string, grade: GradeId): GradeChallengeVariant | undefined {
  return getTransferChallenge(moduleId)?.variants.find((variant) => variant.grade === grade);
}

if (transferChallenges.length !== 12 || new Set(transferChallenges.map((challenge) => challenge.moduleId)).size !== 12) {
  throw new Error('CiudadBots: cada módulo debe tener exactamente un desafío de transferencia.');
}
