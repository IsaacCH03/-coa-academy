// @vitest-environment jsdom
import{cleanup,fireEvent,render,screen,waitFor}from'@testing-library/react'
import{afterEach,beforeEach,describe,expect,it,vi}from'vitest'

const refresh=vi.fn()
vi.mock('next/navigation',()=>({useRouter:()=>({refresh})}))
import{AdminReviewActions}from'./admin-review-actions'

const props={studentId:'student',activityId:'activity',activityTitle:'Tarea 1',studentName:'Eva',fileNames:['tarea.pdf'],rubricSummary:'100 puntos',hasSubmission:true}
describe('acciones de revisión administrativa',()=>{
 beforeEach(()=>{vi.stubGlobal('fetch',vi.fn(async()=>new Response(JSON.stringify({record:{}}),{status:200})))})
 afterEach(()=>{cleanup();vi.restoreAllMocks()})
 it('muestra acciones normales solamente cuando está pendiente',()=>{render(<AdminReviewActions {...props}/>);expect(screen.getByText('Aprobar')).toBeTruthy();expect(screen.getByText('Corrección')).toBeTruthy();expect(screen.getByText('Convalidar')).toBeTruthy();expect(screen.queryByText('Editar revisión')).toBeNull()})
 it('muestra la decisión vigente, nota y feedback sin botones iniciales',()=>{render(<AdminReviewActions {...props} existingReview={{status:'approved',feedback:'Buen trabajo',convalidationNote:null,grade:95,reviewedAt:'2026-10-05T12:00:00Z'}}/>);expect(screen.getByText('Aprobada')).toBeTruthy();expect(screen.getByText(/95/)).toBeTruthy();expect(screen.getByText(/Buen trabajo/)).toBeTruthy();expect(screen.queryByText('Aprobar')).toBeNull();expect(screen.getByText('Editar revisión')).toBeTruthy()})
 it('edita mediante una sola solicitud y conserva los valores vigentes',async()=>{render(<AdminReviewActions {...props} existingReview={{status:'correction',feedback:'Completar pruebas',convalidationNote:null,grade:70,reviewedAt:null}}/>);fireEvent.click(screen.getByText('Editar revisión'));expect((screen.getByLabelText('Calificación (0–100)')as HTMLInputElement).value).toBe('70');expect((screen.getByLabelText(/Retroalimentación/)as HTMLTextAreaElement).value).toBe('Completar pruebas');fireEvent.click(screen.getByText('Guardar cambios'));await waitFor(()=>expect(fetch).toHaveBeenCalledTimes(1));expect(refresh).toHaveBeenCalledTimes(1)})
})
