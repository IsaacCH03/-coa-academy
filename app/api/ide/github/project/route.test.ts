import { beforeEach, afterEach, expect, it, vi } from 'vitest'
import { POST, GET } from './route'
import { newProject } from '@/lib/ide/project'
import { githubRequest } from '@/lib/ide/github-server'
vi.mock('@/lib/ide/github-server', async (original) => ({
  ...(await original<typeof import('@/lib/ide/github-server')>()),
  githubToken: async () => 'unit-test-token',
  githubRequest: vi.fn(),
}))
beforeEach(() => {
  vi.stubEnv('COA_APP_URL', 'https://cursoscoa.com')
  vi.mocked(githubRequest).mockReset()
})
afterEach(() => vi.unstubAllEnvs())
const request = (
  data: Record<string, unknown>,
  origin = 'https://cursoscoa.com',
) =>
  new Request('https://cursoscoa.com/api/ide/github/project', {
    method: 'POST',
    headers: { origin, 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
it('creates a commit preserving remote files and updates without force', async () => {
  vi.mocked(githubRequest)
    .mockResolvedValueOnce({ default_branch: 'main' })
    .mockResolvedValueOnce({ object: { sha: 'head' } })
    .mockResolvedValueOnce({ tree: { sha: 'base' } })
    .mockResolvedValueOnce({ sha: 'tree' })
    .mockResolvedValueOnce({ sha: 'commit' })
    .mockResolvedValueOnce({})
  const response = await POST(
    request({
      project: newProject(),
      repository: 'student/example',
      message: 'Práctica',
    }),
  )
  expect(response.status).toBe(200)
  expect(githubRequest).toHaveBeenCalledWith(
    'unit-test-token',
    '/repos/student/example/git/trees',
    'POST',
    expect.objectContaining({
      base_tree: 'base',
      tree: [
        expect.objectContaining({
          path: 'main.py',
          content: expect.any(String),
        }),
      ],
    }),
  )
  expect(githubRequest).toHaveBeenLastCalledWith(
    'unit-test-token',
    '/repos/student/example/git/refs/heads/main',
    'PATCH',
    { sha: 'commit', force: false },
  )
})
it('does not create an empty repository or accept cross-site uploads', async () => {
  const empty = { ...newProject(), entries: [], active: '', tabs: [] }
  expect(
    (
      await POST(
        request({
          project: empty,
          create: true,
          name: 'example',
          message: 'test',
        }),
      )
    ).status,
  ).toBe(400)
  expect(
    (
      await POST(
        request(
          {
            project: newProject(),
            repository: 'student/example',
            message: 'test',
          },
          'https://evil.example',
        ),
      )
    ).status,
  ).toBe(400)
  expect(githubRequest).not.toHaveBeenCalled()
})
it('imports supported text files and keeps their directories', async () => {
  vi.mocked(githubRequest)
    .mockResolvedValueOnce({ default_branch: 'main' })
    .mockResolvedValueOnce({
      truncated: false,
      tree: [
        {
          path: 'business/logic.py',
          type: 'blob',
          mode: '100644',
          sha: 'blob',
          size: 8,
        },
        {
          path: 'image.png',
          type: 'blob',
          mode: '100644',
          sha: 'ignored',
          size: 8,
        },
      ],
    })
    .mockResolvedValueOnce({
      content: Buffer.from('print(1)').toString('base64'),
    })
  const response = await GET(
    new Request(
      'https://cursoscoa.com/api/ide/github/project?repository=student/example',
    ),
  )
  const body = await response.json()
  expect(body.project.entries).toContainEqual({
    path: 'business/logic.py',
    kind: 'file',
    content: 'print(1)',
  })
  expect(body.project.entries).toContainEqual({
    path: 'business',
    kind: 'folder',
    content: '',
  })
  expect(githubRequest).toHaveBeenCalledTimes(3)
})
it('reports GitHub conflicts without attempting a force push', async () => {
  vi.mocked(githubRequest).mockRejectedValueOnce(
    new Error('GitHub detectó un conflicto.'),
  )
  const response = await POST(
    request({
      project: newProject(),
      repository: 'student/example',
      message: 'test',
    }),
  )
  expect(response.status).toBe(400)
  expect((await response.json()).error).toContain('conflicto')
  expect(githubRequest).toHaveBeenCalledTimes(1)
})
