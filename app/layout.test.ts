import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const layout = readFileSync('app/layout.tsx', 'utf8')

describe('tema inicial', () => {
  it('usa claro sin preferencia y sólo activa oscuro por elección guardada', () => {
    expect(layout).toContain("localStorage.getItem('coa-theme')==='dark'")
    expect(layout).not.toContain('prefers-color-scheme')
    expect(layout).toContain("classList.add(d?'dark':'light')")
  })
})
