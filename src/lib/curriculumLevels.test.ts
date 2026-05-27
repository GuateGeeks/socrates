import assert from 'node:assert/strict'
import { test } from 'node:test'

import { toClientEducationLevel, toDbEducationLevel } from './curriculumLevels'

test('maps UI education levels to Prisma enum values', () => {
  assert.equal(toDbEducationLevel('primary'), 'PRIMARY')
  assert.equal(toDbEducationLevel('middle_school'), 'MIDDLE_SCHOOL')
  assert.equal(toDbEducationLevel('PRIMARY'), 'PRIMARY')
  assert.equal(toDbEducationLevel(undefined), undefined)
})

test('maps Prisma enum values back to UI education levels', () => {
  assert.equal(toClientEducationLevel('PRIMARY'), 'primary')
  assert.equal(toClientEducationLevel('MIDDLE_SCHOOL'), 'middle_school')
  assert.equal(toClientEducationLevel('primary'), 'primary')
  assert.equal(toClientEducationLevel(null), undefined)
})
