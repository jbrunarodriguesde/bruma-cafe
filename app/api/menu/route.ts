import {demoMenu} from '../../../lib/demo';
import { db } from '../../../lib/db';
import { failure } from '../../../lib/http';
export const dynamic='force-dynamic';
export async function GET(){if(process.env.DEMO_MODE==="true")return Response.json(demoMenu());try{return Response.json({categories:await db.category.findMany({include:{items:{include:{modifierGroups:{include:{options:true}}}}}}),events:await db.event.findMany({orderBy:{startsAt:'asc'}})});}catch(e){return failure(e);}}

