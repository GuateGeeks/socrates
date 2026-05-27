import assert from 'node:assert/strict'
import { test } from 'node:test'

import { buildCnbQueryAttempts, formatCnbToolError, normalizeCnbArea } from './cnbTool'

test('normalizes common CNB area aliases used by the realtime model', () => {
  assert.equal(normalizeCnbArea('Lenguaje y Literatura'), 'Comunicación y Lenguaje')
  assert.equal(normalizeCnbArea('comunicacion y lenguaje'), 'Comunicación y Lenguaje')
  assert.equal(normalizeCnbArea('Matematica'), 'Matemáticas')
})

test('builds progressively broader CNB query attempts when a narrow area filter may miss', () => {
  assert.deepEqual(
    buildCnbQueryAttempts({
      consulta: 'contenidos de Lenguaje y Literatura y de Matemáticas que se puedan integrar',
      nivel: 'primary',
      grado: '4',
      area: 'Lenguaje y Literatura',
    }),
    [
      {
        query: 'contenidos de Lenguaje y Literatura y de Matemáticas que se puedan integrar',
        topK: 5,
        filter: {
          level: 'primary',
          grade: '4',
          area: 'Comunicación y Lenguaje',
        },
      },
      {
        query: 'contenidos de Lenguaje y Literatura y de Matemáticas que se puedan integrar',
        topK: 5,
        filter: {
          level: 'primary',
          grade: '4',
        },
      },
      {
        query: 'contenidos de Lenguaje y Literatura y de Matemáticas que se puedan integrar',
        topK: 5,
      },
    ],
  )
})

test('coerces numeric grades from realtime tool calls into CNB filter strings', () => {
  assert.deepEqual(
    buildCnbQueryAttempts({
      consulta: 'contenidos y competencias para Lenguaje y Matemáticas en cuarto primaria',
      nivel: 'primary',
      grado: 4,
      area: 'Lenguaje',
    }),
    [
      {
        query: 'contenidos y competencias para Lenguaje y Matemáticas en cuarto primaria',
        topK: 5,
        filter: {
          level: 'primary',
          grade: '4',
          area: 'Comunicación y Lenguaje',
        },
      },
      {
        query: 'contenidos y competencias para Lenguaje y Matemáticas en cuarto primaria',
        topK: 5,
        filter: {
          level: 'primary',
          grade: '4',
        },
      },
      {
        query: 'contenidos y competencias para Lenguaje y Matemáticas en cuarto primaria',
        topK: 5,
      },
    ],
  )
})

test('formats malformed realtime tool input as a useful Spanish result', () => {
  assert.match(formatCnbToolError(new Error('Invalid JSON input for tool')), /argumentos no llegaron/)
})
