'use client'

import { MessageCircle } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { createWhatsAppLink } from '@/lib/site'
import { isChatbotRoute } from '@/components/chatbot/chatbot-gate'

const floatingWhatsappLink = createWhatsAppLink(
  'Hola, quisiera recibir información sobre C.O.A.',
)

export function WhatsAppFloat() {
  const pathname = usePathname()
  if (isChatbotRoute(pathname)) return null

  return (
    <a
      href={floatingWhatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg ring-4 ring-accent/25 transition-transform hover:scale-105"
    >
      <MessageCircle className="h-7 w-7" />
      <span className="sr-only">Escríbenos por WhatsApp</span>
    </a>
  )
}
