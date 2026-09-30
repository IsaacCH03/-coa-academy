import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const manifest = JSON.parse(readFileSync('package.json', 'utf8')) as {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  pnpm?: { overrides?: Record<string, string> }
}

describe('production dependency security', () => {
  it('keeps the shadcn CLI out of the production dependency tree', () => {
    expect(manifest.dependencies?.shadcn).toBeUndefined()
    expect(manifest.devDependencies?.shadcn).toBeDefined()
  })

  it('pins patched transitive versions used by the Next build toolchain', () => {
    expect(manifest.pnpm?.overrides).toMatchObject({
      'baseline-browser-mapping': '>=2.11.0',
      browserslist: '>=4.28.7',
      'nanoid@3': '>=3.3.18',
    })
  })
})
