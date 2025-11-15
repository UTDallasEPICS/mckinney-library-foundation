import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

export default defineEventHandler(async (event) =>{
    const body = await readBody(event);
    // await prisma.request.delete({
    //     where:{
    //         id:body.id?.toString()
    //     }
    // })
    console.log("deleting: " + body.name);
});