// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import ExcelViewer from './excel-viewer'

afterEach(() => vi.restoreAllMocks())

it('shows a friendly error while retaining the technical parser error internally', async () => {
  const log = vi.spyOn(console, 'error').mockImplementation(() => {})
  render(<ExcelViewer entry={{ path: 'externo.xlsx', kind: 'file', content: 'bm8gZXMgdW4gemlw', encoding: 'base64' }} />)
  const alert = await screen.findByRole('alert')
  expect(alert.textContent).toContain('No se pudo visualizar este archivo Excel.')
  expect(alert.textContent).not.toContain('startsWith')
  expect(log).toHaveBeenCalledWith(expect.stringContaining('externo.xlsx'), expect.any(Error))
})
