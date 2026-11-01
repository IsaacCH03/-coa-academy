import { beforeEach, describe, expect, it, vi } from 'vitest'

const state=vi.hoisted(()=>({rpcError:null as null|{code:string;message:string;hint?:string},rpcCalls:[] as Array<{name:string;args:Record<string,unknown>}>,admin:true}))
vi.mock('next/cache',()=>({revalidatePath:vi.fn()}))
vi.mock('next/navigation',()=>({redirect:vi.fn()}))
vi.mock('@/lib/auth/session',()=>({requireAdmin:vi.fn(async()=>{if(!state.admin)throw new Error('admin required');return{user:{id:'admin-1'}}})}))
vi.mock('@/lib/supabase/server',()=>({createClient:vi.fn(async()=>({
 from:(table:string)=>{if(table!=='live_group_items')throw new Error(`Unexpected table ${table}`);return{select:()=>({eq:()=>({order:()=>({limit:()=>({maybeSingle:async()=>({data:{display_order:2},error:null})})})})})}},
 rpc:async(name:string,args:Record<string,unknown>)=>{state.rpcCalls.push({name,args});return{data:state.rpcError?null:'item-1',error:state.rpcError}},
}))}))

import { createItemForm } from './actions'

function assignment(){const data=new FormData();data.set('group_id','group-1');data.set('section_id','11111111-1111-4111-8111-111111111111');data.set('item_type','assignment');data.set('title','Entrega Tarea 1');data.set('content','Instrucciones');data.set('due_date','2026-11-08');data.set('due_time','23:59');data.set('max_files','4');data.set('max_file_mb','5');return data}

describe('creación administrativa de entregas',()=>{
 beforeEach(()=>{state.rpcError=null;state.rpcCalls=[];state.admin=true;vi.restoreAllMocks()})
 it('envía al RPC la fecha de Costa Rica y los límites en bytes',async()=>{await expect(createItemForm({error:null,success:false},assignment())).resolves.toEqual({error:null,success:true});expect(state.rpcCalls).toEqual([{name:'create_live_group_assignment',args:{p_section:'11111111-1111-4111-8111-111111111111',p_title:'Entrega Tarea 1',p_content:'Instrucciones',p_due_at:'2026-11-09T05:59:00.000Z',p_max_files:4,p_max_file_size_bytes:5242880}}])})
 it('convierte el error del RPC en estado recuperable y deja diagnóstico seguro',async()=>{state.rpcError={code:'23514',message:'new row violates check constraint',hint:'review constraint'};const log=vi.spyOn(console,'error').mockImplementation(()=>undefined);await expect(createItemForm({error:null,success:false},assignment())).resolves.toEqual({error:'No pudimos crear el contenido. Revisa el diagnóstico de la terminal.',success:false});expect(log).toHaveBeenCalledWith('[create-assignment]',{code:'23514',message:'new row violates check constraint',hint:'review constraint',dueAt:'2026-11-09T05:59:00.000Z',maxFiles:4,maxFileSizeBytes:5242880})})
 it('no oculta un fallo de autorización',async()=>{state.admin=false;await expect(createItemForm({error:null,success:false},assignment())).rejects.toThrow('admin required');expect(state.rpcCalls).toHaveLength(0)})
})
