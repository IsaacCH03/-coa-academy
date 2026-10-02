import{describe,expect,it}from'vitest'
import{submissionGroupName,type AdminSubmission}from'./page'
const base={id:'s',student_id:'student',activity_id:'activity',submitted_at:'2026-09-30T20:00:00Z',profiles:{full_name:'Eva Valverde'},courses:{title:'Python Nivel 1',slug:'python-nivel-1'},submission_files:[]} satisfies Omit<AdminSubmission,'activities'>
describe('entregas administrativas',()=>{
  it('muestra el grupo asociado por la actividad',()=>expect(submissionGroupName({...base,activities:{title:'Tarea 4',live_groups:{name:'Python J26'}}})).toBe('Python J26'))
  it('omite la línea para actividades asincrónicas',()=>expect(submissionGroupName({...base,activities:{title:'Proyecto',live_groups:null}})).toBeUndefined())
})
