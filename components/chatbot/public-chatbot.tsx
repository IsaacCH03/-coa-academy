'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { Bot, MessageCircle, Send, X } from 'lucide-react'
import { initialAssistantMessage, quickQuestions } from '@/lib/chatbot/knowledge'
import { localChatResponder } from '@/lib/chatbot/responder'
import type { ChatContext, ChatMessage } from '@/lib/chatbot/types'

const initialMessage: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  text: initialAssistantMessage,
  suggestions: quickQuestions,
}

export function PublicChatbot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage])
  const [context, setContext] = useState<ChatContext>({})
  const messageId = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', close)
    return () => document.removeEventListener('keydown', close)
  }, [open])

  useEffect(() => {
    if (open && typeof endRef.current?.scrollIntoView === 'function') {
      endRef.current.scrollIntoView({ block: 'end' })
    }
  }, [messages, open])

  function ask(value: string) {
    const question = value.trim()
    if (!question) return
    const response = localChatResponder.respond(question, context)
    const id = ++messageId.current
    setMessages((current) => [
      ...current,
      { id: `user-${id}`, role: 'user', text: question },
      { id: `assistant-${id}`, role: 'assistant', ...response },
    ])
    setInput('')
    setContext(response.context ?? context)
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    ask(input)
  }

  return (
    <div className="fixed bottom-4 right-4 z-[60] sm:bottom-5 sm:right-5">
      {open && (
        <section
          role="dialog"
          aria-label="Asistente Virtual COA"
          className="mb-3 flex h-[min(640px,calc(100dvh-6rem))] w-[calc(100vw-2rem)] max-w-[390px] flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-2xl"
        >
          <header className="flex items-center gap-3 bg-primary px-4 py-3 text-primary-foreground">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15"><Bot className="h-5 w-5" /></span>
            <div className="min-w-0 flex-1">
              <h2 className="truncate font-extrabold">Asistente Virtual COA</h2>
              <p className="text-xs text-primary-foreground/80">Orientación automática</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar asistente" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-primary-foreground/15 focus-visible:outline-2 focus-visible:outline-offset-2"><X className="h-5 w-5" /></button>
          </header>

          <div aria-live="polite" className="flex-1 space-y-4 overflow-y-auto bg-secondary/25 p-4">
            {messages.map((message) => (
              <article key={message.id} className={message.role === 'user' ? 'ml-10' : 'mr-6'}>
                <div className={message.role === 'user' ? 'ml-auto w-fit max-w-full rounded-2xl rounded-br-md bg-primary px-4 py-3 text-sm leading-relaxed text-primary-foreground' : 'w-fit max-w-full rounded-2xl rounded-bl-md border bg-card px-4 py-3 text-sm leading-relaxed shadow-sm'}>
                  {message.text}
                </div>
                {message.links && <div className="mt-2 flex flex-wrap gap-2">{message.links.map((link) => <a key={`${message.id}-${link.href}-${link.label}`} href={link.href} target={link.external ? '_blank' : undefined} rel={link.external ? 'noopener noreferrer' : undefined} className="rounded-full border border-primary/30 bg-background px-3 py-1.5 text-xs font-bold text-primary hover:bg-secondary">{link.label}</a>)}</div>}
                {message.suggestions && <div className="mt-2 flex flex-wrap gap-2">{message.suggestions.map((suggestion) => <button key={`${message.id}-${suggestion}`} type="button" onClick={() => ask(suggestion)} className="rounded-full bg-secondary px-3 py-1.5 text-left text-xs font-semibold text-secondary-foreground hover:bg-secondary/75">{suggestion}</button>)}</div>}
              </article>
            ))}
            <div ref={endRef} />
          </div>

          <form onSubmit={submit} className="flex gap-2 border-t bg-card p-3">
            <label htmlFor="coa-chat-question" className="sr-only">Escriba su pregunta</label>
            <input ref={inputRef} id="coa-chat-question" value={input} onChange={(event) => setInput(event.target.value)} maxLength={500} autoComplete="off" placeholder="Escriba su pregunta..." className="min-w-0 flex-1 rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            <button type="submit" disabled={!input.trim()} aria-label="Enviar pregunta" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-40"><Send className="h-4 w-4" /></button>
          </form>
        </section>
      )}

      <button type="button" onClick={() => setOpen((current) => !current)} aria-label={open ? 'Cerrar Asistente Virtual COA' : 'Abrir Asistente Virtual COA'} aria-expanded={open} className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg ring-4 ring-accent/25 transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-7 w-7" />}
      </button>
    </div>
  )
}
