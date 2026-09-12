import type { Project } from './project'
export type GitHubSession = {
  configured: boolean
  connected: boolean
  login?: string
}
async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const result = await fetch('/api/ide/github/' + path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  })
  const body = await result.json()
  if (!result.ok)
    throw new Error(body.error ?? 'GitHub no pudo completar la solicitud.')
  return body
}
export const githubService = {
  session: () => api<GitHubSession>('session'),
  disconnect: () => api('session', { method: 'DELETE' }),
  upload: (
    project: Project,
    repository: string,
    message: string,
    create: boolean,
    name: string,
    privateRepo: boolean,
  ) =>
    api<{ url: string; repository: string }>('project', {
      method: 'POST',
      body: JSON.stringify({
        project,
        repository,
        message,
        create,
        name,
        private: privateRepo,
      }),
    }),
  import: (repository: string) =>
    api<{ project: Project }>(
      'project?repository=' + encodeURIComponent(repository),
    ),
}
