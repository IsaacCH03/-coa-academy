import{beforeEach,describe,expect,it,vi}from'vitest'

const requireAdmin=vi.fn(),createClient=vi.fn(),revalidatePath=vi.fn()
vi.mock('@/lib/auth/session',()=>({requireAdmin}))
vi.mock('@/lib/supabase/server',()=>({createClient}))
vi.mock('next/cache',()=>({revalidatePath}))

describe('archivado administrativo de entregas',()=>{
 beforeEach(()=>{vi.resetAllMocks()})
 it('archiva y restaura actualizando solamente admin_archived_at',async()=>{const query={update:vi.fn(),eq:vi.fn(),is:vi.fn(),not:vi.fn()};query.update.mockReturnValue(query);query.eq.mockReturnValue(query);query.is.mockResolvedValue({error:null});query.not.mockResolvedValue({error:null});createClient.mockResolvedValue({from:()=>query});const{archiveSubmission,restoreSubmission}=await import('./actions');const data=new FormData();data.set('submission_id','submission');await archiveSubmission(data);expect(query.update).toHaveBeenCalledWith({admin_archived_at:expect.any(String)});await restoreSubmission(data);expect(query.update).toHaveBeenLastCalledWith({admin_archived_at:null});expect(revalidatePath).toHaveBeenCalledWith('/admin/entregas')})
 it('no accede a Supabase cuando requireAdmin rechaza al estudiante',async()=>{requireAdmin.mockRejectedValue(new Error('admin required'));const{archiveSubmission}=await import('./actions');const data=new FormData();data.set('submission_id','submission');await expect(archiveSubmission(data)).rejects.toThrow('admin required');expect(createClient).not.toHaveBeenCalled()})
})
