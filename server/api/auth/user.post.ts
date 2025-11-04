import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

export default defineEventHandler(async (event) =>{
    const body = await readBody(event);
    console.log(body)
    await prisma.user.create({
        data:{
             name: body.fname + body.lname,
             email: body.email,
             id: "some_ID_we_generate",
         }
        
     })
    
});

