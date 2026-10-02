export type LiveGroupStatus='preparation'|'active'|'finished'
export type LiveGroupItemType='text'|'file'|'link'|'assignment'
export const LIVE_GROUP_COVER_MAX_BYTES=5*1024*1024
const coverTypes:Record<string,RegExp>={
  'image/png':/\.png$/i,
  'image/jpeg':/\.(jpe?g)$/i,
  'image/webp':/\.webp$/i,
}
export const liveGroupStatusLabel:Record<LiveGroupStatus,string>={preparation:'Preparación',active:'Activo',finished:'Finalizado'}
export function liveGroupSlug(value:string){return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,80)}
export function liveGroupCourseId(accessType:'private'|'public',courseId:string){if(accessType==='private'&&!courseId)throw new Error('El curso base es obligatorio para grupos privados.');return courseId||null}
export function costaRicaDeadline(date:string,time:string){if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!/^\d{2}:\d{2}$/.test(time))return null;const parsed=new Date(`${date}T${time}:00-06:00`);return Number.isNaN(parsed.valueOf())?null:parsed.toISOString()}
export function isSafeAcademicFilename(name:string,mime=''){return !/\.(exe|msi|bat|cmd|com|scr|ps1|sh|apk|dmg|iso|dll|jar)$/i.test(name)&&!/(x-msdownload|x-msdos-program|x-executable|x-sh|x-bat|portable-executable)/i.test(mime)&&name.length>0&&name.length<=255}
export function validateLiveGroupCover(file:{name:string;type:string;size:number}){
  if(!coverTypes[file.type]?.test(file.name))return 'La portada debe ser PNG, JPG o WebP.'
  if(file.size>LIVE_GROUP_COVER_MAX_BYTES)return 'La portada supera el límite permitido de 5 MB.'
  if(file.size<1)return 'Selecciona una imagen válida.'
  return null
}

type StorageClient = {
  storage: {
    from(bucket: string): {
      createSignedUrl(path: string, expiresIn: number): Promise<{data:{signedUrl:string}|null;error:unknown}>
    }
  }
}

export async function resolveLiveGroupCover(client:StorageClient,path:string|null|undefined){
  if(!path)return null
  const{data,error}=await client.storage.from('live-group-assets').createSignedUrl(path,3600)
  if(error||!data?.signedUrl){
    if(process.env.NODE_ENV!=='production')console.error('[sign-live-group-cover]',{path,error})
    return null
  }
  return data.signedUrl
}
