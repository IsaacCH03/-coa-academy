'use client'

import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'

type Notification = { id: string; title: string; message: string; href: string | null; read_at: string | null; created_at: string }

export function NotificationBell() {
  const [items, setItems] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)
  useEffect(() => { fetch('/api/academic/notifications').then((response) => response.ok ? response.json() : null).then((body) => body && setItems(body.notifications ?? [])).catch(() => undefined) }, [])
  const unread = items.filter((item) => !item.read_at).length
  async function markRead(item: Notification) {
    if (!item.read_at) { await fetch('/api/academic/notifications', { method: 'PATCH', keepalive: true, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: item.id }) }); setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, read_at: new Date().toISOString() } : entry)) }
  }
  const content = (item: Notification) => <><span className="font-bold text-foreground">{item.title}</span><span className="mt-1 block">{item.message}</span><span className="mt-1 block text-xs">{new Intl.DateTimeFormat('es-CR', { dateStyle: 'medium' }).format(new Date(item.created_at))}</span></>
  return <div className="relative"><button type="button" aria-label={`Notificaciones${unread ? `, ${unread} sin leer` : ''}`} onClick={() => setOpen(!open)} className="relative rounded-lg border border-border p-2 hover:bg-secondary"><Bell className="h-5 w-5" />{unread > 0 && <span className="absolute -right-2 -top-2 min-w-5 rounded-full bg-destructive px-1 text-center text-xs font-bold text-destructive-foreground">{unread}</span>}</button>{open && <div className="absolute right-0 z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-xl border border-border bg-background p-2 shadow-xl"><p className="px-3 py-2 font-bold">Notificaciones</p>{items.length === 0 ? <p className="px-3 py-4 text-sm text-muted-foreground">No tienes notificaciones.</p> : items.map((item) => item.href ? <a key={item.id} href={item.href} onClick={() => void markRead(item)} className={`block w-full rounded-lg px-3 py-3 text-left text-sm hover:bg-secondary ${item.read_at ? 'text-muted-foreground' : 'bg-primary/5'}`}>{content(item)}</a> : <button type="button" key={item.id} onClick={() => void markRead(item)} className={`block w-full rounded-lg px-3 py-3 text-left text-sm hover:bg-secondary ${item.read_at ? 'text-muted-foreground' : 'bg-primary/5'}`}>{content(item)}</button>)}</div>}</div>
}
