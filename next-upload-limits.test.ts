import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const config = readFileSync('next.config.mjs', 'utf8')

describe('Next upload transport limits', () => {
  it('leaves multipart overhead above the existing 50 MB material limit', () => {
    expect(config).toContain("serverActions: { bodySizeLimit: '51mb' }")
    expect(config).toContain("proxyClientMaxBodySize: '51mb'")
  })
})
