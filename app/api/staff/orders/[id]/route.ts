import { z } from 'zod';
import { db } from '../../../../../lib/db';
import { staff,guard } from '../../../../../lib/security';
import { assertTransition } from '../../../../../lib/rules';
import { failure } from '../../../../../lib/http';
export async function PATCH(request:Request,context:{params:Promise<{id:string}>}){try{await guard('staff-update',120);await staff();const {id}=await context.params;const {status}=z.object({status:z.string()}).parse(await request.json());const order=await db.$transaction(async tx=>{const current=await tx.order.findUniqueOrThrow({where:{id}});assertTransition(current.status,status);const result=await tx.order.updateMany({where:{id,status:current.status},data:{status}});if(result.count!==1)throw new Error('Transição inválida. Atualize a lista.');if(status==='cancelado')await tx.pickupSlot.update({where:{id:current.pickupSlotId},data:{reserved:{decrement:1}}});return tx.order.findUnique({where:{id},include:{items:true,pickupSlot:true}});});return Response.json(order);}catch(e){return failure(e);}}
