import{SiteHeader}from'./site-header';import{SiteFooter}from'./site-footer';import type{ReactNode}from'react'
export function Phase3Shell({children,wide=false}:{children:ReactNode;wide?:boolean}){return <div className="min-h-screen bg-secondary/30"><SiteHeader/><main className={`mx-auto px-4 py-8 sm:py-12 ${wide?'max-w-[1440px]':'max-w-6xl'}`}>{children}</main><SiteFooter/></div>}
export const Field=({label,children}:{label:string;children:ReactNode})=><label className="grid gap-2 text-sm font-semibold">{label}{children}</label>
export const inputClass='min-h-11 rounded-xl border border-border bg-background px-3 py-2 text-foreground'
