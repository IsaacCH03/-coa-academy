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
    nombre: 'Evelio Josué Chevez Powell',
    curso: 'Python Básico',
    modalidad: 'Virtual',
    fechaEmision: '21/09/2026',
    estado: 'valido',
  },
  {
    codigo: 'COA-PYB-2026-0002',
    nombre: 'Christopher Samuel Vásquez Bonilla',
    curso: 'Python Básico',
    modalidad: 'Virtual',
    fechaEmision: '25/09/2026',
    estado: 'valido',
  },
  {
    codigo: 'COA-PYI-2026-0001',
    nombre: 'Christopher Samuel Vásquez Bonilla',
    curso: 'Python Intermedio',
    modalidad: 'Virtual',
    fechaEmision: '25/09/2026',
    estado: 'valido',
  },
  {
    codigo: 'COA-PYB-2026-0003',
    nombre: 'Obet Yarit López Cordero ',
    curso: 'Python Básico',
    modalidad: 'Virtual',
    fechaEmision: '25/09/2026',
    estado: 'valido',
  },
  {
    codigo: 'COA-PYB-2026-0002',
    nombre: 'Obet Yarit López Cordero ',
    curso: 'Python Intermedio',
    modalidad: 'Virtual',
    fechaEmision: '25/09/2026',
    estado: 'valido',
  },
]
