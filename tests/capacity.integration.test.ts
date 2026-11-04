import {afterAll,describe,expect,it} from 'vitest';
import {PrismaClient} from '@prisma/client';
const enabled=Boolean(process.env.TEST_DATABASE_URL);
const db=enabled?new PrismaClient({datasourceUrl:process.env.TEST_DATABASE_URL}):null;
describe.skipIf(!enabled)('capacidade concorrente no PostgreSQL real',()=>{
afterAll(async()=>{await db?.$disconnect();});
it('permite somente uma reserva quando a última vaga é disputada',async()=>{
const slot=await db!.pickupSlot.create({data:{startsAt:new Date('2099-01-01T12:00:00Z'),capacity:1}});
try{const reserve=()=>db!.$transaction(async tx=>{const current=await tx.pickupSlot.findUniqueOrThrow({where:{id:slot.id}});return tx.pickupSlot.updateMany({where:{id:slot.id,reserved:{lt:current.capacity}},data:{reserved:{increment:1}}});});const results=await Promise.all([reserve(),reserve(),reserve(),reserve()]);expect(results.reduce((n,r)=>n+r.count,0)).toBe(1);expect((await db!.pickupSlot.findUniqueOrThrow({where:{id:slot.id}})).reserved).toBe(1);}finally{await db!.pickupSlot.delete({where:{id:slot.id}});}
});
});
