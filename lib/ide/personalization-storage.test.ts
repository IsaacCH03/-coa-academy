import 'fake-indexeddb/auto'
import { describe, expect, it } from 'vitest'
import { deleteCustomBackground, loadCustomBackground, saveCustomBackground } from './personalization-storage'

describe('custom profile backgrounds', () => {
  it('stores independent copies so deleting one GIF cannot break another profile', async () => {
    const gif = new Blob([new Uint8Array([71, 73, 70, 56, 57, 97, 1])], { type: 'image/gif' })
    const first = await saveCustomBackground(gif)
    const second = await saveCustomBackground(await loadCustomBackground(first) as Blob)

    expect(first).not.toBe(second)
    expect(await (await loadCustomBackground(first))?.arrayBuffer()).toEqual(await gif.arrayBuffer())
    expect(await (await loadCustomBackground(second))?.arrayBuffer()).toEqual(await gif.arrayBuffer())

    await deleteCustomBackground(first)
    expect(await loadCustomBackground(first)).toBeUndefined()
    expect(await (await loadCustomBackground(second))?.arrayBuffer()).toEqual(await gif.arrayBuffer())
  })
})
