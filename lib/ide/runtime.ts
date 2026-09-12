import type { Project, ProjectEntry } from './project'
import type { GuiImportResult } from './gui-designer'
export type RuntimeState =
  'loading' | 'ready' | 'running' | 'input' | 'stopped' | 'error'
export type RunResult = {
  ok: boolean
  output: string
  entries?: ProjectEntry[]
  gui?: CoaGuiPreview
}
export type CoaGuiControl = {
  id: number
  type: 'Label' | 'Entry' | 'Button' | 'Frame'
  text?: string
  x: number
  y: number
  width: number
  height: number
  command?: boolean
}
export type CoaGuiPreview = {
  title: string
  width: number
  height: number
  controls: CoaGuiControl[]
}
type RuntimeEvents = {
  state: (state: RuntimeState) => void
  output: (text: string) => void
  error: (text: string) => void
}
export class PythonRuntime {
  private worker: Worker | null = null
  private buffer: SharedArrayBuffer | undefined
  private resolve: ((result: RunResult) => void) | undefined
  private resolveGui: ((preview: CoaGuiPreview) => void) | undefined
  private rejectGui: ((error: Error) => void) | undefined
  private resolveAnalysis: ((result: GuiImportResult) => void) | undefined
  private rejectAnalysis: ((error: Error) => void) | undefined
  private timeout: ReturnType<typeof setTimeout> | undefined
  private loadingTimeout: ReturnType<typeof setTimeout> | undefined
  private ready = false
  constructor(private events: RuntimeEvents) {}
  start() {
    this.dispose()
    this.events.state('loading')
    this.buffer =
      typeof SharedArrayBuffer !== 'undefined' && crossOriginIsolated
        ? new SharedArrayBuffer(65544)
        : undefined
    const worker = new Worker('/ide/python-worker.js')
    this.worker = worker
    this.loadingTimeout = setTimeout(
      () =>
        this.fail(
          'La carga de Python tardó demasiado. Revisa tu conexión y pulsa Recargar Python.',
        ),
      90000,
    )
    worker.onmessage = ({ data }) => {
      if (this.worker !== worker) return
      if (data.type === 'ready') {
        clearTimeout(this.loadingTimeout)
        this.ready = true
        this.events.state('ready')
      }
      if (data.type === 'output') this.events.output(data.text)
      if (data.type === 'input') this.events.state('input')
      if (data.type === 'python-error') this.events.error(data.text)
      if (data.type === 'gui-update') {
        this.events.state('ready')
        this.resolveGui?.(data.gui)
        this.resolveGui = undefined
        this.rejectGui = undefined
      }
      if (data.type === 'gui-error') {
        this.events.state('ready')
        this.rejectGui?.(new Error(data.text))
        this.resolveGui = undefined
        this.rejectGui = undefined
      }
      if (data.type === 'analyze-result') {
        this.resolveAnalysis?.(data.result)
        this.resolveAnalysis = undefined
        this.rejectAnalysis = undefined
      }
      if (data.type === 'analyze-error') {
        this.rejectAnalysis?.(new Error(data.text))
        this.resolveAnalysis = undefined
        this.rejectAnalysis = undefined
      }
      if (data.type === 'fatal') this.fail(data.text)
      if (data.type === 'done') {
        clearTimeout(this.timeout)
        this.events.state('ready')
        this.resolve?.(data)
        this.resolve = undefined
      }
    }
    worker.onerror = () =>
      this.fail(
        'No se pudo iniciar el entorno Python. Pulsa Recargar Python para volver a intentarlo.',
      )
    worker.postMessage({ type: 'init', inputBuffer: this.buffer })
  }
  private fail(message: string) {
    this.dispose()
    this.events.error(message)
    this.events.output(message + '\n')
    this.events.state('error')
  }
  run(project: Project, inputs?: string[]): Promise<RunResult> {
    if (!this.ready || this.resolve)
      return Promise.reject(new Error('Espera a que Python esté listo.'))
    this.events.state('running')
    return new Promise((resolve) => {
      this.resolve = resolve
      if (inputs)
        this.timeout = setTimeout(() => {
          this.events.output(
            '\nEl caso superó 10 segundos. Revisa los ciclos.\n',
          )
          this.stop()
        }, 10000)
      this.worker!.postMessage({
        type: 'run',
        entries: project.entries,
        active: project.active,
        inputs,
      })
    })
  }
  input(text: string) {
    if (!this.buffer)
      throw new Error(
        'La entrada interactiva no está disponible en este navegador.',
      )
    const bytes = new TextEncoder().encode(text)
    if (bytes.length > 65536)
      throw new Error('La respuesta es demasiado larga (máximo 64 KB).')
    const control = new Int32Array(this.buffer, 0, 2)
    new Uint8Array(this.buffer, 8).set(bytes)
    Atomics.store(control, 1, bytes.length)
    Atomics.store(control, 0, 1)
    Atomics.notify(control, 0)
    this.events.output(text + '\n')
    this.events.state('running')
  }
  invokeGui(controlId: number, values: Record<string, string>) {
    if (!this.ready || this.resolve || this.resolveGui)
      return Promise.reject(new Error('Espera a que Python esté listo.'))
    this.events.state('running')
    return new Promise<CoaGuiPreview>((resolve, reject) => {
      this.resolveGui = resolve
      this.rejectGui = reject
      this.worker!.postMessage({ type: 'gui-event', controlId, values })
    })
  }
  analyzeGui(source: string) {
    if (!this.ready || this.resolve || this.resolveGui || this.resolveAnalysis)
      return Promise.reject(new Error('Espera a que Python esté listo.'))
    return new Promise<GuiImportResult>((resolve, reject) => {
      this.resolveAnalysis = resolve
      this.rejectAnalysis = reject
      this.worker!.postMessage({ type: 'analyze-gui', source })
    })
  }
  stop() {
    this.dispose()
    this.events.state('stopped')
  }
  dispose() {
    this.ready = false
    this.worker?.terminate()
    this.worker = null
    clearTimeout(this.timeout)
    clearTimeout(this.loadingTimeout)
    this.resolve?.({ ok: false, output: '' })
    this.resolve = undefined
    this.rejectGui?.(new Error('La ejecución gráfica fue detenida.'))
    this.resolveGui = undefined
    this.rejectGui = undefined
    this.rejectAnalysis?.(new Error('El análisis fue detenido.'))
    this.resolveAnalysis = undefined
    this.rejectAnalysis = undefined
  }
}
