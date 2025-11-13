import {PrismaClient} from '@prisma/client';
import {v4 as uuidv4} from 'uuid';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) =>{
    const body = await readBody(event);
    await prisma.user.create({
        data:{
             name: body.name,
             email: body.email,
             permission: body.permission,
             id: body.id? body.id : uuidv4(),
         }
        
     })
    console.log("Account Created");
    if(body.isRequest){
        await prisma.request.delete({
        where:{
            id:body.id,
        }
        });
        console.log("request deleted");
    }
    
});
