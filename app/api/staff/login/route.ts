import { z } from 'zod';
import { cookies } from 'next/headers';
import { db } from '../../../../lib/db';
import { guard,passwordValid,signSession } from '../../../../lib/security';
import { failure } from '../../../../lib/http';
export async function POST(request:Request){try{await guard('login',5);const input=z.object({email:z.string().email(),password:z.string().min(1).max(200)}).parse(await request.json());const user=await db.staffUser.findUnique({where:{email:input.email}});if(!user||!passwordValid(input.password,user.passwordHash))throw new Error('Acesso não autorizado.');(await cookies()).set('bruma_session',signSession(user.id,user.role),{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:28800});return Response.json({ok:true,role:user.role});}catch(e){return failure(e);}}
export async function DELETE(){try{await guard('logout',30);(await cookies()).delete('bruma_session');return Response.json({ok:true});}catch(e){return failure(e);}}
