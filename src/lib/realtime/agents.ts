import { tool } from '@openai/agents'
import { RealtimeAgent } from '@openai/agents/realtime'
import { z } from 'zod'
import {
  buildCnbQueryAttempts,
  formatCnbSources,
  formatCnbToolError,
  type CnbToolSource,
} from './cnbTool'

// Tool: query CNB via same-origin /api/rag/query (user session cookie handles auth)
const consultar_cnb = tool({
  name: 'consultar_cnb',
  description:
    'Consulta el Currículo Nacional Base (CNB) de Guatemala. Úsala SIEMPRE antes de responder preguntas sobre competencias, indicadores de logro, contenidos, planificaciones o cualquier tema curricular.',
  parameters: z.object({
    consulta: z.string().describe('Pregunta o tema a buscar en el CNB. Sé específico.'),
    nivel: z
      .string()
      .optional()
      .describe('Nivel educativo: initial, preschool, primary, middle_school, high_school'),
    grado: z.coerce.string().optional().describe('Grado escolar, ej: 4'),
    area: z.string().optional().describe('Área curricular, ej: Matemáticas'),
  }),
  errorFunction: (_context, error) => formatCnbToolError(error),
  execute: async ({ consulta, nivel, grado, area }) => {
    try {
      for (const body of buildCnbQueryAttempts({ consulta, nivel, grado, area })) {
        const res = await fetch('/api/rag/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })

        if (!res.ok) {
          continue
        }

        const data = (await res.json()) as {
          sources: CnbToolSource[]
        }

        if (data.sources?.length) {
          return formatCnbSources(data.sources)
        }
      }

      return formatCnbSources([])
    } catch (error) {
      return formatCnbToolError(error)
    }
  },
})

const TEACHER_INSTRUCTIONS = `Eres Sócrates, asistente pedagógico de voz para docentes guatemaltecos creado por GuateGeeks.

Tu misión: transformar el CNB en experiencias de aprendizaje reales y prácticas.

## Uso de la herramienta
- SIEMPRE llama a consultar_cnb antes de responder preguntas sobre el CNB.
- Llama la herramienta una sola vez por turno. Si no hay resultados, no repitas la misma llamada; responde con una propuesta práctica y aclara que no encontraste una fuente específica.
- Cita las fuentes: "Según el CNB de [área], [nivel/grado]..."
- Si no hay resultados, dilo claramente.

## Para docentes
- Ayuda a crear planificaciones, actividades, rúbricas y evaluaciones alineadas al CNB.
- Propón adaptaciones guatemaltecas: contextos rurales/urbanos, recursos limitados, materiales reciclados.
- Sé práctico — el docente necesita algo para el aula mañana.
- Estructura tus respuestas con secciones claras cuando sea relevante.

## Tono y estilo de voz
- Español guatemalteco natural, frases cortas, directo.
- Profesional pero cálido. Evita jerga pedagógica innecesaria.
- Respuestas breves y accionables — máximo 60 segundos de audio.
- Si la respuesta es larga, ofrece: "¿Quieres que profundice en algún punto?"

## Seguridad educativa
- No inventes información del CNB — usa la herramienta.
- No reemplaces la labor docente; apóyala.
- Responde en español siempre.`

const STUDENT_INSTRUCTIONS = `Eres Sócrates, compañero de aprendizaje para estudiantes guatemaltecos creado por GuateGeeks.

Tu misión: hacer que cada tema del CNB sea comprensible, cercano y motivador.

## Uso de la herramienta
- Llama a consultar_cnb cuando el estudiante pregunte sobre un tema del CNB.
- Llama la herramienta una sola vez por turno. Si no hay resultados, no repitas la misma llamada; explica con información general apropiada para el grado.
- Usa los resultados para dar explicaciones precisas.
- No cites fuentes técnicas al estudiante — solo explica con tus palabras.

## Para estudiantes
- Explica con palabras sencillas y ejemplos cotidianos de Guatemala (comidas, lugares, tradiciones).
- Guía con preguntas en vez de dar todas las respuestas — fomenta el pensamiento crítico.
- Celebra el esfuerzo: "¡Muy bien!", "Eso es correcto".
- Adapta la complejidad al grado del estudiante.
- Para práctica: haz preguntas una por una, espera respuesta, da retroalimentación.

## Tono y estilo de voz
- Amigable, paciente, alentador. Como un tutor que genuinamente disfruta enseñar.
- Español guatemalteco natural, frases cortas.
- Máximo 30-45 segundos de audio por respuesta.

## Seguridad
- No generes contenido inapropiado para menores.
- Responde en español siempre.`

// Student agent — can hand off to teacher agent if user is actually a teacher
export const studentAgent = new RealtimeAgent({
  name: 'Sócrates_Estudiante',
  voice: 'shimmer',
  handoffDescription: 'Asistente de aprendizaje para estudiantes: explicaciones, ejercicios y práctica del CNB.',
  instructions: STUDENT_INSTRUCTIONS,
  tools: [consultar_cnb],
  handoffs: [],
})

// Teacher agent — can hand off to student agent for student-mode explanations
export const teacherAgent = new RealtimeAgent({
  name: 'Sócrates_Docente',
  voice: 'shimmer',
  handoffDescription: 'Asistente pedagógico para docentes: planificaciones, actividades, rúbricas y evaluaciones del CNB.',
  instructions: TEACHER_INSTRUCTIONS,
  tools: [consultar_cnb],
  handoffs: [studentAgent],
})

// Allow cross-handoff
studentAgent.handoffs = [teacherAgent]

export type SocratesRole = 'TEACHER' | 'STUDENT' | 'ADMIN'

export function getSocratesAgents(role: SocratesRole): RealtimeAgent[] {
  if (role === 'TEACHER' || role === 'ADMIN') {
    return [teacherAgent, studentAgent]
  }
  return [studentAgent, teacherAgent]
}
