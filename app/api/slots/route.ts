import { db } from '../../../lib/db';
import { assertSlot } from '../../../lib/rules';
import { failure } from '../../../lib/http';
export const dynamic='force-dynamic';
export async function GET(){try{const hours=await db.openingHours.findMany();const now=new Date();const dates:Date[]=[];for(let t=Math.ceil((now.getTime()+20*60000)/1800000)*1800000;t<now.getTime()+7*86400000;t+=1800000){const d=new Date(t);const day=new Intl.DateTimeFormat('en-US',{timeZone:'America/Sao_Paulo',weekday:'short'}).format(d);const h=hours.find(h=>h.dayOfWeek===['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(day));if(!h||h.closed)continue;try{assertSlot(d,now,h.opensAt,h.closesAt);dates.push(d);}catch{}}await db.pickupSlot.createMany({data:dates.map(startsAt=>({startsAt,capacity:8})),skipDuplicates:true});const slots=await db.pickupSlot.findMany({where:{startsAt:{in:dates}},orderBy:{startsAt:'asc'}});return Response.json({slots:slots.filter(s=>s.reserved<s.capacity)});}catch(e){return failure(e);}}
