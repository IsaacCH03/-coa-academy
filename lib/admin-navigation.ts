export function safeAdminReturnTo(value:string|undefined,fallback:string){
 if(!value)return fallback
 try{
  const target=new URL(value,'http://coa.internal')
  if(target.origin!=='http://coa.internal'||(target.pathname!=='/admin'&&!target.pathname.startsWith('/admin/')))return fallback
  return `${target.pathname}${target.search}${target.hash}`
 }catch{return fallback}
}

export function adminReturnLabel(target:string,fallback='Volver'){
 if(target.startsWith('/admin/entregas'))return 'Volver a entregas'
 if(target.startsWith('/admin/grupos'))return 'Volver a grupos en vivo'
 if(target.startsWith('/admin/cursos/'))return 'Volver al curso'
 if(target.startsWith('/admin/solicitudes'))return 'Volver a solicitudes'
 if(target.startsWith('/admin/proyectos'))return 'Volver a proyectos'
 return fallback
}
