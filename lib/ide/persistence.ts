import { openDB } from 'idb'
import { restoreProject, type Project } from './project'

async function database() {
  return openDB('coa-python-ide', 1, {
    upgrade(db) {
      db.createObjectStore('workspace')
    },
  })
}
export async function loadProject(): Promise<Project | null> {
  const db = await database()
  try {
    const value = await db.get('workspace', 'project')
    return value ? restoreProject(value) : null
  } finally {
    db.close()
  }
}
export async function saveProject(project: Project) {
  const db = await database()
  try {
    await db.put('workspace', project, 'project')
  } finally {
    db.close()
  }
}
