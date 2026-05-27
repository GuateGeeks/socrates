import assert from 'node:assert/strict'
import { test } from 'node:test'

import {
  buildRealtimeClientSecretRequestBody,
  extractRealtimeEphemeralKey,
  REALTIME_MODEL,
} from './clientSecret'

test('builds a GA Realtime client secret request body', () => {
  assert.deepEqual(buildRealtimeClientSecretRequestBody(), {
    expires_after: {
      anchor: 'created_at',
      seconds: 600,
    },
    session: {
      type: 'realtime',
      model: REALTIME_MODEL,
      audio: {
        input: {
          transcription: {
            model: 'gpt-4o-mini-transcribe',
          },
        },
      },
    },
  })
})

test('extracts ephemeral keys from GA and legacy response shapes', () => {
  assert.equal(extractRealtimeEphemeralKey({ value: 'ek_ga_top_level' }), 'ek_ga_top_level')
  assert.equal(
    extractRealtimeEphemeralKey({
      session: { client_secret: { value: 'ek_ga_nested' } },
    }),
    'ek_ga_nested',
  )
  assert.equal(
    extractRealtimeEphemeralKey({
      client_secret: { value: 'ek_legacy_nested' },
    }),
    'ek_legacy_nested',
  )
  assert.equal(extractRealtimeEphemeralKey({ error: 'missing' }), undefined)
})
