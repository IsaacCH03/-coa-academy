import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { PythonRuntime, type RuntimeIssueKind, type RuntimeState } from './runtime'
import type { Project } from './project'

class WorkerMock {
  static instances: WorkerMock[] = []
  onmessage: ((event: MessageEvent) => void) | null = null
  onerror: (() => void) | null = null
  messages: unknown[] = []
  terminated = false

  constructor(public url: string) {
    WorkerMock.instances.push(this)
  }

  postMessage(message: unknown) {
    this.messages.push(message)
  }

  terminate() {
    this.terminated = true
  }

  emit(data: unknown) {
    this.onmessage?.({ data } as MessageEvent)
  }
}

const project = {
  active: 'main.py',
  entries: [{ path: 'main.py', kind: 'file', content: 'print("ok")' }],
} as Project

function setup(isolated = true) {
  vi.stubGlobal('Worker', WorkerMock)
  vi.stubGlobal('crossOriginIsolated', isolated)
  const states: RuntimeState[] = []
  const errors: Array<[string, RuntimeIssueKind]> = []
  const output: string[] = []
  let inputRequestId = 0
  const runtime = new PythonRuntime({
    state: (state) => states.push(state),
    output: (text) => output.push(text),
    error: (text, kind) => errors.push([text, kind]),
    inputRequest: (requestId) => { inputRequestId = requestId },
    dialog: vi.fn(),
  })
  runtime.start()
  const worker = WorkerMock.instances.at(-1)!
  worker.emit({ type: 'ready', interactiveInput: isolated })
  return { runtime, worker, states, errors, output, currentInputRequest: () => inputRequestId }
}

describe('PythonRuntime', () => {
  beforeEach(() => {
    WorkerMock.instances = []
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('accepts one response for the active input and preserves empty and Unicode values', async () => {
    const { runtime, worker, currentInputRequest } = setup()
    const firstRun = runtime.run(project)
    const firstMessage = worker.messages.at(-1) as { runId: number }
    worker.emit({ type: 'input', runId: firstMessage.runId, requestId: 1 })
    expect(() => runtime.input('', currentInputRequest())).not.toThrow()
    expect(() => runtime.input('duplicada', currentInputRequest())).toThrow(/no está esperando/)
    worker.emit({ type: 'done', runId: firstMessage.runId, ok: true, output: '' })
    await firstRun

    const secondRun = runtime.run(project)
    const secondMessage = worker.messages.at(-1) as { runId: number }
    worker.emit({ type: 'input', runId: secondMessage.runId, requestId: 2 })
    expect(() => runtime.input('respuesta tardía', 1)).toThrow(/no está esperando/)
    runtime.input('año ✓', currentInputRequest())
    worker.emit({ type: 'done', runId: secondMessage.runId, ok: true, output: '' })
    await secondRun
  })

  it('ignores late input requests and results after stop, then becomes ready automatically', async () => {
    const { runtime, worker, states } = setup()
    const running = runtime.run(project)
    const message = worker.messages.at(-1) as { runId: number }
    worker.emit({ type: 'input', runId: message.runId, requestId: 1 })

    runtime.stop()
    await running
    const replacement = WorkerMock.instances.at(-1)!
    expect(worker.terminated).toBe(true)
    expect(replacement).not.toBe(worker)
    expect(states.at(-1)).toBe('loading')

    worker.emit({ type: 'input', runId: message.runId, requestId: 2 })
    worker.emit({ type: 'done', runId: message.runId, ok: true, output: 'tarde' })
    expect(states.at(-1)).toBe('loading')
    replacement.emit({ type: 'ready', interactiveInput: true })
    expect(states.at(-1)).toBe('ready')
  })

  it('classifies capability and engine-loading failures separately from Python errors', async () => {
    const unavailable = setup(false)
    const running = unavailable.runtime.run(project)
    const run = unavailable.worker.messages.at(-1) as { runId: number }
    unavailable.worker.emit({ type: 'capability-error', runId: run.runId, text: 'sin aislamiento' })
    unavailable.worker.emit({ type: 'done', runId: run.runId, ok: false, output: '' })
    await running
    expect(unavailable.errors).toContainEqual(['sin aislamiento', 'capability'])

    unavailable.runtime.start()
    const replacement = WorkerMock.instances.at(-1)!
    replacement.emit({ type: 'load-error', text: 'falló Pyodide' })
    expect(unavailable.errors).toContainEqual(['falló Pyodide', 'load'])
  })
})
