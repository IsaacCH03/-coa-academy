'use client'
import { useSyncExternalStore } from 'react'
import { Moon, Sun } from 'lucide-react'

type Theme='light'|'dark'
function currentTheme():Theme{return document.documentElement.classList.contains('dark')?'dark':'light'}
function subscribe(callback:()=>void){window.addEventListener('coa-theme-change',callback);window.addEventListener('storage',callback);return()=>{window.removeEventListener('coa-theme-change',callback);window.removeEventListener('storage',callback)}}
export function ThemeToggle({compact=false}:{compact?:boolean}){
  const theme=useSyncExternalStore(subscribe,currentTheme,():Theme=>'light')
  const toggle=()=>{const next:Theme=currentTheme()==='dark'?'light':'dark';document.documentElement.classList.remove('light','dark');document.documentElement.classList.add(next);localStorage.setItem('coa-theme',next);window.dispatchEvent(new Event('coa-theme-change'))}
  const Icon=theme==='dark'?Sun:Moon
  return <button type="button" role="menuitem" onClick={toggle} className={`flex w-full items-center gap-3 rounded-xl text-left text-sm font-semibold transition-colors hover:bg-secondary ${compact?'px-3 py-2':'p-3'}`}><span className={compact?'text-primary':'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary'}><Icon className="h-5 w-5"/></span><span><strong className="block">{theme==='dark'?'Modo claro':'Modo oscuro'}</strong>{!compact&&<span className="mt-0.5 block text-xs font-normal text-muted-foreground">Cambiar la apariencia de COA</span>}</span></button>
}
