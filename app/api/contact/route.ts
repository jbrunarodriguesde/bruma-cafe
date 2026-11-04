import { z } from 'zod';
import { db } from '../../../lib/db';
import { guard } from '../../../lib/security';
import { failure } from '../../../lib/http';
export async function POST(request:Request){try{await guard('contact',4);const input=z.object({name:z.string().trim().min(2).max(80),email:z.string().email().max(200),message:z.string().trim().min(10).max(3000),website:z.string().max(0),startedAt:z.number()}).parse(await request.json());if(Date.now()-input.startedAt<2500||Date.now()-input.startedAt>86400000)throw new Error('Aguarde alguns segundos antes de enviar.');await db.contactMessage.create({data:{name:input.name,email:input.email,message:input.message}});return Response.json({ok:true});}catch(e){return failure(e);}}
