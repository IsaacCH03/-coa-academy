import{describe,expect,it}from'vitest'
import{costaRicaDeadline,isSafeAcademicFilename,liveGroupCourseId,liveGroupSlug,resolveLiveGroupCover,validateLiveGroupCover}from'./live-groups'

describe('grupos en vivo',()=>{
  it('crea slugs estables',()=>expect(liveGroupSlug('Python H-26')).toBe('python-h-26'))
  it('exige curso en privados y permite públicos independientes',()=>{expect(()=>liveGroupCourseId('private','')).toThrow(/obligatorio/);expect(liveGroupCourseId('private','course-1')).toBe('course-1');expect(liveGroupCourseId('public','')).toBeNull()})
  it('convierte límites de Costa Rica a UTC',()=>expect(costaRicaDeadline('2026-10-17','23:59')).toBe('2026-10-18T05:59:00.000Z'))
  it('rechaza ejecutables peligrosos',()=>{
    expect(isSafeAcademicFilename('tarea.pdf')).toBe(true)
    expect(isSafeAcademicFilename('tarea.exe')).toBe(false)
    expect(isSafeAcademicFilename('tarea.pdf','application/x-msdownload')).toBe(false)
  })
  it('valida MIME, extensión y límite de las portadas',()=>{
    expect(validateLiveGroupCover({name:'grupo.png',type:'image/png',size:1024})).toBeNull()
    expect(validateLiveGroupCover({name:'grupo.exe',type:'image/png',size:1024})).toMatch(/PNG/)
    expect(validateLiveGroupCover({name:'grupo.png',type:'image/png',size:5*1024*1024+1})).toMatch(/5 MB/)
  })
})

describe('portadas privadas',()=>{
  it('firma el path estable solamente cuando existe',async()=>{
    const calls:string[]=[]
    const client={storage:{from:(bucket:string)=>({createSignedUrl:async(path:string)=>{calls.push(`${bucket}:${path}`);return{data:{signedUrl:'https://signed.example/cover'},error:null}}})}}
    expect(await resolveLiveGroupCover(client,null)).toBeNull()
    expect(await resolveLiveGroupCover(client,'group/covers/file')).toBe('https://signed.example/cover')
    expect(calls).toEqual(['live-group-assets:group/covers/file'])
  })

  it('permite usar placeholder cuando Storage no puede firmar',async()=>{
    const client={storage:{from:()=>({createSignedUrl:async()=>({data:null,error:{message:'denied'}})})}}
    expect(await resolveLiveGroupCover(client,'group/covers/file')).toBeNull()
  })
})
