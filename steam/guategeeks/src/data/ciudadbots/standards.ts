import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type {Locale} from './titles';

// Shared CNB / international-standards content, authored once per locale and
// reused across all 12 modules and the overview page (almost none of it is
// module-specific — only the achievement-indicators table substitutes the
// module's own title). Locale-keyed per openspec design for
// `neutralize-module-names-i18n` Decision 3: small, slow-changing reference
// tables are an accepted exception to "narrative lives in per-locale MDX."

/** A labelled area + descriptive text, used for CNB/standards summary grids. */
export interface AreaText {
  area: string;
  text: string;
}

/** A mini-card: title + text, optionally linking out to a source. */
export interface LinkCard {
  title: string;
  text: string;
  href?: string;
  linkLabel?: string;
}

/** One row of a grade-comparison table; first row is the header. */
export type ImpactRow = readonly [string, string, string, string];

export interface BasicoLevel {
  heading: string;
  goal: string;
  items: readonly string[];
}

export interface ScopeOption {
  title: string;
  text: string;
}

interface StandardsContent {
  depthByGradeNote: string;
  maturityByGrade: readonly ImpactRow[];
  cnbOfficialCompetencies: readonly AreaText[];
  achievementNoteFor: (moduleTitle: string) => string;
  achievementIndicators: (moduleTitle: string) => readonly ImpactRow[];
  cnbSourceLinks: readonly LinkCard[];
  impactReportingNote: string;
  internationalCards: readonly AreaText[];
  internationalProgression: readonly ImpactRow[];
  internationalEvidence: readonly ImpactRow[];
  internationalSourceCards: readonly LinkCard[];
  basicoLevels: readonly BasicoLevel[];
  basicoComparison: readonly ImpactRow[];
  transversalCnb: readonly AreaText[];
  scopeOptions: readonly ScopeOption[];
}

const es: StandardsContent = {
  depthByGradeNote:
    'La planificación está pensada para Ciclo Básico. El mismo módulo puede trabajarse en 1.º, 2.º o 3.º básico, pero cambia el nivel de profundidad esperado: en 1.º se prioriza comprensión y ejecución guiada; en 2.º se exige análisis, medición y mejora; en 3.º se espera diseño autónomo, documentación técnica y transferencia a problemas reales.',

  maturityByGrade: [
    ['Nivel', 'Lo que debe cumplir', 'Evidencia observable', 'Medición de impacto'],
    [
      '1.º básico',
      'Comprende el problema, arma el robot con guía, identifica sensores/motores y ejecuta un programa funcional.',
      'Bitácora con pasos, robot armado, programa base probado y explicación oral simple.',
      'Lista de cotejo: construcción, conexión, secuencia lógica, colaboración y vocabulario técnico inicial.',
    ],
    [
      '2.º básico',
      'Ajusta parámetros, mide resultados, usa datos de prueba y explica la relación entre mecanismo, sensor y código.',
      'Tabla de intentos, cambios de valores, comparación antes/después y justificación del ajuste.',
      'Rúbrica: precisión, depuración, uso de medición, interpretación de sensores y trabajo por roles.',
    ],
    [
      '3.º básico',
      'Rediseña o amplía la solución, documenta el algoritmo y conecta el proyecto con una necesidad real de Guatemala.',
      'Prototipo mejorado, diagrama o pseudocódigo, presentación técnica y propuesta de aplicación comunitaria.',
      'Proyecto: funcionalidad, innovación, evidencia de iteración, comunicación técnica e impacto social.',
    ],
  ],

  cnbOfficialCompetencies: [
    {
      area: 'Matemática · Básico',
      text: 'El CNB de Básico enfatiza producir y analizar información mediante patrones, relaciones, representación gráfica, modelos y resolución de problemas. En 3.º básico crece la aplicación de modelos algebraicos y geométricos para justificar soluciones.',
    },
    {
      area: 'Ciencias Naturales',
      text: 'El ciclo básico pide usar saberes científicos y tecnológicos para explicar fenómenos del entorno, comprender relaciones entre sistemas naturales y acción humana, y actuar con criterios de prevención, seguridad y conservación.',
    },
    {
      area: 'Tecnologías del Aprendizaje y la Comunicación',
      text: 'El área TAC aporta uso responsable de herramientas digitales, trabajo colaborativo, análisis de datos, documentación multimedia y propuestas tecnológicas para problemas educativos o comunitarios.',
    },
    {
      area: 'Comunicación y Lenguaje, Idioma Español',
      text: 'Se espera escuchar, hablar, leer y escribir para construir conocimiento técnico y científico, usar códigos verbales y digitales, y producir textos o informes para explicar procesos y resolver problemas.',
    },
    {
      area: 'Emprendimiento para la Productividad',
      text: 'El CNB orienta a formular proyectos viables que mejoren la calidad de vida, con pertinencia cultural, organización del trabajo, toma de decisiones y conexión con necesidades reales del entorno.',
    },
  ],

  achievementNoteFor: (moduleTitle: string) =>
    `Estos indicadores aterrizan las competencias del CNB de Básico al trabajo observable dentro de ${moduleTitle}. No sustituyen el plan de área del centro educativo; sirven como puente para planificar, evaluar y reportar avance.`,

  achievementIndicators: (moduleTitle: string) => [
    ['Grado', 'Competencias CNB afines', `Indicadores de logro sugeridos para ${moduleTitle}`, 'Evidencia esperada'],
    [
      '1.º básico',
      'Comprende relaciones entre forma, medida, secuencia, causa-efecto y comunicación del proceso.',
      'Construye el robot con guía, sigue la secuencia del reto, reconoce componentes y explica con lenguaje sencillo qué hace cada bloque o mecanismo.',
      'Robot armado, programa base funcional, explicación oral breve y bitácora con pasos completados.',
    ],
    [
      '2.º básico',
      'Analiza datos, ajusta procedimientos, usa recursos tecnológicos con intención y comunica decisiones con evidencia.',
      `Mide, compara intentos, depura valores, interpreta el efecto de sensor o mecanismo y justifica al menos un ajuste hecho durante ${moduleTitle}.`,
      'Tabla de pruebas, cambios registrados, mejora observable entre intentos y explicación técnica del ajuste.',
    ],
    [
      '3.º básico',
      'Aplica modelos, propone soluciones viables, documenta procesos y vincula tecnología con impacto local.',
      `Rediseña o amplía ${moduleTitle}, documenta el algoritmo o flujo de control y argumenta cómo el proyecto responde a una necesidad de Guatemala.`,
      'Prototipo mejorado, diagrama o pseudocódigo, evidencia de iteración y presentación con justificación del impacto.',
    ],
  ],

  cnbSourceLinks: [
    {
      title: 'Fuente oficial CNB · Ciclo Básico',
      text: 'Síntesis docente construida a partir del portal oficial del CNB para Ciclo Básico y su listado de competencias por área y grado.',
      href: 'https://cnbguatemala.org/wiki/CNB_Ciclo_B%C3%A1sico',
      linkLabel: 'Ver CNB Ciclo Básico',
    },
    {
      title: 'Competencias por área y grado',
      text: 'Referencia oficial usada para aterrizar competencias afines de Matemática, Ciencias Naturales, TAC, Comunicación y Emprendimiento dentro del programa.',
      href: 'https://cnbguatemala.org/wiki/CNB_Ciclo_B%C3%A1sico/Todas_las_competencias_por_%C3%A1rea_y_grado',
      linkLabel: 'Ver competencias oficiales',
    },
  ],

  impactReportingNote:
    'Registrar por equipo una evidencia de programación, una evidencia de ingeniería y una evidencia de comunicación. Con esas tres piezas se puede reportar avance frente a ISTE, CSTA 2026 y NGSS sin convertir la clase en una lista de contenidos aislados.',

  internationalCards: [
    {
      area: 'ISTE Students',
      text: 'Diseñador innovador, pensador computacional, comunicador creativo, colaborador global y aprendiz empoderado.',
    },
    {
      area: 'CSTA 2026 PK-12 · Secundaria',
      text: 'Algoritmos y diseño, programación, datos y análisis, sistemas y seguridad, computación y sociedad, con prácticas de colaboración inclusiva y diseño centrado en personas.',
    },
    {
      area: 'NGSS MS-ETS1',
      text: 'Definir problemas, evaluar soluciones, analizar datos de prueba y optimizar diseños de ingeniería.',
    },
    {
      area: 'Competencias globales STEAM',
      text: 'Colaboración, creatividad, comunicación, pensamiento crítico, prototipado e iteración con evidencia.',
    },
  ],

  internationalProgression: [
    ['Nivel', 'ISTE', 'CSTA', 'NGSS / Ingeniería'],
    [
      '1.º básico',
      'Usa tecnología para aprender, crear una solución guiada y comunicar lo que construyó.',
      'Crea secuencias, eventos y ciclos simples; reconoce hardware, sensores, salida del sistema y prueba cambios básicos.',
      'Define el problema con criterios simples: qué debe hacer el robot, con qué materiales y bajo qué restricción.',
    ],
    [
      '2.º básico',
      'Usa retroalimentación para mejorar el prototipo y comunica decisiones con evidencia.',
      'Aplica condicionales, subrutinas, sensores, variables, datos de prueba y depuración sistemática.',
      'Compara soluciones o versiones usando criterios: precisión, seguridad, tiempo, estabilidad y confiabilidad.',
    ],
    [
      '3.º básico',
      'Diseña una solución propia, trabaja colaborativamente y presenta impacto local o comunitario.',
      'Documenta algoritmos modulares, variables/estados, datos de desempeño, decisiones de diseño e impacto social de la automatización.',
      'Analiza datos de pruebas para optimizar el diseño y justificar la versión final.',
    ],
  ],

  internationalEvidence: [
    ['Medición', '1.º básico', '2.º básico', '3.º básico'],
    [
      'Evidencia técnica',
      'Programa ejecutado, robot funcional y explicación de bloques básicos.',
      'Bitácora con cambios de parámetros, errores y mejoras.',
      'Diagrama, pseudocódigo o documentación del sistema completo.',
    ],
    [
      'Evidencia de ingeniería',
      'Identifica criterios del reto y verifica si el robot cumple la misión.',
      'Compara intentos con datos: distancia, tiempo, precisión o lectura de sensor.',
      'Optimiza una solución y justifica decisiones según restricciones reales.',
    ],
    [
      'Evidencia de comunicación',
      'Describe qué hizo el robot y qué aprendió.',
      'Explica por qué hizo un ajuste y qué evidencia lo respalda.',
      'Presenta una solución técnica conectada con una necesidad de Guatemala.',
    ],
  ],

  internationalSourceCards: [
    {
      title: 'ISTE Standards for Students',
      text: 'Referencia para creatividad digital, pensamiento computacional, colaboración y comunicación.',
      href: 'https://iste.org/standards/students',
      linkLabel: 'Consultar ISTE',
    },
    {
      title: '2026 CSTA PK-12 Computer Science Standards',
      text: 'Referencia para algoritmos y diseño, programación, datos y análisis, sistemas y seguridad, computación y sociedad.',
      href: 'https://csteachers.org/pk12standards/view/',
      linkLabel: 'Consultar CSTA',
    },
    {
      title: 'NGSS MS-ETS1 Engineering Design',
      text: 'Referencia para definir problemas, comparar soluciones, analizar pruebas y optimizar diseños.',
      href: 'https://www.nextgenscience.org/msets1-engineering-design',
      linkLabel: 'Consultar NGSS',
    },
    {
      title: 'Uso GuateGeeks',
      text: 'Estas referencias se traducen a evidencias de aula: robot funcional, programa explicado, datos de prueba, mejora iterativa y presentación técnica.',
    },
  ],

  basicoLevels: [
    {
      heading: '1.º básico · Exploración guiada',
      goal: 'Meta: que el estudiante pase de usuario a constructor/programador inicial.',
      items: [
        'Reconoce componentes: hub, motor, sensor y mecanismo.',
        'Sigue instrucciones de construcción con roles.',
        'Ejecuta secuencias y ciclos simples.',
        'Explica causa y efecto: bloque, movimiento, sensor.',
      ],
    },
    {
      heading: '2.º básico · Análisis y mejora',
      goal: 'Meta: que el estudiante mida, compare y mejore con evidencia.',
      items: [
        'Registra datos de pruebas y errores.',
        'Ajusta grados, tiempos, distancias o umbrales.',
        'Usa condicionales, subrutinas y sensores con intención.',
        'Relaciona diseño mecánico con desempeño.',
      ],
    },
    {
      heading: '3.º básico · Diseño e impacto',
      goal: 'Meta: que el estudiante proponga soluciones propias conectadas con Guatemala.',
      items: [
        'Rediseña una parte del robot o misión.',
        'Documenta algoritmo, decisiones y pruebas.',
        'Evalúa seguridad, eficiencia e impacto social.',
        'Presenta una solución técnica con evidencia.',
      ],
    },
  ],

  basicoComparison: [
    ['Eje', '1.º básico', '2.º básico', '3.º básico'],
    [
      'Pensamiento computacional',
      'Secuencia, evento y ciclo simple.',
      'Condicionales, sensores, subrutinas y depuración.',
      'Algoritmos modulares, variables, estados y documentación.',
    ],
    [
      'Matemática aplicada',
      'Medir distancia, contar repeticiones y reconocer ángulos.',
      'Calcular, comparar intentos y ajustar parámetros.',
      'Modelar relaciones, optimizar y justificar con datos.',
    ],
    [
      'Ciencia e ingeniería',
      'Identificar fuerza, movimiento, sensores y mecanismos.',
      'Explicar cómo el mecanismo afecta el resultado.',
      'Rediseñar bajo criterios de seguridad, eficiencia e impacto.',
    ],
    [
      'Comunicación',
      'Describe qué construyó y qué hace el robot.',
      'Explica decisiones, errores y ajustes.',
      'Presenta una solución con lenguaje técnico y evidencia.',
    ],
  ],

  transversalCnb: [
    {
      area: 'Matemática',
      text: 'Medición, geometría, proporcionalidad, variables, tablas de datos, estimación, análisis de error y solución de problemas.',
    },
    {
      area: 'Ciencias Naturales',
      text: 'Movimiento, fuerza, energía, sensores, máquinas simples, seguridad, ambiente y relación entre tecnología y comunidad.',
    },
    {
      area: 'Tecnologías del Aprendizaje y la Comunicación',
      text: 'Programación por bloques, uso responsable del kit y el hub, documentación digital, tablas de prueba, colaboración en archivos y presentación multimedia de soluciones.',
    },
    {
      area: 'Comunicación y Lenguaje, Idioma Español',
      text: 'Bitácora, explicación oral, argumentación, vocabulario técnico, presentación de evidencias y comunicación de resultados.',
    },
    {
      area: 'Emprendimiento para la Productividad',
      text: 'Diseño de soluciones, trabajo colaborativo, tecnología aplicada, mejora continua, innovación e impacto en necesidades locales.',
    },
  ],

  scopeOptions: [
    {
      title: 'Ruta compacta · 12 sesiones',
      text: 'Úsela cuando necesite una visión general del programa o una implementación breve de introducción.',
    },
    {
      title: 'Ruta estándar · 24 sesiones',
      text: 'Úsela cuando quiera dedicar una sesión a construcción/programación y otra a mejora o reto aplicado.',
    },
    {
      title: 'Ruta extendida · 36+ sesiones',
      text: 'Úsela cuando desee trabajar contexto, construcción, reto libre y presentación con más profundidad.',
    },
    {
      title: 'Ruta por proyectos',
      text: 'Úsela para seleccionar solo los módulos que mejor se ajusten a sus metas, tiempo y disponibilidad de kits.',
    },
  ],
};

const en: StandardsContent = {
  depthByGradeNote:
    'Planning is designed for lower-secondary (Ciclo Básico). The same module can be taught at grade 7, 8, or 9, but the expected depth changes: grade 7 prioritizes guided comprehension and execution; grade 8 requires analysis, measurement, and improvement; grade 9 expects autonomous design, technical documentation, and transfer to real problems.',

  maturityByGrade: [
    ['Level', 'What it must meet', 'Observable evidence', 'Impact measurement'],
    [
      'Grade 7',
      'Understands the problem, builds the robot with guidance, identifies sensors/motors, and runs a working program.',
      'Step-by-step log, assembled robot, tested base program, and a simple oral explanation.',
      'Checklist: construction, wiring, logical sequence, collaboration, and initial technical vocabulary.',
    ],
    [
      'Grade 8',
      'Adjusts parameters, measures results, uses test data, and explains the relationship between mechanism, sensor, and code.',
      'Trial table, value changes, before/after comparison, and justification for the adjustment.',
      'Rubric: precision, debugging, use of measurement, sensor interpretation, and teamwork by role.',
    ],
    [
      'Grade 9',
      'Redesigns or extends the solution, documents the algorithm, and connects the project to a real need in Guatemala.',
      'Improved prototype, diagram or pseudocode, technical presentation, and a proposed community application.',
      'Project: functionality, innovation, evidence of iteration, technical communication, and social impact.',
    ],
  ],

  cnbOfficialCompetencies: [
    {
      area: 'Mathematics · Lower Secondary',
      text: "Guatemala's national curriculum (CNB) for lower secondary emphasizes producing and analyzing information through patterns, relationships, graphical representation, models, and problem solving. By grade 9, the application of algebraic and geometric models to justify solutions grows.",
    },
    {
      area: 'Natural Sciences',
      text: 'Lower secondary calls for using scientific and technological knowledge to explain everyday phenomena, understand the relationship between natural systems and human action, and act on criteria of prevention, safety, and conservation.',
    },
    {
      area: 'Learning and Communication Technologies',
      text: 'The TAC area supports responsible use of digital tools, collaborative work, data analysis, multimedia documentation, and technology proposals for educational or community problems.',
    },
    {
      area: 'Communication and Language, Spanish',
      text: 'Students are expected to listen, speak, read, and write to build technical and scientific knowledge, use verbal and digital codes, and produce texts or reports that explain processes and solve problems.',
    },
    {
      area: 'Entrepreneurship for Productivity',
      text: "The CNB points toward formulating viable projects that improve quality of life, with cultural relevance, work organization, decision-making, and a connection to real needs in the student's environment.",
    },
  ],

  achievementNoteFor: (moduleTitle: string) =>
    `These indicators translate lower-secondary CNB competencies into observable work within ${moduleTitle}. They don't replace your school's own subject plan — they're a bridge for planning, assessing, and reporting progress.`,

  achievementIndicators: (moduleTitle: string) => [
    ['Grade', 'Related CNB competencies', `Suggested achievement indicators for ${moduleTitle}`, 'Expected evidence'],
    [
      'Grade 7',
      'Understands relationships between shape, measurement, sequence, cause-and-effect, and communicating the process.',
      'Builds the robot with guidance, follows the challenge sequence, recognizes components, and explains in simple language what each block or mechanism does.',
      'Assembled robot, working base program, brief oral explanation, and a log with completed steps.',
    ],
    [
      'Grade 8',
      'Analyzes data, adjusts procedures, uses technology resources with intent, and communicates decisions with evidence.',
      `Measures, compares attempts, debugs values, interprets the effect of a sensor or mechanism, and justifies at least one adjustment made during ${moduleTitle}.`,
      'Test table, recorded changes, observable improvement between attempts, and a technical explanation of the adjustment.',
    ],
    [
      'Grade 9',
      'Applies models, proposes viable solutions, documents processes, and links technology to local impact.',
      `Redesigns or extends ${moduleTitle}, documents the algorithm or control flow, and argues how the project responds to a need in Guatemala.`,
      'Improved prototype, diagram or pseudocode, evidence of iteration, and a presentation justifying the impact.',
    ],
  ],

  cnbSourceLinks: [
    {
      title: 'Official CNB source · Lower Secondary (Ciclo Básico)',
      text: "Teacher-facing synthesis built from Guatemala's official CNB portal for lower secondary and its competency listing by subject and grade.",
      href: 'https://cnbguatemala.org/wiki/CNB_Ciclo_B%C3%A1sico',
      linkLabel: 'View CNB Ciclo Básico',
    },
    {
      title: 'Competencies by subject and grade',
      text: 'Official reference used to ground related Mathematics, Natural Sciences, TAC, Communication, and Entrepreneurship competencies within the program.',
      href: 'https://cnbguatemala.org/wiki/CNB_Ciclo_B%C3%A1sico/Todas_las_competencias_por_%C3%A1rea_y_grado',
      linkLabel: 'View official competencies',
    },
  ],

  impactReportingNote:
    "Have each team record one piece of programming evidence, one piece of engineering evidence, and one piece of communication evidence. Those three pieces let you report progress against ISTE, CSTA 2026, and NGSS without turning the class into a checklist of isolated content.",

  internationalCards: [
    {
      area: 'ISTE Students',
      text: 'Innovative designer, computational thinker, creative communicator, global collaborator, and empowered learner.',
    },
    {
      area: 'CSTA 2026 PK-12 · Middle school',
      text: 'Algorithms and design, programming, data and analysis, systems and security, computing and society, with practices for inclusive collaboration and human-centered design.',
    },
    {
      area: 'NGSS MS-ETS1',
      text: 'Define problems, evaluate solutions, analyze test data, and optimize engineering designs.',
    },
    {
      area: 'Global STEAM competencies',
      text: 'Collaboration, creativity, communication, critical thinking, prototyping, and iteration backed by evidence.',
    },
  ],

  internationalProgression: [
    ['Level', 'ISTE', 'CSTA', 'NGSS / Engineering'],
    [
      'Grade 7',
      'Uses technology to learn, build a guided solution, and communicate what they built.',
      'Creates simple sequences, events, and loops; recognizes hardware, sensors, system output, and basic testing changes.',
      'Defines the problem with simple criteria: what the robot must do, with what materials, and under what constraint.',
    ],
    [
      'Grade 8',
      'Uses feedback to improve the prototype and communicates decisions with evidence.',
      'Applies conditionals, subroutines, sensors, variables, test data, and systematic debugging.',
      'Compares solutions or versions using criteria: precision, safety, time, stability, and reliability.',
    ],
    [
      'Grade 9',
      'Designs their own solution, works collaboratively, and presents local or community impact.',
      'Documents modular algorithms, variables/states, performance data, design decisions, and the social impact of automation.',
      'Analyzes test data to optimize the design and justify the final version.',
    ],
  ],

  internationalEvidence: [
    ['Measurement', 'Grade 7', 'Grade 8', 'Grade 9'],
    [
      'Technical evidence',
      'Program runs, robot works, and basic blocks are explained.',
      'Log with parameter changes, errors, and improvements.',
      'Diagram, pseudocode, or documentation of the full system.',
    ],
    [
      'Engineering evidence',
      "Identifies the challenge's criteria and checks whether the robot meets the mission.",
      'Compares attempts using data: distance, time, precision, or sensor reading.',
      'Optimizes a solution and justifies decisions against real constraints.',
    ],
    [
      'Communication evidence',
      'Describes what the robot did and what they learned.',
      'Explains why they made an adjustment and what evidence supports it.',
      'Presents a technical solution connected to a need in Guatemala.',
    ],
  ],

  internationalSourceCards: [
    {
      title: 'ISTE Standards for Students',
      text: 'Reference for digital creativity, computational thinking, collaboration, and communication.',
      href: 'https://iste.org/standards/students',
      linkLabel: 'Visit ISTE',
    },
    {
      title: '2026 CSTA PK-12 Computer Science Standards',
      text: 'Reference for algorithms and design, programming, data and analysis, systems and security, computing and society.',
      href: 'https://csteachers.org/pk12standards/view/',
      linkLabel: 'Visit CSTA',
    },
    {
      title: 'NGSS MS-ETS1 Engineering Design',
      text: 'Reference for defining problems, comparing solutions, analyzing tests, and optimizing designs.',
      href: 'https://www.nextgenscience.org/msets1-engineering-design',
      linkLabel: 'Visit NGSS',
    },
    {
      title: 'How GuateGeeks uses this',
      text: 'These references translate into classroom evidence: a working robot, an explained program, test data, iterative improvement, and a technical presentation.',
    },
  ],

  basicoLevels: [
    {
      heading: 'Grade 7 · Guided exploration',
      goal: 'Goal: move the student from user to first-time builder/programmer.',
      items: [
        'Recognizes components: hub, motor, sensor, and mechanism.',
        'Follows build instructions working in roles.',
        'Runs simple sequences and loops.',
        'Explains cause and effect: block, movement, sensor.',
      ],
    },
    {
      heading: 'Grade 8 · Analysis and improvement',
      goal: 'Goal: the student measures, compares, and improves with evidence.',
      items: [
        'Logs test data and errors.',
        'Adjusts degrees, timing, distances, or thresholds.',
        'Uses conditionals, subroutines, and sensors with intent.',
        'Relates mechanical design to performance.',
      ],
    },
    {
      heading: 'Grade 9 · Design and impact',
      goal: 'Goal: the student proposes their own solutions connected to a real community.',
      items: [
        'Redesigns part of the robot or mission.',
        'Documents the algorithm, decisions, and tests.',
        'Evaluates safety, efficiency, and social impact.',
        'Presents a technical solution with evidence.',
      ],
    },
  ],

  basicoComparison: [
    ['Axis', 'Grade 7', 'Grade 8', 'Grade 9'],
    [
      'Computational thinking',
      'Simple sequence, event, and loop.',
      'Conditionals, sensors, subroutines, and debugging.',
      'Modular algorithms, variables, states, and documentation.',
    ],
    [
      'Applied mathematics',
      'Measure distance, count repetitions, and recognize angles.',
      'Calculate, compare attempts, and adjust parameters.',
      'Model relationships, optimize, and justify with data.',
    ],
    [
      'Science and engineering',
      'Identify force, motion, sensors, and mechanisms.',
      'Explain how the mechanism affects the result.',
      'Redesign under criteria of safety, efficiency, and impact.',
    ],
    [
      'Communication',
      'Describes what they built and what the robot does.',
      'Explains decisions, errors, and adjustments.',
      'Presents a solution using technical language and evidence.',
    ],
  ],

  transversalCnb: [
    {
      area: 'Mathematics',
      text: 'Measurement, geometry, proportionality, variables, data tables, estimation, error analysis, and problem solving.',
    },
    {
      area: 'Natural Sciences',
      text: 'Motion, force, energy, sensors, simple machines, safety, environment, and the relationship between technology and community.',
    },
    {
      area: 'Learning and Communication Technologies',
      text: 'Block programming, responsible kit and hub use, digital documentation, test tables, shared files, and multimedia presentation of solutions.',
    },
    {
      area: 'Communication and Language, Spanish',
      text: 'Logs, oral explanation, argumentation, technical vocabulary, presenting evidence, and communicating results.',
    },
    {
      area: 'Entrepreneurship for Productivity',
      text: 'Solution design, collaborative work, applied technology, continuous improvement, innovation, and impact on local needs.',
    },
  ],

  scopeOptions: [
    {
      title: 'Compact track · 12 sessions',
      text: 'Use this for a general overview of the program or a brief introductory implementation.',
    },
    {
      title: 'Standard track · 24 sessions',
      text: 'Use this to dedicate one session to building/programming and another to improvement or an applied challenge.',
    },
    {
      title: 'Extended track · 36+ sessions',
      text: 'Use this to work through context, construction, an open-ended challenge, and a presentation in more depth.',
    },
    {
      title: 'Project-based track',
      text: 'Use this to select only the modules that best fit your goals, time, and kit availability.',
    },
  ],
};

const contentByLocale: Record<Locale, StandardsContent> = {es, en};

/** Read the current locale's shared standards/CNB content. */
export function useStandardsContent(): StandardsContent {
  const {i18n} = useDocusaurusContext();
  return contentByLocale[i18n.currentLocale as Locale] ?? es;
}
