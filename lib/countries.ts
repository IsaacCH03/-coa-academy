export const supportedCountries = [
  'Costa Rica',
  'México',
  'Guatemala',
  'Honduras',
  'El Salvador',
  'Nicaragua',
  'Panamá',
  'Colombia',
  'Venezuela',
  'Ecuador',
  'Perú',
  'Bolivia',
  'Chile',
  'Argentina',
  'Uruguay',
  'Paraguay',
  'República Dominicana',
  'Cuba',
  'Puerto Rico',
  'España',
  'Guinea Ecuatorial',
  'Brasil',
] as const

export type SupportedCountry = (typeof supportedCountries)[number]

export function isSupportedCountry(value: string): value is SupportedCountry {
  return supportedCountries.includes(value as SupportedCountry)
}
