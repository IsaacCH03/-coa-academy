// @vitest-environment jsdom
import { beforeEach, expect, it } from 'vitest'
import { loadExtensions, normalizeExtensions, saveExtensions } from './extensions'

beforeEach(()=>localStorage.clear())
it('persists installed, enabled and uninstalled extension state locally',()=>{
  expect(loadExtensions()['excel-viewer']).toEqual({installed:false,enabled:false})
  saveExtensions({'excel-viewer':{installed:true,enabled:true}})
  expect(loadExtensions()['excel-viewer']).toEqual({installed:true,enabled:true})
  expect(normalizeExtensions({'excel-viewer':{installed:true,enabled:false}})['excel-viewer'].enabled).toBe(false)
  saveExtensions({'excel-viewer':{installed:false,enabled:false}})
  expect(loadExtensions()['excel-viewer'].installed).toBe(false)
})
