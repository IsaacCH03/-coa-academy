// @vitest-environment jsdom
import{cleanup,fireEvent,render,screen}from'@testing-library/react'
import{afterEach,expect,it}from'vitest'
import{ThemeToggle}from'./theme-toggle'
afterEach(()=>{cleanup();document.documentElement.className='';localStorage.clear()})
it('alterna y persiste cada elección explícita',()=>{document.documentElement.classList.add('light');render(<ThemeToggle/>);fireEvent.click(screen.getByRole('menuitem',{name:/Modo oscuro/}));expect(document.documentElement.classList.contains('dark')).toBe(true);expect(localStorage.getItem('coa-theme')).toBe('dark');fireEvent.click(screen.getByRole('menuitem',{name:/Modo claro/}));expect(document.documentElement.classList.contains('light')).toBe(true);expect(localStorage.getItem('coa-theme')).toBe('light')})
