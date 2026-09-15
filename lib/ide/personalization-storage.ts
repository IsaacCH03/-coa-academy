import { openDB } from 'idb'
import { DEFAULT_SETTINGS, normalizeSettings, type AppearanceProfile, type StudioSettings } from './personalization'

const SETTINGS_KEY = 'coa-studio-settings-v1'
const PROFILES_KEY = 'coa-studio-profiles-v1'
const LEGACY_IMAGE_KEY = 'custom-background'

export function loadSettings(): StudioSettings {
  try { return normalizeSettings(JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? 'null')) }
  catch { return { ...DEFAULT_SETTINGS } }
}
export function saveSettings(settings: StudioSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}
export function loadProfiles(): AppearanceProfile[] {
  try {
    const values = JSON.parse(localStorage.getItem(PROFILES_KEY) ?? '[]')
    return Array.isArray(values) ? values.map((p) => ({ ...p, settings: normalizeSettings(p.settings) })) : []
  } catch { return [] }
}
export function saveProfiles(profiles: AppearanceProfile[]) {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles))
}
async function database() {
  return openDB('coa-studio-personalization', 1, { upgrade(db) { db.createObjectStore('assets') } })
}
export async function saveCustomBackground(file: File) {
  const db = await database()
  const id = `background-${crypto.randomUUID()}`
  await db.put('assets', file, id)
  return id
}
export async function loadCustomBackground(id?: string | null): Promise<Blob | undefined> {
  const db = await database()
  return db.get('assets', id || LEGACY_IMAGE_KEY)
}
export async function deleteCustomBackground(id?: string | null) {
  const db = await database()
  await db.delete('assets', id || LEGACY_IMAGE_KEY)
}
