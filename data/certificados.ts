import type { Certificado } from '@/lib/certificates'

// =====================================================
// CÓMO AGREGAR UN CERTIFICADO NUEVO
// =====================================================
//
// 1. Copia uno de los registros existentes.
// 2. Cambia código, nombre, curso, modalidad,
//    fecha de emisión y estado.
// 3. El código NO puede repetirse.
// 4. Estados permitidos: "valido" y "revocado".
// 5. Guarda el archivo.
// =====================================================

export const certificados: Certificado[] = [
  {
    codigo: 'COA-PYB-2026-0001',
    nombre: 'Evelio Josué H. Bezpowy',
    curso: 'Python Básico',
    modalidad: 'Virtual',
    fechaEmision: '21/09/2026',
    estado: 'valido',
  },
]
