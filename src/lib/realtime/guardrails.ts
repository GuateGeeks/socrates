import { zodTextFormat } from 'openai/helpers/zod'
import { GuardrailOutputZod, type GuardrailOutput } from '@/types/realtime'

export async function runGuardrailClassifier(message: string): Promise<GuardrailOutput> {
  const response = await fetch('/api/responses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      input: [
        {
          role: 'user',
          content: `Eres un clasificador de contenido educativo. Analiza el siguiente mensaje y determina su categoría según las políticas de moderación para una plataforma educativa guatemalteca para niños y jóvenes.

<mensaje>
${message}
</mensaje>

<categorías>
- OFFENSIVE: Lenguaje de odio, discriminación, insultos, acoso o contenido inapropiado para menores.
- OFF_BRAND: Contenido que no es educativo o se desvía completamente del CNB de Guatemala.
- VIOLENCE: Amenazas explícitas, incitación al daño o descripciones de violencia.
- NONE: Contenido educativo apropiado — no aplica ninguna otra categoría.
</categorías>

Sé estricto con OFFENSIVE y VIOLENCE para proteger a los estudiantes. Sé permisivo con contenido educativo y pedagógico.`,
        },
      ],
      text: { format: zodTextFormat(GuardrailOutputZod, 'output_format') },
    }),
  })

  if (!response.ok) {
    return Promise.reject('Error with runGuardrailClassifier')
  }

  const data = await response.json()

  try {
    const output = GuardrailOutputZod.parse(data.output_parsed)
    return { ...output, testText: message }
  } catch {
    return Promise.reject('Failed to parse guardrail output')
  }
}

export interface RealtimeOutputGuardrailResult {
  tripwireTriggered: boolean
  outputInfo: any
}

export interface RealtimeOutputGuardrailArgs {
  agentOutput: string
  agent?: any
  context?: any
}

export function createEducationalGuardrail() {
  return {
    name: 'educational_guardrail',
    async execute({ agentOutput }: RealtimeOutputGuardrailArgs): Promise<RealtimeOutputGuardrailResult> {
      try {
        const res = await runGuardrailClassifier(agentOutput)
        return {
          tripwireTriggered: res.moderationCategory !== 'NONE',
          outputInfo: res,
        }
      } catch {
        return { tripwireTriggered: false, outputInfo: { error: 'guardrail_failed' } }
      }
    },
  } as const
}
