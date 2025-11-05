import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

export default defineEventHandler(async (event) =>{
    const body = await readBody(event);
    console.log(body)
    await prisma.user.create({
        data:{
             name: body.name,
             email: body.email,
             id: body.id,
         }
        
     })
    console.log("Account Created");
    await prisma.request.delete({
        where:{
            id:body.id,
        }
    })
    console.log("request deleted");
});

