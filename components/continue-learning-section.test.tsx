// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const state = vi.hoisted(() => ({
  result: { status: 'guest', enrollments: [] } as { status:string;enrollments:unknown[];userId?:string },
  memberships: [] as unknown[],
  signedUrl: null as string|null,
}))

vi.mock('@/lib/student-enrollments',async(importOriginal)=>{
  const original=await importOriginal<typeof import('@/lib/student-enrollments')>()
  return{...original,getCurrentStudentEnrollments:vi.fn(async()=>state.result)}
})
vi.mock('@/lib/supabase/server',()=>({createClient:vi.fn(async()=>({
  from:()=>({
    select:()=>({
      eq:()=>({
        eq:()=>({
          order:async()=>({data:state.memberships}),
        }),
      }),
    }),
  }),
  storage:{from:()=>({createSignedUrl:async()=>state.signedUrl?{data:{signedUrl:state.signedUrl},error:null}:{data:null,error:{message:'denied'}}})},
}))}))
vi.mock('@/components/course-rail',()=>({
  CourseRail:({courses}:{courses:{slug:string;title:string;image:string;href?:string}[]})=><div>{courses.map(course=><a key={course.slug} data-image={course.image} href={course.href??`/mi-coa/cursos/${course.slug}`}>{course.title}</a>)}</div>,
}))

import { ContinueLearningSection } from './continue-learning-section'

const row=(slug:string,status='active',courseStatus='published')=>({id:slug,status,enrolled_at:'2026-09-25T00:00:00Z',courses:{id:`course-${slug}`,slug,title:slug,status:courseStatus}})
const membership=(imagePath:string|null)=>({joined_at:'2026-09-28T00:00:00Z',live_groups:{id:'group-id',slug:'python-r26',name:'Python R26',status:'active',image_path:imagePath,courses:{title:'Python Nivel 1'}}})

describe('ContinueLearningSection',()=>{
  beforeEach(()=>{state.result={status:'guest',enrollments:[]};state.memberships=[];state.signedUrl=null})
  afterEach(cleanup)

  it('does not render for visitors or students without enrollments',async()=>{
    const{container,rerender}=render(await ContinueLearningSection())
    expect(container.innerHTML).toBe('')
    state.result={status:'success',enrollments:[]}
    rerender(await ContinueLearningSection())
    expect(container.innerHTML).toBe('')
  })

  it('renders the real enrolled course and keeps its image',async()=>{
    state.result={status:'success',enrollments:[row('python-practico')]}
    render(await ContinueLearningSection())
    expect(screen.getByRole('heading',{name:'Continúa aprendiendo'})).toBeTruthy()
    expect(screen.getByRole('link',{name:'Python Práctico'}).getAttribute('href')).toBe('/mi-coa/cursos/python-practico')
  })

  it('shows only active published courses from the authenticated student',async()=>{
    state.result={status:'success',enrollments:[row('python-practico'),row('sql-bases-datos'),row('desarrollo-web-django','cancelled'),row('programacion-con-ia','active','draft')]}
    render(await ContinueLearningSection())
    expect(screen.getByRole('link',{name:'Python Práctico'})).toBeTruthy()
    expect(screen.getByRole('link',{name:'SQL y Bases de Datos Relacionales'})).toBeTruthy()
    expect(screen.queryByText(/Django/)).toBeNull()
  })

  it('passes the signed live-group cover to the card image property',async()=>{
    state.result={status:'success',enrollments:[],userId:'student-id'}
    state.memberships=[membership('group-id/covers/file-id')]
    state.signedUrl='https://signed.example/python-r26.png'
    render(await ContinueLearningSection())
    const card=screen.getByRole('link',{name:'Python Nivel 1'})
    expect(card.getAttribute('data-image')).toBe('https://signed.example/python-r26.png')
    expect(card.getAttribute('href')).toBe('/mi-coa/grupos/python-r26')
  })

  it('uses the placeholder only when the live group has no cover',async()=>{
    state.result={status:'success',enrollments:[],userId:'student-id'}
    state.memberships=[membership(null)]
    render(await ContinueLearningSection())
    expect(screen.getByRole('link',{name:'Python Nivel 1'}).getAttribute('data-image')).toBe('/placeholder.svg')
  })
})
