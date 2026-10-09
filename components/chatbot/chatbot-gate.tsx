'use client'

import { usePathname } from 'next/navigation'
import { PublicChatbot } from './public-chatbot'

const singleSegment = '[^/]+'

export function isChatbotRoute(pathname: string) {
  const path = pathname !== '/' ? pathname.replace(/\/$/, '') : pathname
  if (path === '/') return true
  if (path === '/experiencia-profesional') return true
  if (new RegExp(`^/cursos/${singleSegment}$`).test(path)) return true
  if (path === '/proyectos') return true
  if (path !== '/proyectos/guardados' && new RegExp(`^/proyectos/${singleSegment}$`).test(path)) return true
  if (path === '/solicitudes' || new RegExp(`^/solicitudes/${singleSegment}$`).test(path)) return true
  if (path === '/certificados' || new RegExp(`^/certificados/${singleSegment}$`).test(path)) return true
  return false
}

export function ChatbotGate() {
  const pathname = usePathname()
  return isChatbotRoute(pathname) ? <PublicChatbot /> : null
}
