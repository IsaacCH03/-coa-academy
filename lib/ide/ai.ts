// Future providers must use a server endpoint. Never place an API key in the IDE.
export type TutorRequest = {
  intent: 'explain-error' | 'explain-code' | 'hint' | 'review' | 'question'
  code: string
  question?: string
  error?: string
}
export interface TutorService {
  ask(request: TutorRequest): Promise<{ explanation: string }>
}
export const tutorAvailability = {
  available: false,
  label: 'COA IA — Próximamente',
} as const
