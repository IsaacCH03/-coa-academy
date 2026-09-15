'use client'
import { useRef, useState } from 'react'
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import { DEFAULT_QUICK_BAR, QUICK_ACTIONS, type AppearanceProfile, type StudioSettings } from '@/lib/ide/personalization'

type Section = 'appearance' | 'background' | 'editor' | 'mobile' | 'accessibility' | 'profiles' | 'reset'
const sectionNames: Record<Section, string> = { appearance: '🎨 Apariencia', background: '🖼 Fondos', editor: '✍ Editor', mobile: '📱 Móvil', accessibility: '♿ Accesibilidad', profiles: '💾 Perfiles', reset: '↻ Restablecer' }

export function SettingsPanel({ settings, profiles, onChange, onProfiles, onImage, onReset, notice }: {
  settings: StudioSettings
  profiles: AppearanceProfile[]
  onChange: (settings: StudioSettings) => void
  onProfiles: (profiles: AppearanceProfile[]) => void
  onImage: (file: File) => Promise<void>
  onReset: () => void
  notice: (text: string) => void
}) {
  const [section, setSection] = useState<Section>('appearance')
  const [profileName, setProfileName] = useState('Mi Setup')
  const upload = useRef<HTMLInputElement>(null)
  const set = <K extends keyof StudioSettings>(key: K, value: StudioSettings[K]) => onChange({ ...settings, [key]: value })
  const move = (index: number, amount: number) => {
    const next = [...settings.quickBar]
    const target = index + amount
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    set('quickBar', next)
  }
  return <section className="ide-panel settings-panel">
    <p className="ide-eyebrow">CONFIGURACIÓN</p><h2>Personaliza tu Studio</h2>
    <div className="settings-nav">{(Object.keys(sectionNames) as Section[]).map((id) => <button key={id} className={section === id ? 'active' : ''} onClick={() => setSection(id)}>{sectionNames[id]}</button>)}</div>
    {section === 'appearance' && <div className="settings-section">
      <h3>Temas COA</h3><div className="theme-grid">{(['coa','blue','purple','pink','red','green','orange','mono'] as const).map((id) => <button key={id} aria-pressed={settings.accent === id} onClick={() => set('accent', id)}>{{coa:'COA / Predeterminado',blue:'Azul',purple:'Morado',pink:'Rosa',red:'Rojo',green:'Verde',orange:'Naranja',mono:'Monocromático'}[id]}</button>)}</div>
      <label className="ide-field">Color personalizado <input aria-label="Color personalizado" type="color" value={settings.customColor} onChange={(e) => onChange({ ...settings, accent: 'custom', customColor: e.target.value })}/></label>
      <h3>Estilos especiales</h3><select aria-label="Estilo especial" value={settings.style} onChange={(e) => set('style', e.target.value as StudioSettings['style'])}><option value="none">Ninguno</option><option value="vscode">Inspirado en VS Code</option><option value="eclipse">Inspirado en Eclipse</option><option value="onlinegdb">Inspirado en OnlineGDB</option><option value="python">Python clásico</option><option value="cmd">Terminal / CMD</option></select>
      {settings.style === 'cmd' && <label className="ide-field">Prompt decorativo<input value={settings.cmdPrompt} onChange={(e) => set('cmdPrompt', e.target.value.slice(0, 40))}/></label>}
    </div>}
    {section === 'background' && <div className="settings-section">
      <h3>Fondos</h3><div className="theme-grid">{(['none','city','forest','sunset','space','cyberpunk','stars','rain'] as const).map((id) => <button key={id} aria-pressed={settings.background === id} onClick={() => set('background', id)}>{({none:'Ninguno',city:'Ciudad nocturna',forest:'Bosque',sunset:'Atardecer',space:'Espacio',cyberpunk:'Cyberpunk',stars:'Estrellas animadas',rain:'Lluvia animada'})[id]}</button>)}</div>
      <input ref={upload} hidden type="file" accept="image/png,image/jpeg,image/webp" onChange={async (e) => { const file=e.target.files?.[0]; if (!file) return; if (!['image/png','image/jpeg','image/webp'].includes(file.type) || file.size > 5_000_000) { notice('Usa una imagen PNG, JPG o WEBP de hasta 5 MB.'); return } await onImage(file); set('background','custom') }}/><button className="ide-secondary" onClick={() => upload.current?.click()}>Subir imagen</button><small>Tu fondo personalizado se guarda localmente en este navegador.</small>
      <label>Opacidad: {settings.backgroundOpacity}%<input type="range" min="0" max="70" value={settings.backgroundOpacity} onChange={(e)=>set('backgroundOpacity',+e.target.value)}/></label>
      <label>Desenfoque: {settings.backgroundBlur}px<input type="range" min="0" max="12" value={settings.backgroundBlur} onChange={(e)=>set('backgroundBlur',+e.target.value)}/></label>
      <label>Oscurecimiento: {settings.backgroundDarkness}%<input type="range" min="0" max="90" value={settings.backgroundDarkness} onChange={(e)=>set('backgroundDarkness',+e.target.value)}/></label>
      <label className="ide-field">Ajuste<select value={settings.backgroundFit} onChange={(e)=>set('backgroundFit',e.target.value as StudioSettings['backgroundFit'])}><option value="cover">Cubrir</option><option value="contain">Contener</option><option value="center">Centrar</option><option value="repeat">Repetir</option></select></label>
      <label className="ide-field">Animación<select value={settings.animation} onChange={(e)=>set('animation',e.target.value as StudioSettings['animation'])}><option value="off">Desactivada</option><option value="soft">Suave</option><option value="normal">Normal</option></select></label>
      <label className="ide-check"><input type="checkbox" checked={settings.reduceMobileAnimation} onChange={(e)=>set('reduceMobileAnimation',e.target.checked)}/>Reducir animaciones en móvil</label><label className="ide-check"><input type="checkbox" checked={settings.pauseHidden} onChange={(e)=>set('pauseHidden',e.target.checked)}/>Pausar cuando la pestaña no esté visible</label>
    </div>}
    {section === 'editor' && <div className="settings-section">
      <label className="ide-field">Tamaño de fuente<input type="number" min="11" max="24" value={settings.fontSize} onChange={(e)=>set('fontSize',+e.target.value)}/></label><label className="ide-field">Familia<select value={settings.fontFamily} onChange={(e)=>set('fontFamily',e.target.value as StudioSettings['fontFamily'])}><option>Consolas</option><option>Monaco</option><option>monospace</option></select></label><label className="ide-field">Altura de línea<input type="number" step="0.05" min="1.2" max="2.2" value={settings.lineHeight} onChange={(e)=>set('lineHeight',+e.target.value)}/></label>
      {[['minimap','Mostrar minimapa'],['wordWrap','Ajuste de línea'],['lineNumbers','Números de línea'],['highlightLine','Resaltar línea actual'],['autoCloseBrackets','Cerrar paréntesis automáticamente'],['autoCloseQuotes','Cerrar comillas automáticamente']].map(([key,label])=><label className="ide-check" key={key}><input type="checkbox" checked={settings[key as keyof StudioSettings] as boolean} onChange={(e)=>set(key as keyof StudioSettings,e.target.checked as never)}/>{label}</label>)}
      <label className="ide-field">Tamaño de interfaz<select value={settings.density} onChange={(e)=>set('density',e.target.value as StudioSettings['density'])}><option value="compact">Compacto</option><option value="normal">Normal</option><option value="large">Grande</option></select></label>
    </div>}
    {section === 'mobile' && <div className="settings-section"><label className="ide-check"><input type="checkbox" checked={settings.mobileFocus} onChange={(e)=>set('mobileFocus',e.target.checked)}/>Modo enfoque al escribir</label><h3>Barra rápida</h3><label className="ide-field">Agregar atajo<select value="" onChange={(e)=>{if(e.target.value && !settings.quickBar.includes(e.target.value as never)) set('quickBar',[...settings.quickBar,e.target.value as never])}}><option value="">Elegir…</option>{QUICK_ACTIONS.map(a=><option key={a}>{a}</option>)}</select></label><ol className="quick-order">{settings.quickBar.map((a,i)=><li key={a}><span>{a}</span><button aria-label={`Subir ${a}`} onClick={()=>move(i,-1)}><ChevronUp size={14}/></button><button aria-label={`Bajar ${a}`} onClick={()=>move(i,1)}><ChevronDown size={14}/></button><button aria-label={`Quitar ${a}`} onClick={()=>set('quickBar',settings.quickBar.filter(x=>x!==a))}><Trash2 size={14}/></button></li>)}</ol><button onClick={()=>set('quickBar',[...DEFAULT_QUICK_BAR])}>Restaurar barra predeterminada</button></div>}
    {section === 'accessibility' && <div className="settings-section"><label className="ide-check"><input type="checkbox" checked={settings.reduceMotion} onChange={(e)=>set('reduceMotion',e.target.checked)}/>Reducir movimiento</label><label className="ide-check"><input type="checkbox" checked={settings.highContrast} onChange={(e)=>set('highContrast',e.target.checked)}/>Mayor contraste</label><label className="ide-field">Tamaño de interfaz<select value={settings.density} onChange={(e)=>set('density',e.target.value as StudioSettings['density'])}><option value="compact">Compacto</option><option value="normal">Normal</option><option value="large">Grande</option></select></label></div>}
    {section === 'profiles' && <div className="settings-section"><label className="ide-field">Nombre<input value={profileName} onChange={(e)=>setProfileName(e.target.value)}/></label><button className="ide-primary" onClick={()=>{const name=profileName.trim();if(!name)return;onProfiles([...profiles,{id:crypto.randomUUID(),name,settings:{...settings,quickBar:[...settings.quickBar]}}])}}>Guardar perfil</button>{profiles.map(p=><div className="profile-row" key={p.id}><input aria-label={`Nombre de ${p.name}`} value={p.name} onChange={(e)=>onProfiles(profiles.map(x=>x.id===p.id?{...x,name:e.target.value}:x))}/><button onClick={()=>onChange(p.settings)}>Aplicar</button><button aria-label={`Eliminar ${p.name}`} onClick={()=>onProfiles(profiles.filter(x=>x.id!==p.id))}><Trash2 size={14}/></button></div>)}</div>}
    {section === 'reset' && <div className="settings-section"><p>Restaura únicamente la apariencia, editor, móvil y accesibilidad. Tus proyectos y archivos permanecen intactos.</p><button className="ide-danger" onClick={onReset}>Restaurar configuración predeterminada</button></div>}
  </section>
}
