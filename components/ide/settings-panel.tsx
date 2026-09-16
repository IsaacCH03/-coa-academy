'use client'
import { useRef, useState } from 'react'
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import { DEFAULT_QUICK_BAR, QUICK_ACTIONS, type AppearanceProfile, type StudioSettings } from '@/lib/ide/personalization'

type Section = 'appearance' | 'background' | 'dialogs' | 'editor' | 'shortcuts' | 'mobile' | 'accessibility' | 'profiles' | 'reset'
const sectionNames: Record<Section, string> = { appearance: '🎨 Apariencia', background: '🖼 Fondos', dialogs: '▣ Ventanas', editor: '✍ Editor', shortcuts: '⌨ Atajos', mobile: '📱 Móvil', accessibility: '♿ Accesibilidad', profiles: '💾 Perfiles', reset: '↻ Restablecer' }

export function SettingsPanel({ settings, profiles, customBackgroundUrl, onChange, onProfiles, onSaveProfile, onDeleteProfile, onImage, onRemoveImage, onReset, onPreviewDialog, notice }: {
  settings: StudioSettings
  profiles: AppearanceProfile[]
  onChange: (settings: StudioSettings) => void
  onProfiles: (profiles: AppearanceProfile[]) => void
  onSaveProfile: (name: string) => Promise<boolean>
  onDeleteProfile: (profile: AppearanceProfile) => Promise<void>
  onImage: (file: File) => Promise<string>
  onRemoveImage: () => Promise<void>
  customBackgroundUrl: string
  onReset: () => void
  onPreviewDialog: () => void
  notice: (text: string) => void
}) {
  const [section, setSection] = useState<Section>('appearance')
  const [profileName, setProfileName] = useState('Mi Setup')
  const [profileSaving, setProfileSaving] = useState(false)
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
      <h3>Estilos especiales</h3><select aria-label="Estilo especial" value={settings.style} onChange={(e) => set('style', e.target.value as StudioSettings['style'])}><option value="none">Ninguno</option><option value="vscode">Inspirado en VS Code</option><option value="eclipse">Inspirado en Eclipse</option><option value="onlinegdb">Inspirado en OnlineGDB</option><option value="python">Python clásico</option><option value="cmd">Terminal / CMD</option><option value="pixel">Pixel Art</option></select>
      {settings.style === 'cmd' && <label className="ide-field">Prompt decorativo<input value={settings.cmdPrompt} onChange={(e) => set('cmdPrompt', e.target.value.slice(0, 40))}/></label>}
    </div>}
    {section === 'background' && <div className="settings-section">
      <h3>Fondos</h3><div className="theme-grid">{(['none','city','forest','sunset','space','cyberpunk','stars','rain'] as const).map((id) => <button key={id} aria-pressed={settings.background === id} onClick={() => set('background', id)}>{({none:'Ninguno',city:'Ciudad nocturna',forest:'Bosque',sunset:'Atardecer',space:'Espacio',cyberpunk:'Cyberpunk',stars:'Estrellas animadas',rain:'Lluvia animada'})[id]}</button>)}</div>
      <input ref={upload} hidden type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={async (e) => { const file=e.target.files?.[0]; if (!file) return; if (!['image/png','image/jpeg','image/webp','image/gif'].includes(file.type) || file.size > 5_000_000) { notice('Usa una imagen PNG, JPG, WEBP o GIF de hasta 5 MB.'); return } const customBackgroundId=await onImage(file);onChange({...settings,background:'custom',customBackgroundId}) }}/><button className="ide-secondary" onClick={() => upload.current?.click()}>Subir imagen</button>{customBackgroundUrl && <><div className="background-preview" role="img" aria-label="Vista previa del fondo personalizado" style={{backgroundImage:`url("${customBackgroundUrl}")`}}/><button onClick={async()=>{await onRemoveImage();onChange({...settings,background:'none',customBackgroundId:null})}}>Quitar imagen</button></>}<small>Tu fondo personalizado, incluido GIF animado, se guarda localmente en este navegador.</small>
      <label>Visibilidad del fondo: {settings.wallpaperVisibility}%<input aria-label="Visibilidad del fondo" type="range" min="20" max="100" value={settings.wallpaperVisibility} onChange={(e)=>set('wallpaperVisibility',+e.target.value)}/></label>
      <label>Transparencia de la interfaz: {settings.interfaceTransparency}%<input aria-label="Transparencia de la interfaz" type="range" min="0" max="72" value={settings.interfaceTransparency} onChange={(e)=>set('interfaceTransparency',+e.target.value)}/></label>
      <label>Desenfoque: {settings.backgroundBlur}px<input type="range" min="0" max="12" value={settings.backgroundBlur} onChange={(e)=>set('backgroundBlur',+e.target.value)}/></label>
      <label>Oscurecimiento: {settings.backgroundDarkness}%<input type="range" min="0" max="90" value={settings.backgroundDarkness} onChange={(e)=>set('backgroundDarkness',+e.target.value)}/></label>
      <label className="ide-field">Ajuste<select value={settings.backgroundFit} onChange={(e)=>set('backgroundFit',e.target.value as StudioSettings['backgroundFit'])}><option value="cover">Cubrir</option><option value="contain">Contener</option><option value="center">Centrar</option><option value="repeat">Repetir</option></select></label>
      <label className="ide-field">Animación<select value={settings.animation} onChange={(e)=>set('animation',e.target.value as StudioSettings['animation'])}><option value="off">Desactivada</option><option value="soft">Suave</option><option value="normal">Normal</option></select></label>
      <label className="ide-check"><input type="checkbox" checked={settings.reduceMobileAnimation} onChange={(e)=>set('reduceMobileAnimation',e.target.checked)}/>Reducir animaciones en móvil</label><label className="ide-check"><input type="checkbox" checked={settings.pauseHidden} onChange={(e)=>set('pauseHidden',e.target.checked)}/>Pausar cuando la pestaña no esté visible</label>
      <button className="ide-primary" onClick={()=>notice('Fondo aplicado correctamente')}>Aplicar fondo</button>
    </div>}
    {section === 'dialogs' && <div className="settings-section">
      <h3>Ventanas emergentes</h3>
      <label className="ide-check"><input type="checkbox" checked={settings.coaGuiDialogUseTheme} onChange={(e)=>set('coaGuiDialogUseTheme',e.target.checked)}/>Color según el tema</label>
      <label className="ide-field">Posición de ventanas emergentes<select value={settings.coaGuiDialogPosition} onChange={(e)=>set('coaGuiDialogPosition',e.target.value as StudioSettings['coaGuiDialogPosition'])}><option value="center">Centro</option><option value="top">Arriba</option><option value="bottom">Abajo</option><option value="left">Izquierda</option><option value="right">Derecha</option><option value="top-left">Arriba izquierda</option><option value="top-right">Arriba derecha</option><option value="bottom-left">Abajo izquierda</option><option value="bottom-right">Abajo derecha</option></select></label>
      <button className="ide-primary" onClick={onPreviewDialog}>Probar ventana</button>
      <small>Esta preferencia se aplica a todas las ventanas de COA GUI y se guarda en este navegador.</small>
    </div>}
    {section === 'editor' && <div className="settings-section">
      <label className="ide-field">Tamaño de fuente<input type="number" min="11" max="24" value={settings.fontSize} onChange={(e)=>set('fontSize',+e.target.value)}/></label><label className="ide-field">Familia<select value={settings.fontFamily} onChange={(e)=>set('fontFamily',e.target.value as StudioSettings['fontFamily'])}><option>Consolas</option><option>Monaco</option><option>monospace</option></select></label><label className="ide-field">Altura de línea<input type="number" step="0.05" min="1.2" max="2.2" value={settings.lineHeight} onChange={(e)=>set('lineHeight',+e.target.value)}/></label>
      {[['minimap','Mostrar minimapa'],['wordWrap','Ajuste de línea'],['lineNumbers','Números de línea'],['highlightLine','Resaltar línea actual'],['autoCloseBrackets','Cerrar paréntesis automáticamente'],['autoCloseQuotes','Cerrar comillas automáticamente']].map(([key,label])=><label className="ide-check" key={key}><input type="checkbox" checked={settings[key as keyof StudioSettings] as boolean} onChange={(e)=>set(key as keyof StudioSettings,e.target.checked as never)}/>{label}</label>)}
      <label className="ide-check"><input aria-label="Barra de división de código" type="checkbox" checked={settings.splitToolbar} onChange={(e)=>set('splitToolbar',e.target.checked)}/>Barra de división de código</label>
      <label className="ide-field">Tamaño de interfaz<select value={settings.density} onChange={(e)=>set('density',e.target.value as StudioSettings['density'])}><option value="compact">Compacto</option><option value="normal">Normal</option><option value="large">Grande</option></select></label>
    </div>}
    {section === 'shortcuts' && <div className="settings-section"><h3>Atajos de escritura</h3><label className="ide-check"><input aria-label="Atajos de escritura" type="checkbox" checked={settings.writingShortcuts} onChange={(e)=>set('writingShortcuts',e.target.checked)}/>Activado</label><label className="ide-field">Cantidad visible<input aria-label="Cantidad visible" type="number" min="4" max={QUICK_ACTIONS.length} value={settings.shortcutCount} onChange={(e)=>set('shortcutCount',+e.target.value)}/></label><label className="ide-field">Mostrar en<select aria-label="Mostrar atajos en" value={settings.shortcutVisibility} onChange={(e)=>set('shortcutVisibility',e.target.value as StudioSettings['shortcutVisibility'])}><option value="all">Escritorio y móvil</option><option value="desktop">Solo escritorio</option><option value="mobile">Solo móvil</option></select></label><label className="ide-field">Agregar atajo<select value="" onChange={(e)=>{if(e.target.value && !settings.quickBar.includes(e.target.value as never)) set('quickBar',[...settings.quickBar,e.target.value as never])}}><option value="">Elegir…</option>{QUICK_ACTIONS.map(a=><option key={a}>{a}</option>)}</select></label><ol className="quick-order">{settings.quickBar.map((a,i)=><li key={a}><span>{a}</span><button aria-label={`Mover ${a} a la izquierda`} onClick={()=>move(i,-1)}><ChevronUp size={14}/></button><button aria-label={`Mover ${a} a la derecha`} onClick={()=>move(i,1)}><ChevronDown size={14}/></button><button aria-label={`Quitar ${a}`} onClick={()=>set('quickBar',settings.quickBar.filter(x=>x!==a))}><Trash2 size={14}/></button></li>)}</ol><button onClick={()=>set('quickBar',[...DEFAULT_QUICK_BAR])}>Restaurar barra predeterminada</button></div>}
    {section === 'mobile' && <div className="settings-section"><label className="ide-check"><input type="checkbox" checked={settings.mobileFocus} onChange={(e)=>set('mobileFocus',e.target.checked)}/>Modo enfoque al escribir</label><p className="ide-muted">La barra de escritura se configura en Atajos.</p></div>}
    {section === 'accessibility' && <div className="settings-section"><label className="ide-check"><input type="checkbox" checked={settings.reduceMotion} onChange={(e)=>set('reduceMotion',e.target.checked)}/>Reducir movimiento</label><label className="ide-check"><input type="checkbox" checked={settings.highContrast} onChange={(e)=>set('highContrast',e.target.checked)}/>Mayor contraste</label><label className="ide-field">Tamaño de interfaz<select value={settings.density} onChange={(e)=>set('density',e.target.value as StudioSettings['density'])}><option value="compact">Compacto</option><option value="normal">Normal</option><option value="large">Grande</option></select></label></div>}
    {section === 'profiles' && <div className="settings-section"><label className="ide-field">Nombre<input value={profileName} onChange={(e)=>setProfileName(e.target.value)}/></label><button className="ide-primary" disabled={profileSaving} onClick={async()=>{const name=profileName.trim();if(!name)return;setProfileSaving(true);try{await onSaveProfile(name)}finally{setProfileSaving(false)}}}>{profileSaving?'Guardando perfil…':'Guardar perfil'}</button>{profiles.map(p=><div className="profile-row" key={p.id}><input aria-label={`Nombre de ${p.name}`} value={p.name} onChange={(e)=>onProfiles(profiles.map(x=>x.id===p.id?{...x,name:e.target.value}:x))}/><button onClick={()=>onChange({...p.settings,quickBar:[...p.settings.quickBar]})}>Aplicar</button><button aria-label={`Eliminar ${p.name}`} onClick={()=>void onDeleteProfile(p)}><Trash2 size={14}/></button></div>)}</div>}
    {section === 'reset' && <div className="settings-section"><p>Restaura únicamente la apariencia, editor, móvil y accesibilidad. Tus proyectos y archivos permanecen intactos.</p><button className="ide-danger" onClick={onReset}>Restaurar configuración predeterminada</button></div>}
  </section>
}
