export interface CurriculumArea {
  area: string;
  text: string;
}

export interface CurriculumLink {
  title: string;
  text: string;
  href?: string;
  linkLabel?: string;
}

export type CurriculumRow = readonly string[];

export interface SmarsCurriculumContent {
  readingNote: string;
  levelProgression: readonly CurriculumRow[];
  cnbCompetencies: readonly CurriculumArea[];
  axes: readonly CurriculumArea[];
  indicators: readonly CurriculumRow[];
  internationalCards: readonly CurriculumArea[];
  internationalProgression: readonly CurriculumRow[];
  internationalEvidence: readonly CurriculumRow[];
  sourceLinks: readonly CurriculumLink[];
  reportingNote: string;
}

const es: SmarsCurriculumContent = {
  readingNote:
    'Esta alineación integra el área común del Bachillerato en Ciencias y Letras con la orientación en Computación. El programa trabaja 4.º y 5.º con referentes directos del CNB.',

  levelProgression: [
    ['Nivel', 'Propósito formativo', 'Indicadores observables', 'Evidencia para seguimiento'],
    [
      '4.º bachillerato',
      'Comprender sistemas, energía, seguridad, fabricación y control inicial.',
      'Identifica componentes, sigue procedimientos, registra mediciones y explica el funcionamiento de un subsistema.',
      'Diagrama, checklist, tabla de mediciones, piezas verificadas y primeras pruebas.',
    ],
    [
      '5.º bachillerato',
      'Programar, medir, depurar y mejorar con datos.',
      'Relaciona código, sensores y movimiento; compara ensayos; justifica cambios y documenta el proceso.',
      'Sketch anotado, datos del sensor, mapa de estados, umbral justificado y calibración.',
    ],
  ],

  cnbCompetencies: [
    {
      area: 'Física · 4.º · Competencia 1',
      text: 'Utiliza el cálculo vectorial para interpretar cantidades físicas. Se aplica de forma focalizada al sentido, magnitud y resultante de las velocidades de las dos orugas; no se afirma que Curiosity cubra toda la competencia.',
    },
    {
      area: 'Física · 4.º · Competencia 4',
      text: 'Aplica principios de energía en problemas cotidianos. Curiosity aporta una experiencia concreta de circuito, polaridad, alimentación, driver y verificación antes de energizar.',
    },
    {
      area: 'Elaboración y Gestión de Proyectos · 4.º',
      text: 'Determina problemas, identifica fases del proyecto y planifica su ejecución. La secuencia de Curiosity convierte el diseño, la fabricación, las pruebas y la misión en un proyecto documentado.',
    },
    {
      area: 'Computación Aplicada · 4.º',
      text: 'Reconoce hardware, software y el uso de herramientas para resolver tareas. El estudiante distingue controlador, driver, sensores, actuadores, sketch y entorno de programación.',
    },
    {
      area: 'Laboratorio I · 4.º',
      text: 'Utiliza herramientas de laboratorio para crear documentos, hojas de cálculo, tablas y gráficos. Las bitácoras, tablas de tolerancias, pruebas del sensor y registros de calibración generan esa evidencia.',
    },
    {
      area: 'Seminario · Investigación-Acción · 5.º',
      text: 'Formula, ejecuta y evalúa un proyecto con base en evidencia. El reto integrador y el showcase permiten transferir el robot a una necesidad o problema definido por la institución.',
    },
    {
      area: 'Producción de Contenidos Digitales · 5.º',
      text: 'Documenta y comunica procesos mediante productos digitales. El video de la misión, el reporte técnico y la presentación final constituyen evidencia cuando se elaboran con propósito y audiencia definida.',
    },
  ],

  axes: [
    {
      area: 'Pensamiento computacional',
      text: 'Descomposición de sistemas, entradas y salidas, variables, funciones, estados, depuración, automatización y predicción del comportamiento.',
    },
    {
      area: 'Ciencia, tecnología e ingeniería',
      text: 'Energía, circuitos, movimiento, tracción diferencial, sensores, medición, error, seguridad y optimización de una solución.',
    },
    {
      area: 'Matemática aplicada',
      text: 'Unidades, relaciones entre variables, velocidades, ángulos, tablas, rangos, comparación de ensayos y decisiones sustentadas en datos.',
    },
    {
      area: 'Diseño y gestión de proyectos',
      text: 'Planificación, roles, restricciones, fabricación digital, control de calidad, iteración, seguimiento y mejora continua.',
    },
    {
      area: 'Comunicación técnica',
      text: 'Bitácora, diagramas, código comentado, reportes, video, exposición oral, vocabulario técnico y defensa de decisiones.',
    },
  ],

  indicators: [
    ['Indicador de logro de referencia', 'Aplicación en Curiosity', 'Evidencia observable', 'Alcance'],
    [
      'EGP 2.2 · Identifica las principales fases de un proyecto.',
      'Reconoce comprender, diseñar, construir, programar, probar, calibrar y presentar como fases relacionadas.',
      'Mapa de ruta, cronograma de bloques y bitácora del equipo.',
      'Directo · 4.º-5.º',
    ],
    [
      'EGP 3.1-3.2 · Planifica actividades y redacta objetivos.',
      'Define el reto autónomo, criterios de éxito, roles, materiales, restricciones y objetivo de la misión.',
      'Plan de trabajo y ficha de reto antes de la demostración.',
      'Directo · 4.º-5.º',
    ],
    [
      'Física 4.º 1.1-1.2 · Interpreta y opera con cantidades vectoriales.',
      'Explica cómo la velocidad de cada oruga produce avance, giro o trayectoria curva.',
      'Diagrama de vectores, tabla de pruebas y explicación de la trayectoria.',
      'Focalizado · 4.º-5.º',
    ],
    [
      'Laboratorio I 4.º 1.1-1.2 y 4.5-4.6 · Crea documentos, hojas, fórmulas y gráficos.',
      'Organiza mediciones de impresión, motores, sensor y calibración en formatos legibles.',
      'Tablas, fórmulas, gráficos o reporte técnico del equipo.',
      'Directo · 4.º-5.º',
    ],
    [
      'Seminario 5.º 3.3.3-3.3.8 · Integra fuentes, formula, ejecuta y evalúa un proyecto.',
      'Sustenta la misión con datos del proceso y evalúa el resultado frente a criterios acordados.',
      'Reporte final, video, presentación y reflexión sobre la siguiente versión.',
      'Directo · 5.º',
    ],
  ],

  internationalCards: [
    {
      area: 'ISTE Students',
      text: 'Innovative Designer, Computational Thinker, Creative Communicator, Knowledge Constructor y Empowered Learner, traducidos a diseño, programación, documentación y reflexión.',
    },
    {
      area: 'CSTA PK–12 (2026) · High School y Physical Computing',
      text: 'La versión 2026 organiza la alineación por Systems & Security, Programming, Data & Analysis y Physical Computing, además de las prácticas de abstracción, creación, prueba, refinamiento y gestión colaborativa de proyectos.',
    },
    {
      area: 'NGSS HS-ETS1 y HS-PS2',
      text: 'Definir problemas con criterios y restricciones, evaluar y optimizar soluciones, y relacionar fuerza, masa, movimiento y aceleración cuando el docente lo desarrolle explícitamente.',
    },
  ],

  internationalProgression: [
    ['Nivel', 'Pensamiento computacional', 'Ingeniería y datos', 'Comunicación'],
    [
      '4.º bachillerato',
      'Reconoce hardware/software, descompone el robot y sigue una estrategia de prueba.',
      'Mide, clasifica piezas y verifica criterios de seguridad y funcionamiento.',
      'Explica subsistemas mediante diagramas, checklist y bitácora.',
    ],
    [
      '5.º bachillerato',
      'Interpreta estados, modifica parámetros y depura relacionando causa y efecto.',
      'Analiza datos del sensor y motores, compara ensayos y calibra con evidencia.',
      'Documenta cambios, resultados y justificaciones técnicas.',
    ],
  ],

  internationalEvidence: [
    ['Medición', '4.º bachillerato', '5.º bachillerato'],
    ['Evidencia técnica', 'Diagrama, checklist y pruebas guiadas.', 'Código, datos, depuración, calibración y arquitectura justificada.'],
    ['Evidencia de ingeniería', 'Piezas aceptadas, robot ensamblado y criterio de seguridad.', 'Comparación de ensayos, error, mejora con parámetros y misión autónoma.'],
    ['Evidencia de comunicación', 'Explicación oral y bitácora básica.', 'Reporte técnico, video, presentación y defensa ante preguntas.'],
  ],

  sourceLinks: [
    {
      title: 'CNB · Bachillerato en Ciencias y Letras',
      text: 'Marco común de la carrera, áreas, competencias, indicadores de logro y lineamientos metodológicos.',
      href: 'https://cnbguatemala.org/wiki/Bachillerato_en_Ciencias_y_Letras',
      linkLabel: 'Consultar Ciencias y Letras',
    },
    {
      title: 'CNB · Orientación en Computación',
      text: 'Malla de Computación Aplicada, Laboratorio, Sistemas e Instalación de Software y otras subáreas de la orientación.',
      href: 'https://cnbguatemala.org/wiki/Bachillerato_en_Ciencias_y_Letras_con_Orientaci%C3%B3n_en_Computaci%C3%B3n',
      linkLabel: 'Consultar Computación',
    },
    {
      title: 'Mallas por área y grado · Ciencias y Letras',
      text: 'Índice oficial de subáreas para cuarto y quinto grado del Bachillerato en Ciencias y Letras.',
      href: 'https://cnbguatemala.org/wiki/Mallas_Curriculares_por_%C3%81rea_y_Grado_-_Bachillerato_en_Ciencias_y_Letras',
      linkLabel: 'Consultar mallas generales',
    },
    {
      title: 'Mallas por área y grado · Computación',
      text: 'Índice oficial de la orientación en Computación y sus subáreas tecnológicas.',
      href: 'https://cnbguatemala.org/wiki/Mallas_Curriculares_por_%C3%81rea_y_Grado_-_Bachillerato_en_Ciencias_y_Letras_con_Orientaci%C3%B3n_en_Computaci%C3%B3n',
      linkLabel: 'Consultar mallas de Computación',
    },
  ],

  reportingNote:
    'Para reportar el programa, conserve por equipo una evidencia de proceso, una evidencia técnica, una evidencia de datos y una evidencia de comunicación. El docente debe indicar qué parte del indicador se observó y qué parte queda fuera del alcance de Curiosity.',
};

const en: SmarsCurriculumContent = {
  ...es,
  readingNote:
    'This alignment integrates the common area of the Bachelor of Science and Letters with the Computing orientation. The program uses direct CNB references for grades 4 and 5.',
};

export function getSmarsCurriculumContent(locale: string): SmarsCurriculumContent {
  return locale === 'en' ? en : es;
}
