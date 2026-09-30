// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SubmissionUploader } from './submission-uploader'

const submitted = { id: 's1', submitted_at: '2026-09-23T12:00:00Z', files: [{ id: 'f1', original_filename: 'proyecto.zip', size_bytes: 100, mime_type: 'application/zip' }], record: { status: 'under_review', feedback: null, convalidation_note: null } }

describe('SubmissionUploader', () => {
  beforeEach(() => { vi.stubGlobal('fetch', vi.fn()) })
  afterEach(() => { cleanup(); vi.unstubAllGlobals() })

  it('shows all current files and the effective review state', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ mode: 'student', submission: submitted }), { status: 200 }))
    render(<SubmissionUploader activityId="python-practico-m1-proyecto" />)
    expect(await screen.findByText(/proyecto.zip/)).toBeTruthy()
    expect(screen.getByText('En revisión')).toBeTruthy()
    expect(screen.getByText('Seleccionar o arrastrar archivos')).toBeTruthy()
  })

  it('shows inspection mode to admins without a student upload control', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ mode: 'admin', submission: null }), { status: 200 }))
    render(<SubmissionUploader activityId="python-practico-m1-proyecto" />)
    expect(await screen.findByText(/Vista de inspección administrativa/)).toBeTruthy()
    expect(document.querySelector('input[type="file"]')).toBeNull()
  })

  it('keeps uploads unavailable when active enrollment is missing', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ error: 'Necesitas una matrícula activa para realizar esta entrega.' }), { status: 403 }))
    render(<SubmissionUploader activityId="python-practico-m1-proyecto" />)
    expect(await screen.findByText('Necesitas una matrícula activa para realizar esta entrega.')).toBeTruthy()
    expect((document.querySelector('input[type="file"]') as HTMLInputElement).disabled).toBe(true)
  })

  it('lists multiple selected files and sends them in one academic submission', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify({ submission: null }), { status: 200 })).mockResolvedValueOnce(new Response(JSON.stringify({ submission: submitted }), { status: 200 }))
    render(<SubmissionUploader activityId="python-practico-m1-proyecto" />)
    await screen.findByText('Seleccionar o arrastrar archivos')
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    fireEvent.change(input, { target: { files: [new File(['a'], 'uno.py'), new File(['b'], 'dos.py')] } })
    expect(await screen.findByText(/uno.py/)).toBeTruthy()
    expect(screen.getByText(/dos.py/)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Entregar' }))
    await waitFor(() => expect(screen.getByText(/Ahora está en revisión/)).toBeTruthy())
    const [, options] = vi.mocked(fetch).mock.calls.at(-1)!
    expect(options).toEqual(expect.objectContaining({ method: 'POST' }))
    expect((options?.body as FormData).getAll('files')).toHaveLength(2)
  })

  it('uses the activity limit before uploading and reports the exact maximum', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ submission: null, settings: { maxFiles: 3, maxFileBytes: 5 * 1024 * 1024, closed: false } }), { status: 200 }))
    render(<SubmissionUploader activityId="live-activity" />)
    await screen.findByText(/5\.0 MB cada uno/)
    const file = new File(['x'], 'grande.pdf', { type: 'application/pdf' })
    Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 })
    fireEvent.change(document.querySelector('input[type="file"]') as HTMLInputElement, { target: { files: [file] } })
    expect(await screen.findByText('El archivo grande.pdf supera el límite permitido de 5 MB.')).toBeTruthy()
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('accepts a file above 10 MB when the activity allows 20 MB', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify({ submission: null, settings: { maxFiles: 2, maxFileBytes: 20 * 1024 * 1024, closed: false } }), { status: 200 })).mockResolvedValueOnce(new Response(JSON.stringify({ submission: submitted }), { status: 200 }))
    render(<SubmissionUploader activityId="live-activity" />)
    await screen.findByText(/20\.0 MB cada uno/)
    const file = new File(['x'], 'proyecto.zip', { type: 'application/zip' })
    Object.defineProperty(file, 'size', { value: 11 * 1024 * 1024 })
    fireEvent.change(document.querySelector('input[type="file"]') as HTMLInputElement, { target: { files: [file] } })
    expect(await screen.findByText(/proyecto\.zip · 11\.0 MB/)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Entregar' }))
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2))
  })
})
