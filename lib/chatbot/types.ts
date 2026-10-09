export type ChatLink = {
  label: string
  href: string
  external?: boolean
}

export type ChatResponse = {
  text: string
  links?: ChatLink[]
  suggestions?: string[]
}

export type ChatMessage = {
  id: string
  role: 'assistant' | 'user'
  text: string
  links?: ChatLink[]
  suggestions?: string[]
}

export interface ChatResponder {
  respond(question: string): ChatResponse
}
