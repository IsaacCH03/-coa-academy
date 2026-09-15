import { openDB } from 'idb'
import { DEFAULT_SETTINGS, normalizeSettings, type AppearanceProfile, type StudioSettings } from './personalization'

const SETTINGS_KEY = 'coa-studio-settings-v1'
const PROFILES_KEY = 'coa-studio-profiles-v1'
const IMAGE_KEY = 'custom-background'

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
  await db.put('assets', file, IMAGE_KEY)
}
export async function loadCustomBackground(): Promise<Blob | undefined> {
  const db = await database()
  return db.get('assets', IMAGE_KEY)
}
export async function deleteCustomBackground() {
  const db = await database()
  await db.delete('assets', IMAGE_KEY)
}
