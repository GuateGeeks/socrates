import type {PhaseKind} from './types';

export type GradeId = '1-basico' | '2-basico' | '3-basico';
export type SessionKind = 'guided' | 'open';
export type EvaluationMode = 'none' | 'observation' | 'optional' | 'required';
export type RouteComplexity = 'adaptar' | 'integrar' | 'resolver';

export interface GradeBlockGuidance {
  focus: string;
  teacherAction: string;
  evidence: string;
}

export interface GradeRouteCopy {
  routeLabel: string;
  routeSummary: string;
  question: string;
  minimum: string;
  support: string;
  extension: string;
  sessionTitles: readonly string[];
  sessionPurposes: readonly string[];
  sessionQuestions: readonly string[];
  blockGuidance: readonly GradeBlockGuidance[];
  openNeed: string;
  openChallenge: string;
  openComplexity: RouteComplexity;
  openSuggestedBlocks: number;
}

export interface GradeExpectation extends GradeRouteCopy {
  grade: GradeId;
  en?: GradeRouteCopy;
}

export interface ExperiencePhase {
  kind: PhaseKind;
  title: string;
  minutes: number;
  body: string;
}

export interface ResourceItem {
  label: string;
  use: 'before' | 'during' | 'extension';
  status?: 'available' | 'recommended' | 'pending';
  action?: string;
}

export interface SessionBlock {
  id: string;
  order: number;
  minutes: 60;
  kind?: 'primary' | 'continuation' | 'challenge';
  title: string;
  goal: string;
  activities: string;
  checkpoint: string;
  evidence: string;
  continuation: string;
}

export interface OpenChallengePlan {
  need: string;
  challenge: string;
  constraints: string[];
  studentOutput: string;
  completion: string;
  complexity: RouteComplexity;
  suggestedBlocks: number;
  en?: Omit<OpenChallengePlan, 'en'>;
}

export interface SessionPlan {
  id: string;
  order: number;
  kind: SessionKind;
  moduleId?: string;
  title: string;
  duration: number;
  purpose: string;
  question: string;
  preparation: string[];
  resources: ResourceItem[];
  roles: string[];
  phases: ExperiencePhase[];
  milestone: string;
  evidence: string[];
  nextStep: string;
  evaluation: EvaluationMode;
  evaluationCriteria: string[];
  cnb: string[];
  indicators: string[];
  standards: string[];
  notApplicable: string[];
  expectations: GradeExpectation[];
  openChallenge?: OpenChallengePlan;
  /** Project-specific focus used to keep each selected session contextual. */
  projectFocus?: string;
  /** One primary block and, when needed, one continuation for guided work. */
  blocks?: SessionBlock[];
}

export const GRADES: readonly {id: GradeId; label: string}[] = [
  {id: '1-basico', label: '1.º básico'},
  {id: '2-basico', label: '2.º básico'},
  {id: '3-basico', label: '3.º básico'},
];

function createExpectations(title: string, focus: string, open: boolean): GradeExpectation[] {
  const subject = title.toLowerCase();
  const shared = open ? focus.toLowerCase() : `${subject} y ${focus.toLowerCase()}`;
  const spanish = [
    {
      grade: '1-basico' as const,
      routeLabel: 'Exploración guiada',
      routeSummary: 'Reconocer, seguir y explicar con apoyo visual.',
      question: open ? '¿Qué puede construir el equipo para responder a esta necesidad concreta?' : `¿Cómo puede ${subject} completar ${focus.toLowerCase()} siguiendo una secuencia?`,
      minimum: 'Sigue la guía, identifica componentes y explica qué hace el robot.',
      support: 'Use vocabulario visual, una demostración breve y una lista de pasos.',
      extension: 'Cambie una medida o una condición y pida explicar el efecto.',
      sessionTitles: ['Comprender con apoyo', 'Construir siguiendo la secuencia', 'Calibrar y explicar'],
      sessionPurposes: [`Reconocer el reto de ${focus.toLowerCase()} y las partes que intervienen.`, 'Seguir el modelo, ejecutar el programa base y describir lo observado.', 'Comparar el resultado con el modelo y explicar un cambio sencillo.'],
      sessionQuestions: [`¿Qué necesita saber el equipo sobre ${focus.toLowerCase()} antes de construir?`, `¿Cómo puede ${subject} seguir una secuencia para cumplir ${focus.toLowerCase()}?`, `¿Qué cambio sencillo ayuda a que ${subject} cumpla mejor el reto?`],
      blockGuidance: [
        {focus: 'Reconocer el reto', teacherAction: 'Muestre el contexto y pida señalar tres partes del robot que participarán.', evidence: 'El equipo nombra el reto, identifica tres componentes y acuerda qué debe lograr.'},
        {focus: 'Seguir y probar', teacherAction: 'Acompañe un paso a la vez. Detenga la prueba después de cada movimiento y pida describir lo observado.', evidence: 'Construcción armada, programa base ejecutado y una prueba descrita con palabras o dibujo.'},
        {focus: 'Explicar el resultado', teacherAction: 'Compare el resultado con el modelo y pregunte qué cambiarían antes de repetir.', evidence: 'El equipo muestra un antes y después y explica un cambio realizado.'},
      ],
      openNeed: `Necesidad del contexto: ${focus}`,
      openChallenge: 'Adapten una estructura o secuencia conocida para responder a esta necesidad y expliquen qué parte ayuda a la persona usuaria.',
      openComplexity: 'adaptar' as const,
      openSuggestedBlocks: 1,
    },
    {
      grade: '2-basico' as const,
      routeLabel: 'Medición y depuración',
      routeSummary: 'Medir, comparar y justificar ajustes con datos.',
      question: open ? '¿Qué datos necesita el equipo para saber si su respuesta a esta necesidad funciona?' : `¿Qué medida o ajuste permite que ${subject} responda con más precisión?`,
      minimum: 'Mide, compara intentos y justifica un ajuste con datos.',
      support: 'Ofrezca una tabla de pruebas, ejemplos de variables y preguntas de depuración.',
      extension: 'Compare dos estrategias y elija la más precisa o eficiente.',
      sessionTitles: ['Medir el reto', 'Depurar con pruebas', 'Justificar la mejora'],
      sessionPurposes: [`Definir una medida para saber si ${shared} funciona.`, 'Comparar intentos y localizar qué variable cambia el resultado.', 'Elegir un ajuste y justificarlo con la evidencia de las pruebas.'],
      sessionQuestions: [`¿Cómo podemos medir si ${subject} responde al reto de ${focus.toLowerCase()}?`, `¿Qué variable debemos cambiar para mejorar ${subject}?`, `¿Qué evidencia demuestra que ${subject} mejoró?`],
      blockGuidance: [
        {focus: 'Definir una medida', teacherAction: 'Pida una variable observable y una meta numérica: distancia, tiempo, ángulo, carga o aciertos.', evidence: 'Tabla con criterio de éxito, medida inicial y una predicción.'},
        {focus: 'Comparar pruebas', teacherAction: 'Haga que el equipo repita la prueba dos veces y marque qué variable cambió entre intentos.', evidence: 'Dos o más pruebas registradas con error, ajuste y resultado.'},
        {focus: 'Justificar la mejora', teacherAction: 'Pregunte qué dato demuestra que la solución mejoró y qué prueba harían después.', evidence: 'Conclusión breve que relaciona el ajuste con una mejora observable.'},
      ],
      openNeed: `Necesidad del contexto: ${focus}`,
      openChallenge: 'Comparen dos maneras de responder a esta necesidad, midan el resultado y elijan el ajuste que produzca una mejora verificable.',
      openComplexity: 'integrar' as const,
      openSuggestedBlocks: 2,
    },
    {
      grade: '3-basico' as const,
      routeLabel: 'Rediseño e impacto local',
      routeSummary: 'Rediseñar, documentar y conectar la solución con una necesidad local.',
      question: open ? '¿Cómo puede el equipo diseñar y defender una solución pertinente para esta necesidad?' : `¿Cómo puede ${subject} rediseñarse para responder mejor a una necesidad real?`,
      minimum: 'Diseña, documenta y relaciona la solución con una necesidad del entorno.',
      support: 'Pida un diagrama, criterios de éxito y revisión de seguridad antes de construir.',
      extension: 'Optimice la solución bajo una restricción adicional y defienda la decisión.',
      sessionTitles: ['Delimitar la necesidad', 'Rediseñar y validar', 'Documentar y defender'],
      sessionPurposes: [`Delimitar quién necesita una mejora en ${focus.toLowerCase()} y con qué restricción.`, 'Rediseñar la estructura o el algoritmo y validar una iteración.', 'Documentar la solución, sus límites y su posible impacto local.'],
      sessionQuestions: [`¿Qué necesidad real puede resolver ${subject} y para quién?`, `¿Qué parte de ${subject} debemos rediseñar para responder mejor?`, `¿Cómo podemos defender que ${subject} responde a una necesidad local?`],
      blockGuidance: [
        {focus: 'Delimitar el problema', teacherAction: 'Pida definir usuario, necesidad, restricción y criterio de éxito antes de tocar el kit.', evidence: 'Diagrama de la solución con problema, alcance y criterio verificable.'},
        {focus: 'Diseñar y validar', teacherAction: 'Revise decisiones mecánicas y de código con preguntas de seguridad, eficiencia y transferencia.', evidence: 'Prototipo funcional, programa documentado y registro de una iteración.'},
        {focus: 'Defender la decisión', teacherAction: 'Solicite explicar qué se mantuvo, qué se cambió y qué evidencia respalda la elección.', evidence: 'Presentación técnica breve con datos, limitación detectada y siguiente mejora.'},
      ],
      openNeed: `Necesidad del contexto: ${focus}`,
      openChallenge: 'Diseñen una solución propia para esta necesidad, documenten el algoritmo, prueben una versión y defiendan su impacto en la comunidad.',
      openComplexity: 'resolver' as const,
      openSuggestedBlocks: 3,
    },
  ];
  const english = [
    {
      routeLabel: 'Guided exploration', routeSummary: 'Recognize, follow, and explain with visual support.',
      question: open ? 'What can the team build to respond to this concrete need?' : `How can ${subject} complete ${focus.toLowerCase()} by following a sequence?`,
      minimum: 'Follows the guide, identifies components, and explains what the robot does.', support: 'Use visual vocabulary, a short demonstration, and a step list.', extension: 'Change one measurement or condition and explain the effect.',
      sessionTitles: ['Understand with support', 'Build by following the sequence', 'Calibrate and explain'],
      sessionPurposes: [`Recognize the ${focus.toLowerCase()} challenge and the parts involved.`, 'Follow the model, run the base program, and describe what was observed.', 'Compare the result with the model and explain one simple change.'],
      sessionQuestions: [`What does the team need to know about ${focus.toLowerCase()} before building?`, `How can ${subject} follow a sequence to complete ${focus.toLowerCase()}?`, `What simple change can help ${subject} meet the challenge better?`],
      blockGuidance: [{focus: 'Recognize the challenge', teacherAction: 'Show the context and ask the team to point out three robot parts involved.', evidence: 'The team names the challenge, identifies three components, and agrees what the robot must do.'}, {focus: 'Follow and test', teacherAction: 'Guide one step at a time. Pause after each movement and ask students to describe what they observe.', evidence: 'Built model, base program run, and one test described with words or a drawing.'}, {focus: 'Explain the result', teacherAction: 'Compare the result with the model and ask what they would change before repeating.', evidence: 'The team shows before and after and explains one change.'}],
      openNeed: `Context need: ${focus}`, openChallenge: 'Adapt a known structure or sequence to respond to this need and explain how it helps a user.', openComplexity: 'adaptar' as const, openSuggestedBlocks: 1,
    },
    {
      routeLabel: 'Measurement and debugging', routeSummary: 'Measure, compare, and justify adjustments with data.',
      question: open ? 'What data does the team need to know whether its response to this need works?' : `What measurement or adjustment would make ${subject} more precise?`,
      minimum: 'Measures, compares tests, and justifies an adjustment with data.', support: 'Offer a test table, variable examples, and debugging questions.', extension: 'Compare two strategies and choose the more precise or efficient one.',
      sessionTitles: ['Measure the challenge', 'Debug with tests', 'Justify the improvement'],
      sessionPurposes: [`Define a measure to decide whether ${shared} works.`, 'Compare attempts and locate which variable changes the result.', 'Choose an adjustment and justify it with test evidence.'],
      sessionQuestions: [`How can we measure whether ${subject} responds to ${focus.toLowerCase()}?`, `Which variable should we change to improve ${subject}?`, `What evidence shows that ${subject} improved?`],
      blockGuidance: [{focus: 'Define a measure', teacherAction: 'Ask for one observable variable and a numeric target: distance, time, angle, load, or hits.', evidence: 'A table with success criteria, initial measure, and prediction.'}, {focus: 'Compare tests', teacherAction: 'Have the team repeat the test twice and mark which variable changed.', evidence: 'Two or more tests recorded with error, adjustment, and result.'}, {focus: 'Justify improvement', teacherAction: 'Ask which data shows improvement and what test should come next.', evidence: 'A brief conclusion linking the adjustment to an observable improvement.'}],
      openNeed: `Context need: ${focus}`, openChallenge: 'Compare two ways to respond to this need, measure the result, and choose the adjustment that produces a verifiable improvement.', openComplexity: 'integrar' as const, openSuggestedBlocks: 2,
    },
    {
      routeLabel: 'Redesign and local impact', routeSummary: 'Redesign, document, and connect the solution to a local need.',
      question: open ? 'How can the team design and defend a relevant solution for this need?' : `How can ${subject} be redesigned to respond better to a real need?`,
      minimum: 'Designs, documents, and connects the solution to a need in its environment.', support: 'Ask for a diagram, success criteria, and a safety review before building.', extension: 'Optimize the solution under an additional constraint and defend the decision.',
      sessionTitles: ['Define the need', 'Redesign and validate', 'Document and defend'],
      sessionPurposes: [`Define who needs an improvement in ${focus.toLowerCase()} and under which constraint.`, 'Redesign the structure or algorithm and validate one iteration.', 'Document the solution, its limits, and possible local impact.'],
      sessionQuestions: [`What real need can ${subject} solve, and for whom?`, `Which part of ${subject} should we redesign to respond better?`, `How can we defend that ${subject} responds to a local need?`],
      blockGuidance: [{focus: 'Define the problem', teacherAction: 'Ask students to define user, need, constraint, and success criterion before using the kit.', evidence: 'A solution diagram with problem, scope, and verifiable criterion.'}, {focus: 'Design and validate', teacherAction: 'Review mechanical and code decisions with questions about safety, efficiency, and transfer.', evidence: 'Functional prototype, documented program, and one iteration recorded.'}, {focus: 'Defend the decision', teacherAction: 'Ask students to explain what stayed, what changed, and what evidence supports the choice.', evidence: 'Short technical presentation with data, limitation, and next improvement.'}],
      openNeed: `Context need: ${focus}`, openChallenge: 'Design your own solution for this need, document the algorithm, test one version, and defend its community impact.', openComplexity: 'resolver' as const, openSuggestedBlocks: 3,
    },
  ];
  return spanish.map((copy, index) => ({...copy, grade: copy.grade, en: english[index]}));
}

const guidedTopics = [
  ['m1', 'Robot Cartógrafo', 'Planos, distancia y giros'],
  ['m2', 'Robot de Entregas', 'Rutas, carga y código PIN'],
  ['m3', 'Montacargas', 'Precisión, carga y maniobra'],
  ['m4', 'Brazo Reparador', 'Sensor de color y manipulación'],
  ['m5', 'Grúa Torre', 'Poleas, winch y control'],
  ['m6', 'Cargador Compacto', 'Giroscopio y dirección'],
  ['m7', 'Brazo Clasificador', 'Color, posiciones y subrutinas'],
  ['m8', 'Constructor de Puentes', 'Infraestructura y precisión'],
  ['m9', 'Elevador', 'Variables, pisos y seguridad'],
  ['m10', 'Auto Urbano', 'Rutas por color y orientación'],
  ['m11', 'Unidad de Rescate', 'Búsqueda, sensor y rescate'],
  ['m12', 'Rueda de la Fortuna', 'Velocidad, variable y parada'],
] as const;

function guidedPlan(
  order: number,
  [moduleId, title, focus]: readonly [string, string, string],
): SessionPlan {
  return {
    id: `guided-${moduleId}`,
    order,
    kind: 'guided',
    moduleId,
    title: `${title} · ${focus}`,
    projectFocus: focus,
    duration: 60,
    purpose: `Construir y comprender ${title} mediante un reto guiado de ingeniería urbana.`,
    question: `¿Cómo puede ${title.toLowerCase()} resolver una necesidad de la ciudad con precisión?`,
    preparation: ['Programa base LEGO SPIKE', 'Piezas y motores del kit', 'Guía visual o referencia de construcción', 'Hoja de pruebas del equipo'],
    resources: [
      {label: 'Programa base LEGO SPIKE', use: 'before'},
      {label: 'Piezas, motores y sensores del kit', use: 'during'},
      {label: 'Guía visual de construcción', use: 'during'},
      {label: 'Hoja de pruebas y extensión de calibración', use: 'extension'},
    ],
    roles: ['Constructor: arma y verifica la estructura.', 'Organizador: cuida piezas, tiempos y evidencias.', 'Programador: prueba bloques, sensores y ajustes.'],
    phases: [
      {kind: 'act', title: 'Activar el problema', minutes: 10, body: `Presentar el contexto de ${focus.toLowerCase()} y acordar un criterio de éxito observable.`},
      {kind: 'exp', title: 'Explorar el sistema', minutes: 15, body: 'Identificar piezas, motores, sensores y relaciones entre estructura, código y movimiento.'},
      {kind: 'cre', title: 'Construir, programar y probar', minutes: 25, body: 'Seguir la referencia técnica, ejecutar el programa base y registrar al menos un ajuste con su resultado.'},
      {kind: 'ref', title: 'Explicar la mejora', minutes: 10, body: 'Comparar el resultado con el criterio de éxito y comunicar qué se mantendría o cambiaría.'},
    ],
    milestone: 'Robot funcional, programa base ejecutado y una prueba registrada.',
    evidence: ['Fotografía o descripción del robot funcional.', 'Programa probado y explicado por el equipo.', 'Tabla breve con intento, error y ajuste.'],
    nextStep: 'Conservar la evidencia para comparar el avance con el siguiente reto.',
    evaluation: order === 12 ? 'required' : order % 3 === 0 ? 'observation' : 'optional',
    evaluationCriteria: ['Comprende la relación entre estructura, código y resultado.', 'Registra pruebas y comunica una decisión técnica.', 'Colabora y rota responsabilidades.'],
    cnb: ['Matemática: medición, patrones, relaciones y resolución de problemas.', 'Ciencias Naturales: movimiento, fuerza, sistemas y seguridad.', 'TAC: uso responsable de herramientas, documentación y colaboración.'],
    indicators: ['Construye y ejecuta una secuencia tecnológica siguiendo criterios del reto.', 'Registra pruebas y explica una relación entre mecanismo, código y resultado.', 'Comunica una mejora usando vocabulario técnico y evidencia.'],
    standards: ['ISTE: diseñador innovador, pensador computacional y comunicador creativo.', 'CSTA: algoritmos, programación, sistemas y depuración.', 'NGSS MS-ETS1: criterios, pruebas y optimización de soluciones.'],
    notApplicable: ['Diseño autónomo de una solución comunitaria: se desarrolla en la ruta abierta.'],
    expectations: createExpectations(title, focus, false),
  };
}

const openTopics = [
  ['open-13', 'Mapa vivo de mi comunidad', 'En época de lluvia, la escuela necesita representar una ruta segura hacia un servicio cercano.', 1, 'adaptar'],
  ['open-14', 'Entrega que sí llega', 'El equipo debe llevar agua, medicinas o útiles a un punto definido sin perder la ruta.', 1, 'adaptar'],
  ['open-15', 'Carga para todos', 'Una bodega escolar necesita mover materiales sin volcar la carga ni bloquear el paso.', 2, 'integrar'],
  ['open-16', 'Alerta en la ciudad', 'Una reparación de agua necesita detectar una señal y avisar antes de que alguien se acerque.', 2, 'integrar'],
  ['open-17', 'Construcción segura', 'Una obra comunitaria necesita mover materiales manteniendo una zona segura para las personas.', 2, 'integrar'],
  ['open-18', 'Calles que cambian', 'Un vehículo debe adaptarse a una ruta que cambia entre calles estrechas, giros y obstáculos.', 2, 'integrar'],
  ['open-19', 'Clasificar para ayudar', 'La escuela quiere separar materiales reutilizables para reducir residuos y ordenar la recolección.', 2, 'integrar'],
  ['open-20', 'Conectar territorios', 'Una comunidad necesita imaginar un cruce seguro entre dos zonas separadas por un desnivel.', 3, 'resolver'],
  ['open-21', 'Acceso para todos', 'El edificio escolar necesita transportar materiales entre niveles sin exigir fuerza física a una persona.', 3, 'resolver'],
  ['open-22', 'Movilidad en la ciudad', 'Un vehículo debe respetar señales y elegir una ruta para atender una necesidad de movilidad local.', 3, 'resolver'],
  ['open-23', 'Respuesta ante emergencias', 'Después de una emergencia, una solución debe buscar, transportar o comunicar ayuda sin exponer a una persona.', 3, 'resolver'],
  ['open-24', 'Feria de la comunidad', 'El equipo debe presentar una solución tecnológica completa para una necesidad que haya investigado.', 3, 'resolver'],
] as const;

const openTopicsEnglish: readonly [string, string, string][] = [
  ['A living map of my community', 'During the rainy season, the school needs to represent a safe route to a nearby service.', 'Design and test a route that helps the community move safely.'],
  ['A delivery that arrives', 'The team must carry water, medicine, or school supplies to a defined point without losing the route.', 'Design and test a delivery response that keeps the route and its purpose clear.'],
  ['A load for everyone', 'A school storage room needs to move materials without tipping the load or blocking the way.', 'Design and test a safer way to move a load.'],
  ['A city alert', 'A water repair needs to detect a signal and warn people before they approach.', 'Design and test a system that detects a condition and communicates a safe action.'],
  ['Safe construction', 'A community building site needs to move materials while keeping people in a safe zone.', 'Design and test a controlled material-moving solution.'],
  ['Changing streets', 'A vehicle must adapt to a route with narrow streets, turns, and obstacles.', 'Design and test a vehicle that adapts its behavior to the route.'],
  ['Sorting to help', 'The school wants to separate reusable materials to reduce waste and organize collection.', 'Design and test a sorting system that supports reuse.'],
  ['Connecting territories', 'A community needs to imagine a safe crossing between two areas separated by a change in level.', 'Design and test a structure that makes the crossing safer.'],
  ['Access for everyone', 'The school building needs to move materials between levels without requiring physical force from a person.', 'Design and test an accessible lifting response.'],
  ['Mobility in the city', 'A vehicle must respect signals and choose a route to address a local mobility need.', 'Design and test a vehicle that follows signals and explains its route.'],
  ['Emergency response', 'After an emergency, a solution must search for, carry, or communicate help without exposing a person.', 'Design and test a response that supports people safely during an emergency.'],
  ['Community fair', 'The team must present a complete technology solution for a need it has investigated.', 'Design, test, and present a solution connected to a real community need.'],
];

function openPlan(order: number, [id, title, problem, suggestedBlocks, complexity]: readonly [string, string, string, number, RouteComplexity]): SessionPlan {
  const english = openTopicsEnglish[order - 13];
  return {
    id,
    order,
    kind: 'open',
    title,
    projectFocus: problem,
    duration: 60,
    purpose: `Diseñar una respuesta tecnológica propia a partir de esta necesidad: ${problem}`,
    question: `¿Qué puede hacer el equipo para responder a esta necesidad sin perder de vista a las personas que la viven?`,
    preparation: ['Presentar la problemática y sus límites.', 'Definir criterios de éxito con el grupo.', 'Preparar una bitácora o tablero de decisiones.'],
    resources: [
      {label: 'Tarjeta de problemática y criterios de éxito', use: 'before'},
      {label: 'Piezas, sensores y dispositivos disponibles', use: 'during'},
      {label: 'Bitácora de decisiones y pruebas', use: 'during'},
      {label: 'Reto de extensión para optimizar la solución', use: 'extension'},
    ],
    roles: ['Constructor: propone y prueba estructuras.', 'Organizador: registra acuerdos, materiales y tiempos.', 'Programador: diseña, prueba y documenta el comportamiento.'],
    phases: [
      {kind: 'act', title: 'Entender la necesidad', minutes: 10, body: 'Analizar la problemática, las personas involucradas y los límites de una solución responsable.'},
      {kind: 'exp', title: 'Imaginar y decidir', minutes: 15, body: 'Proponer ideas, compararlas con criterios y elegir una dirección sin buscar todavía una respuesta perfecta.'},
      {kind: 'cre', title: 'Prototipar y probar', minutes: 25, body: 'Construir, programar o simular una primera versión. Registrar qué funciona, qué falla y qué deben cambiar.'},
      {kind: 'ref', title: 'Acordar el siguiente paso', minutes: 10, body: 'Presentar el avance parcial, recibir preguntas y definir la próxima decisión de diseño.'},
    ],
    milestone: 'Hito visible del proyecto: idea justificada, prototipo o prueba documentada.',
    evidence: ['Boceto o diagrama de la solución.', 'Registro de una prueba y una iteración.', 'Retroalimentación del docente y siguiente paso acordado.'],
    nextStep: 'Retomar el siguiente hito con base en la evidencia, no solo en la intuición.',
    evaluation: order === 24 ? 'required' : order % 4 === 0 ? 'optional' : 'observation',
    evaluationCriteria: ['Define el problema y criterios de éxito.', 'Toma decisiones, prueba e itera con evidencia.', 'Explica cómo la solución responde al contexto.'],
    cnb: ['Matemática: modelación, medición, representación y análisis de datos.', 'Ciencias Naturales: sistemas, tecnología, ambiente y seguridad.', 'TAC y Comunicación: diseño colaborativo, documentación y presentación técnica.', 'Emprendimiento para la Productividad: proyecto viable y pertinente para el entorno.'],
    indicators: ['Define una problemática, criterios de éxito y límites de una solución.', 'Prototipa, prueba e itera registrando decisiones y resultados.', 'Argumenta la pertinencia de su propuesta y comunica el proceso.'],
    standards: ['ISTE: aprendiz empoderado, diseñador innovador y colaborador global.', 'CSTA: diseño de algoritmos, sistemas, datos, seguridad y sociedad.', 'NGSS MS-ETS1: definir, comparar, probar y optimizar soluciones.'],
    notApplicable: ['Modelo único de robot y guía paso a paso: no aplican a una sesión de creación abierta.'],
    expectations: createExpectations(title, problem, true),
    openChallenge: {
      need: problem,
      challenge: `Diseñen y prueben una solución que responda a esta necesidad usando como punto de partida los conceptos de ${title.toLowerCase()}.`,
      constraints: ['Definan a quién ayuda la solución y qué no intentará resolver.', 'Elijan una medida observable para decidir si funciona.', 'Pueden modificar el modelo, pero no copiar una respuesta única.'],
      studentOutput: 'Boceto o diagrama, prototipo o simulación, programa o lógica explicada y una decisión de mejora.',
      completion: 'El equipo muestra una prueba, explica el cambio realizado y relaciona la solución con la necesidad inicial.',
      complexity,
      suggestedBlocks,
      en: english ? {
        need: english[1],
        challenge: english[2],
        constraints: ['Define who the solution helps and what it will not try to solve.', 'Choose one observable measure to decide whether it works.', 'The team may modify the model but must not copy one prescribed answer.'],
        studentOutput: 'A sketch or diagram, a prototype or simulation, an explained program or logic, and one improvement decision.',
        completion: 'The team shows a test, explains the change made, and connects the solution to the initial need.',
        complexity,
        suggestedBlocks,
      } : undefined,
    },
  };
}

function createBlocks(plan: SessionPlan): SessionBlock[] {
  const [activate, explore, create, reflect] = plan.phases;
  const open = plan.kind === 'open';
  return [
    {
      id: `${plan.id}-b1`, order: 1, minutes: 60,
      title: open ? 'Definir el reto' : 'Comprender el sistema',
      goal: activate.title,
      activities: `${activate.body} ${explore.body}`,
      checkpoint: open ? 'Problema, alcance y criterio de éxito acordados.' : 'El equipo puede explicar el reto y reconocer las partes principales.',
      evidence: plan.evidence[0],
      continuation: 'Si el grupo necesita más tiempo, repita este bloque antes de construir.',
    },
    {
      id: `${plan.id}-b2`, order: 2, minutes: 60,
      title: open ? 'Construir el primer prototipo' : 'Construir y programar',
      goal: create.title,
      activities: create.body,
      checkpoint: open ? 'Existe una primera versión que puede probarse.' : plan.milestone,
      evidence: plan.evidence[1] || plan.evidence[0],
      continuation: 'Registre el error principal y retome desde la prueba que aún no funciona.',
    },
    {
      id: `${plan.id}-b3`, order: 3, minutes: 60,
      title: open ? 'Mejorar y comunicar' : 'Calibrar y explicar',
      goal: reflect.title,
      activities: reflect.body,
      checkpoint: open ? 'El equipo justifica una mejora con evidencia.' : 'El equipo comunica qué cambió y por qué.',
      evidence: plan.evidence[2] || plan.evidence[plan.evidence.length - 1],
      continuation: plan.nextStep,
    },
  ];
}

export const sessionPlans: readonly SessionPlan[] = [
  ...guidedTopics.map((topic, index) => guidedPlan(index + 1, topic)),
  ...openTopics.map((topic, index) => ({...openPlan(index + 13, topic), moduleId: guidedTopics[index][0]})),
].map((plan) => ({
  ...plan,
  blocks: createBlocks(plan),
  resources: plan.resources.map((resource, index) => ({
    ...resource,
    status: index === 0 ? 'available' : 'recommended',
    action: resource.use === 'before' ? 'Preparar' : resource.use === 'during' ? 'Usar en clase' : 'Ampliar',
  })),
}));

/**
 * Module-local route: three guided sessions keep the existing learning arc,
 * while each session may have one primary class and one continuation. The
 * open route is one contextual challenge whose blocks vary by module.
 */
export const moduleSessionPlans: readonly SessionPlan[] = guidedTopics.flatMap((topic, index) => {
  const guidedBase = sessionPlans.find((plan) => plan.id === `guided-${topic[0]}`) || guidedPlan(index + 1, topic);
  const guidedBlocks = guidedBase.blocks || [];
  const openBase = sessionPlans.find((plan) => plan.id === `open-${index + 13}`);
  const openBlocks = openBase?.blocks || [];
  const guided = guidedBlocks.map((block, blockIndex) => {
    const continuation = blockIndex === 0 ? undefined : {
      ...block,
      id: `${block.id}-continuation`,
      kind: 'continuation' as const,
      title: `Continuación · ${block.title}`,
      order: 2,
      activities: `${block.activities} Use esta segunda clase únicamente si el grupo necesita terminar, calibrar o explicar el resultado.`,
      checkpoint: `La sesión queda lista para avanzar: ${block.checkpoint.toLowerCase()}`,
      continuation: 'Cuando el grupo esté listo, avance a la siguiente sesión guiada.',
    };
    return {
      ...guidedBase,
      id: `guided-${topic[0]}-s${blockIndex + 1}`,
      order: blockIndex + 1,
      title: `${topic[1]} · ${block.title}`,
      purpose: block.activities,
      question: guidedBase.expectations[0].question,
      blocks: [{...block, id: `guided-${topic[0]}-s${blockIndex + 1}-primary`, kind: 'primary' as const, title: 'Clase principal', order: 1}, ...(continuation ? [continuation] : [])],
    } satisfies SessionPlan;
  });
  const open = openBase ? [{
    ...openBase,
    id: `open-${topic[0]}`,
    moduleId: topic[0],
    order: 1,
    title: `${topic[1]} · Desafío abierto`,
    purpose: openBase.openChallenge?.challenge || openBase.purpose,
    blocks: openBlocks.slice(0, openBase.openChallenge?.suggestedBlocks || 1).map((block, blockIndex) => ({
      ...block,
      id: `open-${topic[0]}-b${blockIndex + 1}`,
      kind: 'challenge' as const,
      order: blockIndex + 1,
      title: blockIndex === 0 ? 'Definir y prototipar' : blockIndex === 1 ? 'Probar y ajustar' : 'Integrar y comunicar',
      activities: blockIndex === 0 ? 'Presentar la necesidad, delimitar a quién ayuda la solución y construir una primera respuesta.' : blockIndex === 1 ? 'Probar la respuesta con la restricción acordada, registrar el resultado y cambiar una decisión.' : 'Integrar la solución, explicar sus límites y preparar una demostración para otras personas.',
    })),
    notApplicable: [...openBase.notApplicable, 'No existe un modelo único de armado ni un programa terminado que copiar.'],
  } satisfies SessionPlan] : [];
  return [...guided, ...open];
});

export function getGradeCopy(session: SessionPlan, grade: GradeId, isEnglish = false): GradeRouteCopy | undefined {
  const expectation = session.expectations.find((item) => item.grade === grade);
  return expectation ? (isEnglish ? expectation.en || expectation : expectation) : undefined;
}

const englishResourceLabels: Record<string, string> = {
  'Programa base LEGO SPIKE': 'LEGO SPIKE base program',
  'Piezas y motores del kit': 'Kit pieces and motors',
  'Guía visual o referencia de construcción': 'Visual build guide or reference',
  'Hoja de pruebas del equipo': 'Team test sheet',
  'Programa base LEGO SPIKE / LLSP': 'LEGO SPIKE / LLSP base program',
  'Piezas, motores y sensores del kit': 'Kit pieces, motors, and sensors',
  'Guía visual de construcción': 'Visual build guide',
  'Hoja de pruebas y extensión de calibración': 'Test sheet and calibration extension',
  'Tarjeta de problemática y criterios de éxito': 'Problem and success-criteria card',
  'Piezas, sensores y dispositivos disponibles': 'Available pieces, sensors, and devices',
  'Bitácora de decisiones y pruebas': 'Decision and test log',
  'Reto de extensión para optimizar la solución': 'Extension challenge to optimize the solution',
};

const englishSessionText: Record<string, string> = {
  'Preparar': 'Prepare', 'Usar en clase': 'Use in class', 'Ampliar': 'Extend',
  'Antes de clase': 'Before class', 'Durante la clase': 'During class', 'Extensión': 'Extension',
  'Constructor: arma y verifica la estructura.': 'Builder: assemble and check the structure.',
  'Organizador: cuida piezas, tiempos y evidencias.': 'Organizer: manage pieces, time, and evidence.',
  'Programador: prueba bloques, sensores y ajustes.': 'Programmer: test blocks, sensors, and adjustments.',
  'Constructor: propone y prueba estructuras.': 'Builder: propose and test structures.',
  'Organizador: registra acuerdos, materiales y tiempos.': 'Organizer: record agreements, materials, and time.',
  'Programador: diseña, prueba y documenta el comportamiento.': 'Programmer: design, test, and document behavior.',
  'Fotografía o descripción del robot funcional.': 'Photo or description of the working robot.',
  'Programa probado y explicado por el equipo.': 'Program tested and explained by the team.',
  'Tabla breve con intento, error y ajuste.': 'Brief table with attempt, error, and adjustment.',
  'Boceto o diagrama de la solución.': 'Solution sketch or diagram.',
  'Registro de una prueba y una iteración.': 'Record of one test and one iteration.',
  'Retroalimentación del docente y siguiente paso acordado.': 'Teacher feedback and agreed next step.',
  'Conservar la evidencia para comparar el avance con el siguiente reto.': 'Keep the evidence to compare progress in the next challenge.',
  'Retomar el siguiente hito con base en la evidencia, no solo en la intuición.': 'Resume the next milestone using evidence, not intuition alone.',
  'Si el grupo necesita más tiempo, repita este bloque antes de construir.': 'If the group needs more time, repeat this block before building.',
  'Registre el error principal y retome desde la prueba que aún no funciona.': 'Record the main error and resume from the test that still fails.',
  'Cuando el grupo esté listo, avance a la siguiente sesión guiada.': 'When the group is ready, move to the next guided session.',
  'Clase principal': 'Main class',
};

function enText(value: string): string {
  return englishSessionText[value] || value;
}

function localizeBase(session: SessionPlan): Pick<SessionPlan, 'preparation' | 'resources' | 'roles' | 'evidence' | 'nextStep' | 'cnb' | 'indicators' | 'standards' | 'notApplicable'> {
  return {
    preparation: session.preparation.map(enText),
    resources: session.resources.map((item) => ({...item, label: englishResourceLabels[item.label] || enText(item.label), action: item.action ? enText(item.action) : item.action})),
    roles: session.roles.map(enText),
    evidence: session.evidence.map(enText),
    nextStep: enText(session.nextStep),
    cnb: session.cnb,
    indicators: session.indicators,
    standards: session.standards,
    notApplicable: session.notApplicable.map(enText),
  };
}

function createGradePhases(title: string, focus: string, grade: GradeId, sessionIndex: number, isEnglish: boolean): ExperiencePhase[] {
  const subject = title.toLowerCase();
  const context = focus.toLowerCase();
  const spanish: Record<GradeId, ExperiencePhase[][]> = {
    '1-basico': [
      [
        {kind: 'act', title: 'Activar el contexto', minutes: 10, body: `Muestre una situación relacionada con ${context}. Pida que el equipo diga qué debe hacer ${subject} y acuerde un criterio sencillo de éxito.`},
        {kind: 'exp', title: 'Reconocer las partes', minutes: 15, body: `Use la guía visual para localizar motores, sensores y piezas que participan en ${context}. Deténgase para que cada estudiante nombre una función.`},
        {kind: 'cre', title: 'Seguir el primer paso', minutes: 25, body: `Construyan la base de ${subject} siguiendo la secuencia indicada y ejecuten solo el movimiento inicial. El docente acompaña paso a paso.`},
        {kind: 'ref', title: 'Contar lo comprendido', minutes: 10, body: `Pida explicar qué parte de ${subject} ayuda a resolver ${context} y qué necesitan revisar antes de continuar.`},
      ],
      [
        {kind: 'act', title: 'Recordar la misión', minutes: 10, body: `Retome el criterio de éxito de ${context} y pida predecir qué hará ${subject} en el siguiente movimiento.`},
        {kind: 'exp', title: 'Conectar bloques y piezas', minutes: 15, body: `Relacione cada bloque del programa base con una acción visible de ${subject}. Verifique conexiones antes de iniciar la prueba.`},
        {kind: 'cre', title: 'Construir y ejecutar', minutes: 25, body: `Completen la secuencia guiada, ejecuten el programa base y observen un movimiento a la vez. Permita repetir sin cambiar varias cosas a la vez.`},
        {kind: 'ref', title: 'Describir el resultado', minutes: 10, body: `Compare lo que el equipo esperaba con lo que ocurrió. Pida una explicación oral o con dibujo de un bloque y su efecto.`},
      ],
      [
        {kind: 'act', title: 'Volver al criterio', minutes: 10, body: `Muestre el resultado de ${subject} y pregunte qué parte de ${context} ya cumple y cuál todavía necesita atención.`},
        {kind: 'exp', title: 'Encontrar un ajuste', minutes: 15, body: `Compare el modelo con la prueba. El equipo elige una sola variable guiada, como tiempo, distancia, giro o posición.`},
        {kind: 'cre', title: 'Ajustar y repetir', minutes: 25, body: `Realicen un cambio pequeño en ${subject}, repitan la prueba y describan el antes y el después sin buscar todavía una solución nueva.`},
        {kind: 'ref', title: 'Explicar la mejora', minutes: 10, body: `Pida que el equipo muestre qué cambió, qué observó y qué recomendaría hacer en la próxima sesión.`},
      ],
    ],
    '2-basico': [
      [
        {kind: 'act', title: 'Definir una medida', minutes: 10, body: `Convierta ${context} en un criterio medible: distancia, tiempo, ángulo, carga, precisión o cantidad de aciertos.`},
        {kind: 'exp', title: 'Identificar variables', minutes: 15, body: `Analicen qué motor, sensor o parámetro puede cambiar el resultado de ${subject}. Pida una predicción antes de probar.`},
        {kind: 'cre', title: 'Planear la primera prueba', minutes: 25, body: `Construyan o revisen ${subject}, ejecuten una prueba controlada y registren el valor inicial sin cambiar más de una variable.`},
        {kind: 'ref', title: 'Leer la línea de partida', minutes: 10, body: `Comparen el resultado con la meta y formulen una pregunta de depuración para la siguiente sesión.`},
      ],
      [
        {kind: 'act', title: 'Elegir qué cambiar', minutes: 10, body: `Revisen el resultado anterior de ${subject} y decidan qué variable explica mejor el error en ${context}.`},
        {kind: 'exp', title: 'Diseñar una prueba', minutes: 15, body: `Definan qué mantendrán igual, qué cambiarán y cómo medirán el efecto. El docente valida que la comparación sea justa.`},
        {kind: 'cre', title: 'Depurar con datos', minutes: 25, body: `Ejecuten al menos dos intentos de ${subject}, registren valor, error y ajuste, y comparen la respuesta observada.`},
        {kind: 'ref', title: 'Comparar antes y después', minutes: 10, body: `Pida explicar qué dato apoya la decisión y qué variable probarían si el resultado todavía no alcanza la meta.`},
      ],
      [
        {kind: 'act', title: 'Revisar la evidencia', minutes: 10, body: `Ordenen los resultados de ${subject} y vuelvan a la meta definida para ${context}.`},
        {kind: 'exp', title: 'Seleccionar la mejora', minutes: 15, body: `Comparen dos ajustes posibles y argumenten cuál ofrece más precisión, estabilidad o eficiencia.`},
        {kind: 'cre', title: 'Calibrar y verificar', minutes: 25, body: `Apliquen el ajuste seleccionado, repitan la prueba y completen la comparación con datos suficientes para sostener la conclusión.`},
        {kind: 'ref', title: 'Justificar la decisión', minutes: 10, body: `El equipo comunica qué cambió, qué mejoró y qué límite todavía tiene ${subject}.`},
      ],
    ],
    '3-basico': [
      [
        {kind: 'act', title: 'Delimitar la necesidad', minutes: 10, body: `Definan quién vive el problema de ${context}, qué necesita y qué restricción debe respetar ${subject}.`},
        {kind: 'exp', title: 'Analizar el sistema', minutes: 15, body: `Descompongan ${subject} en estructura, entradas, proceso y salida. Identifiquen qué parte podría rediseñarse.`},
        {kind: 'cre', title: 'Plantear una hipótesis', minutes: 25, body: `Construyan una primera versión o esquema de ${subject}, conectando una decisión mecánica o de código con la necesidad definida.`},
        {kind: 'ref', title: 'Acordar criterios', minutes: 10, body: `Revisen si el criterio permite juzgar la solución y expliquen qué evidencia necesitarán para defenderla.`},
      ],
      [
        {kind: 'act', title: 'Elegir una decisión de diseño', minutes: 10, body: `Retomen la necesidad de ${context} y seleccionen la parte de ${subject} que rediseñarán, justificando su alcance.`},
        {kind: 'exp', title: 'Modelar la solución', minutes: 15, body: `Representen el cambio con un diagrama, pseudocódigo o esquema de estados antes de construirlo.`},
        {kind: 'cre', title: 'Rediseñar y validar', minutes: 25, body: `Implementen la modificación, prueben bajo la restricción acordada y documenten una iteración completa.`},
        {kind: 'ref', title: 'Defender la iteración', minutes: 10, body: `Expliquen qué decisión produjo el cambio, qué evidencia lo demuestra y qué riesgo o límite permanece.`},
      ],
      [
        {kind: 'act', title: 'Preparar la defensa', minutes: 10, body: `Ordenen el problema, el criterio y los resultados de ${subject} para comunicar la respuesta a ${context}.`},
        {kind: 'exp', title: 'Documentar el sistema', minutes: 15, body: `Completen el algoritmo, diagrama o explicación técnica para que otra persona pueda comprender la solución.`},
        {kind: 'cre', title: 'Optimizar con una restricción', minutes: 25, body: `Realicen una última mejora de ${subject} considerando seguridad, precisión, tiempo, materiales o impacto local.`},
        {kind: 'ref', title: 'Comunicar el impacto', minutes: 10, body: `Presenten la solución, la evidencia y una limitación. Cierren indicando cómo podría probarse en una comunidad de Guatemala.`},
      ],
    ],
  };
  const english: Record<GradeId, ExperiencePhase[][]> = {
    '1-basico': [
      [{kind: 'act', title: 'Activate the context', minutes: 10, body: `Show a situation related to ${context}. Ask what ${subject} must do and agree on a simple success criterion.`}, {kind: 'exp', title: 'Recognize the parts', minutes: 15, body: `Use the visual guide to locate motors, sensors, and parts involved in ${context}. Ask each student to name one function.`}, {kind: 'cre', title: 'Follow the first step', minutes: 25, body: `Build the base of ${subject} by following the sequence and run only the first movement. Guide the team step by step.`}, {kind: 'ref', title: 'Explain what was understood', minutes: 10, body: `Ask which part of ${subject} helps respond to ${context} and what should be reviewed next.`}],
      [{kind: 'act', title: 'Recall the mission', minutes: 10, body: `Return to the success criterion for ${context} and ask students to predict ${subject}'s next movement.`}, {kind: 'exp', title: 'Connect blocks and parts', minutes: 15, body: `Relate each base-program block to a visible action of ${subject}. Check connections before testing.`}, {kind: 'cre', title: 'Build and run', minutes: 25, body: `Complete the guided sequence, run the base program, and observe one movement at a time.`}, {kind: 'ref', title: 'Describe the result', minutes: 10, body: `Compare the expected and actual result. Ask for a spoken or drawn explanation of one block and its effect.`}],
      [{kind: 'act', title: 'Return to the criterion', minutes: 10, body: `Show ${subject}'s result and ask which part of ${context} works and which part still needs attention.`}, {kind: 'exp', title: 'Find one adjustment', minutes: 15, body: `Compare the model and the test. Choose one guided variable such as time, distance, turn, or position.`}, {kind: 'cre', title: 'Adjust and repeat', minutes: 25, body: `Make one small change to ${subject}, repeat the test, and describe before and after.`}, {kind: 'ref', title: 'Explain the improvement', minutes: 10, body: `Show what changed, what was observed, and what should happen next.`}],
    ],
    '2-basico': [
      [{kind: 'act', title: 'Define a measure', minutes: 10, body: `Turn ${context} into a measurable criterion: distance, time, angle, load, accuracy, or hits.`}, {kind: 'exp', title: 'Identify variables', minutes: 15, body: `Analyze which motor, sensor, or parameter can change ${subject}'s result. Ask for a prediction.`}, {kind: 'cre', title: 'Plan the first test', minutes: 25, body: `Build or review ${subject}, run a controlled test, and record the initial value without changing multiple variables.`}, {kind: 'ref', title: 'Read the baseline', minutes: 10, body: `Compare the result with the goal and formulate a debugging question.`}],
      [{kind: 'act', title: 'Choose what to change', minutes: 10, body: `Review ${subject}'s previous result and decide which variable best explains the error in ${context}.`}, {kind: 'exp', title: 'Design a test', minutes: 15, body: `Define what stays the same, what changes, and how the effect will be measured.`}, {kind: 'cre', title: 'Debug with data', minutes: 25, body: `Run at least two tests of ${subject}, record value, error, and adjustment, then compare the response.`}, {kind: 'ref', title: 'Compare before and after', minutes: 10, body: `Explain which data supports the decision and what should be tested next.`}],
      [{kind: 'act', title: 'Review the evidence', minutes: 10, body: `Organize ${subject}'s results and return to the goal defined for ${context}.`}, {kind: 'exp', title: 'Select the improvement', minutes: 15, body: `Compare two possible adjustments and argue which offers more accuracy, stability, or efficiency.`}, {kind: 'cre', title: 'Calibrate and verify', minutes: 25, body: `Apply the selected adjustment, repeat the test, and complete the comparison with enough data.`}, {kind: 'ref', title: 'Justify the decision', minutes: 10, body: `Communicate what changed, what improved, and what limit remains.`}],
    ],
    '3-basico': [
      [{kind: 'act', title: 'Define the need', minutes: 10, body: `Define who experiences the problem of ${context}, what they need, and which constraint ${subject} must respect.`}, {kind: 'exp', title: 'Analyze the system', minutes: 15, body: `Break ${subject} into structure, inputs, process, and output. Identify what could be redesigned.`}, {kind: 'cre', title: 'State a hypothesis', minutes: 25, body: `Build a first version or scheme of ${subject}, linking a mechanical or code decision to the defined need.`}, {kind: 'ref', title: 'Agree on criteria', minutes: 10, body: `Check whether the criterion can judge the solution and explain what evidence is needed.`}],
      [{kind: 'act', title: 'Choose a design decision', minutes: 10, body: `Return to the need of ${context} and select which part of ${subject} will be redesigned.`}, {kind: 'exp', title: 'Model the solution', minutes: 15, body: `Represent the change with a diagram, pseudocode, or state scheme before building.`}, {kind: 'cre', title: 'Redesign and validate', minutes: 25, body: `Implement the change, test under the agreed constraint, and document one complete iteration.`}, {kind: 'ref', title: 'Defend the iteration', minutes: 10, body: `Explain which decision produced the change, what evidence proves it, and what limit remains.`}],
      [{kind: 'act', title: 'Prepare the defense', minutes: 10, body: `Organize the problem, criterion, and results of ${subject} to communicate the response to ${context}.`}, {kind: 'exp', title: 'Document the system', minutes: 15, body: `Complete the algorithm, diagram, or technical explanation so another person can understand the solution.`}, {kind: 'cre', title: 'Optimize under a constraint', minutes: 25, body: `Make one final improvement to ${subject} considering safety, accuracy, time, materials, or local impact.`}, {kind: 'ref', title: 'Communicate the impact', minutes: 10, body: `Present the solution, evidence, and one limitation. Explain how it could be tested in a Guatemalan community.`}],
    ],
  };
  return (isEnglish ? english : spanish)[grade][Math.min(sessionIndex, 2)];
}

/** Resolve all grade-dependent content in one place before the UI renders it. */
export function getGradeSessionPlan(session: SessionPlan, grade: GradeId, isEnglish = false): SessionPlan {
  const copy = getGradeCopy(session, grade, isEnglish);
  if (!copy) return session;
  const sessionIndex = Math.max(0, Math.min(copy.sessionTitles.length - 1, session.order - 1));
  const guidance = copy.blockGuidance[Math.min(sessionIndex, copy.blockGuidance.length - 1)];
  if (!guidance) return session;

  if (session.kind === 'guided') {
    const baseTitle = session.title.split(' · ')[0];
    const baseLocale = isEnglish ? localizeBase(session) : {};
    return {
      ...session,
      ...baseLocale,
      title: `${baseTitle} · ${copy.sessionTitles[sessionIndex]}`,
      purpose: copy.sessionPurposes[sessionIndex] || session.purpose,
      question: copy.sessionQuestions[sessionIndex] || copy.question,
      phases: createGradePhases(baseTitle, session.projectFocus || session.purpose, grade, sessionIndex, isEnglish),
      milestone: guidance.evidence,
      nextStep: sessionIndex === copy.blockGuidance.length - 1
        ? copy.extension
        : 'Cuando el grupo alcance este criterio, avance al siguiente momento de la ruta.',
      blocks: (session.blocks || []).map((block) => ({
        ...block,
        activities: `${guidance.focus}. ${guidance.teacherAction}`,
        checkpoint: guidance.evidence,
        title: isEnglish ? (block.kind === 'continuation' ? `Continuation · ${copy.sessionTitles[sessionIndex]}` : 'Main class') : block.title,
        continuation: sessionIndex === copy.blockGuidance.length - 1 ? copy.extension : (isEnglish ? enText(block.continuation) : block.continuation),
      })),
    };
  }

  const openChallenge = session.openChallenge;
  const targetBlocks = copy.openSuggestedBlocks;
  const sourceBlocks = session.blocks || [];
  const blockTitles = isEnglish ? ['Define and prototype', 'Test and adjust', 'Integrate and communicate'] : ['Definir y prototipar', 'Probar y ajustar', 'Integrar y comunicar'];
  const blocks: SessionBlock[] = Array.from({length: targetBlocks}, (_, index) => {
    const source = sourceBlocks[index] || sourceBlocks[sourceBlocks.length - 1];
    return source ? {
      ...source,
      id: `${session.id}-${grade}-b${index + 1}`,
      order: index + 1,
      kind: 'challenge' as const,
      title: blockTitles[index] || blockTitles[blockTitles.length - 1],
      activities: copy.sessionPurposes[Math.min(index, copy.sessionPurposes.length - 1)] || source.activities,
      checkpoint: copy.blockGuidance[Math.min(index, copy.blockGuidance.length - 1)]?.evidence || source.checkpoint,
    } : undefined;
  }).filter(Boolean) as SessionBlock[];

  const baseLocale = isEnglish ? localizeBase(session) : {};
  const localizedChallenge = isEnglish && openChallenge?.en ? openChallenge.en : openChallenge;
  return {
    ...session,
    ...baseLocale,
    title: `${session.title.split(' · ')[0]} · ${isEnglish ? 'Open challenge' : 'Desafío abierto'}`,
    purpose: copy.openChallenge,
    question: copy.question,
    blocks,
    openChallenge: localizedChallenge ? {
      ...localizedChallenge,
      need: copy.openNeed,
      challenge: copy.openChallenge,
      complexity: copy.openComplexity,
      suggestedBlocks: targetBlocks,
    } : undefined,
  };
}

export function validateModuleSessionPlans(plans: readonly SessionPlan[] = moduleSessionPlans): void {
  const moduleIds = guidedTopics.map(([moduleId]) => moduleId);
  const ids = new Set<string>();
  for (const moduleId of moduleIds) {
    const modulePlans = plans.filter((plan) => plan.moduleId === moduleId);
    const guided = modulePlans.filter((plan) => plan.kind === 'guided');
    const open = modulePlans.filter((plan) => plan.kind === 'open');
    if (guided.length !== 3 || open.length !== 1) throw new Error(`CiudadBots: módulo "${moduleId}" requiere tres sesiones guiadas y un desafío abierto variable.`);
    if (guided.some((plan) => !plan.blocks?.length || plan.blocks.length > 2) || open.some((plan) => !plan.openChallenge || !plan.blocks?.length || !plan.openChallenge.suggestedBlocks || plan.openChallenge.suggestedBlocks < 1 || plan.openChallenge.suggestedBlocks > 3 || plan.blocks.length !== plan.openChallenge.suggestedBlocks)) throw new Error(`CiudadBots: módulo "${moduleId}" tiene una ruta sin bloques válidos.`);
    for (const plan of modulePlans) {
      if (ids.has(plan.id)) throw new Error(`CiudadBots: identificador de sesión duplicado: "${plan.id}".`);
      ids.add(plan.id);
    }
  }
}

validateModuleSessionPlans();

export function validateGradeRoutes(plans: readonly SessionPlan[] = moduleSessionPlans): void {
  const grades: GradeId[] = ['1-basico', '2-basico', '3-basico'];
  for (const moduleId of guidedTopics.map(([id]) => id)) {
    const guided = plans.filter((plan) => plan.moduleId === moduleId && plan.kind === 'guided');
    for (const plan of guided) {
      const copies = grades.map((grade) => getGradeCopy(plan, grade));
      if (copies.some((copy) => !copy || copy.sessionTitles.length !== 3 || copy.blockGuidance.length !== 3)) {
        throw new Error(`CiudadBots: la sesión "${plan.id}" no tiene tres variantes completas por grado.`);
      }
      if (new Set(copies.map((copy) => copy?.routeLabel)).size !== grades.length) {
        throw new Error(`CiudadBots: la sesión "${plan.id}" repite el foco de ruta entre grados.`);
      }
    }
  }
}

validateGradeRoutes();

export function validateSessionPlans(plans: readonly SessionPlan[] = sessionPlans): void {
  const ids = new Set<string>();
  for (const session of plans) {
    if (!session.id || ids.has(session.id)) throw new Error(`CiudadBots: sesión inválida o duplicada: "${session.id}".`);
    if (session.duration !== 60) throw new Error(`CiudadBots: la sesión "${session.id}" debe durar 60 minutos.`);
    if (session.phases.length !== 4) throw new Error(`CiudadBots: la sesión "${session.id}" debe tener cuatro fases.`);
    if (!session.resources.length || !session.evidence.length) throw new Error(`CiudadBots: la sesión "${session.id}" requiere recursos y evidencias.`);
    if (!session.blocks?.length || session.blocks.some((block) => block.minutes !== 60)) throw new Error(`CiudadBots: la sesión "${session.id}" requiere bloques de 60 minutos.`);
    ids.add(session.id);
  }
}

validateSessionPlans();

export function getSessionPlansForModule(moduleId: string): readonly SessionPlan[] {
  return sessionPlans.filter((session) => session.moduleId === moduleId);
}

export function getSessionPlan(id: string): SessionPlan | undefined {
  return sessionPlans.find((session) => session.id === id);
}
