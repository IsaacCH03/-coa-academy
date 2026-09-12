import {
  addEntries,
  newProject,
  restoreProject,
  extensions,
  type ProjectEntry,
} from '@/lib/ide/project'
import {
  assertOrigin,
  githubJson,
  githubRequest,
  githubToken,
  repositoryPath,
  limitedRequestText,
} from '@/lib/ide/github-server'
export async function POST(request: Request) {
  try {
    assertOrigin(request)
    const raw = await limitedRequestText(request)
    const body = JSON.parse(raw)
    const project = restoreProject(body.project)
    const files = project.entries.filter((e) => e.kind === 'file')
    if (!files.length)
      throw new Error('El proyecto no tiene archivos para subir.')
    if (
      typeof body.message !== 'string' ||
      !body.message.trim() ||
      body.message.length > 500
    )
      throw new Error('Escribe un mensaje de commit de hasta 500 caracteres.')
    const token = await githubToken()
    let fullName = String(body.repository)
    if (body.create === true) {
      if (!/^[A-Za-z0-9_-][A-Za-z0-9_.-]{0,99}$/.test(body.name ?? ''))
        throw new Error('Nombre de repositorio inválido.')
      const repo = await githubRequest<{ full_name: string }>(
        token,
        '/user/repos',
        'POST',
        { name: body.name, private: body.private !== false, auto_init: true },
      )
      fullName = repo.full_name
    }
    const path = repositoryPath(fullName)
    const repo = await githubRequest<{ default_branch: string }>(token, path)
    const ref = await githubRequest<{ object: { sha: string } }>(
      token,
      `${path}/git/ref/heads/${encodeURIComponent(repo.default_branch)}`,
    )
    const commit = await githubRequest<{ tree: { sha: string } }>(
      token,
      `${path}/git/commits/${ref.object.sha}`,
    )
    // base_tree preserves unrelated remote files; updates never force-push or delete remote data.
    const tree = await githubRequest<{ sha: string }>(
      token,
      `${path}/git/trees`,
      'POST',
      {
        base_tree: commit.tree.sha,
        tree: files.map((e) => ({
          path: e.path,
          mode: '100644',
          type: 'blob',
          content: e.content,
        })),
      },
    )
    const next = await githubRequest<{ sha: string }>(
      token,
      `${path}/git/commits`,
      'POST',
      { message: body.message, tree: tree.sha, parents: [ref.object.sha] },
    )
    await githubRequest(
      token,
      `${path}/git/refs/heads/${encodeURIComponent(repo.default_branch)}`,
      'PATCH',
      { sha: next.sha, force: false },
    )
    return githubJson({
      repository: fullName,
      url: 'https://github.com/' + fullName,
      sha: next.sha,
    })
  } catch (error) {
    return githubJson(
      {
        error:
          error instanceof Error
            ? error.message
            : 'No se pudo subir el proyecto.',
      },
      400,
    )
  }
}
export async function GET(request: Request) {
  try {
    const token = await githubToken()
    const repository = new URL(request.url).searchParams.get('repository') ?? ''
    const path = repositoryPath(repository)
    const repo = await githubRequest<{ default_branch: string }>(token, path)
    const tree = await githubRequest<{
      truncated: boolean
      tree: {
        path: string
        type: string
        sha: string
        size?: number
        mode: string
      }[]
    }>(
      token,
      `${path}/git/trees/${encodeURIComponent(repo.default_branch)}?recursive=1`,
    )
    if (tree.truncated)
      throw new Error('El repositorio es demasiado grande para el IDE.')
    const files = tree.tree.filter(
      (e) =>
        e.type === 'blob' &&
        e.mode === '100644' &&
        extensions.includes(e.path.split('.').pop() ?? ''),
    )
    if (
      files.length > 200 ||
      files.reduce((s, f) => s + (f.size ?? 0), 0) > 8 * 1024 * 1024 ||
      files.some((f) => (f.size ?? 0) > 1048576)
    )
      throw new Error(
        'El repositorio supera los límites del IDE: 200 archivos de texto y 8 MB.',
      )
    const entries: ProjectEntry[] = []
    for (let i = 0; i < files.length; i += 8) {
      entries.push(
        ...(await Promise.all(
          files.slice(i, i + 8).map(async (file) => {
            const blob = await githubRequest<{ content: string }>(
              token,
              `${path}/git/blobs/${file.sha}`,
            )
            return {
              path: file.path,
              kind: 'file' as const,
              content: Buffer.from(blob.content, 'base64').toString('utf8'),
            }
          }),
        )),
      )
    }
    if (!entries.length)
      throw new Error(
        'No hay archivos de texto compatibles en ese repositorio.',
      )
    return githubJson({
      project: addEntries(
        { ...newProject(), entries: [], tabs: [], active: '' },
        entries,
      ),
    })
  } catch (error) {
    return githubJson(
      {
        error: error instanceof Error ? error.message : 'No se pudo importar.',
      },
      400,
    )
  }
}
