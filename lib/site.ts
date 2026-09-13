export const site = {
  name: 'C.O.A',
  fullName: 'Cursos Online Avanzados',
  // Reemplaza con el número real (formato internacional, sin + ni espacios)
  whatsappNumber: '50660045660',
  whatsappMessage: 'Hola, me interesa recibir más información sobre los cursos de C.O.A.',
  facebookUrl: 'https://www.facebook.com/profile.php?id=100064086669988',
  email: 'coagocrc@gmail.com',
}

export function createWhatsAppLink(message: string) {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`
}

export const whatsappLink = createWhatsAppLink(site.whatsappMessage)
