import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

export default defineEventHandler(async (event) =>{
    const body = await readBody(event);
    await prisma.request.create({
        data:{
             name: body.name, 
             email: body.email,
             id: "some_ID_we_generate",
         }       
     })   
});