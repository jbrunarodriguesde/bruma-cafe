import { db } from '../../../../lib/db';
import { hash,guard } from '../../../../lib/security';
import { failure } from '../../../../lib/http';
export async function GET(request:Request,context:{params:Promise<{id:string}>}){try{await guard('tracking',60);const {id}=await context.params;const token=new URL(request.url).searchParams.get('token');if(!token)return Response.json({error:'Pedido não encontrado.'},{status:404});const order=await db.order.findFirst({where:{id,tokenHash:hash(token)},select:{id:true,status:true,totalCents:true,createdAt:true,items:true,pickupSlot:{select:{startsAt:true}}}});return order?Response.json(order):Response.json({error:'Pedido não encontrado.'},{status:404});}catch(e){return failure(e);}}
