import { describe, expect, it } from 'vitest'
import { MAX_SUBMISSION_BYTES, MAX_SUBMISSION_FILES, submissionExtension, submissionStoragePath, validateSubmissionFile, validateSubmissionFiles } from './submissions'

describe('submission files', () => {
  it('creates a stable private path without exposing the original filename', () => {
    const path = submissionStoragePath('11111111-1111-4111-8111-111111111111', 'python-practico-m1-proyecto', '22222222-2222-4222-8222-222222222222')
    expect(path).toBe('11111111-1111-4111-8111-111111111111/python-practico-m1-proyecto/22222222-2222-4222-8222-222222222222')
    expect(path).not.toContain('tarea personal')
  })

  it('accepts five files and exactly 10 MB combined', () => {
    const files = Array.from({ length: MAX_SUBMISSION_FILES }, (_, index) => ({ name: `file-${index}.txt`, size: MAX_SUBMISSION_BYTES / MAX_SUBMISSION_FILES }))
    expect(validateSubmissionFiles(files)).toBeNull()
  })

  it('rejects six files and totals above 10 MB', () => {
    expect(validateSubmissionFiles(Array.from({ length: 6 }, (_, index) => ({ name: `${index}.txt`, size: 1 })))).toMatch(/máximo de 5/)
    expect(validateSubmissionFiles([{ name: 'a.bin', size: MAX_SUBMISSION_BYTES }, { name: 'b.bin', size: 1 }])).toMatch(/peso combinado/)
  })

  it('uses collision-resistant keys even when original names match', () => {
    const first = submissionStoragePath('11111111-1111-4111-8111-111111111111', 'python-practico-m1-proyecto', '22222222-2222-4222-8222-222222222222')
    const second = submissionStoragePath('11111111-1111-4111-8111-111111111111', 'python-practico-m1-proyecto', '33333333-3333-4333-8333-333333333333')
    expect(first).not.toBe(second)
  })

  it('validates empty and oversized files', () => {
    expect(validateSubmissionFile({ name: 'tarea.zip', size: MAX_SUBMISSION_BYTES })).toBeNull()
    expect(validateSubmissionFile({ name: 'tarea.zip', size: MAX_SUBMISSION_BYTES + 1 })).toContain('10 MB')
    expect(validateSubmissionFile({ name: 'tarea.zip', size: 0 })).toContain('vacío')
  })

  it('only accepts simple extensions', () => {
    expect(submissionExtension('trabajo.PDF')).toBe('.pdf')
    expect(submissionExtension('archivo.extremadamente-larga')).toBe('')
  })
})
