import { db } from '../../../../lib/db';
import { staff } from '../../../../lib/security';
import { failure } from '../../../../lib/http';
export async function GET(request:Request){try{await staff();const p=new URL(request.url).searchParams;const page=Math.max(1,Number(p.get('page'))||1);const status=p.get('status');return Response.json({orders:await db.order.findMany({where:status?{status}:undefined,include:{items:true,pickupSlot:true},orderBy:{createdAt:'desc'},skip:(page-1)*30,take:30}),page});}catch(e){return failure(e);}}
