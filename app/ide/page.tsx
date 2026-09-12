import type { Metadata } from 'next'
import { IdeApp } from '@/components/ide/ide-app'
import './ide.css'
export const metadata: Metadata = {
  title: 'IDE Python Online | COA',
  description:
    'Escribe y ejecuta Python en tu navegador. Aprende con el constructor guiado de COA, ejercicios y una consola interactiva.',
}
export default function IdePage() {
  return <IdeApp />
}
