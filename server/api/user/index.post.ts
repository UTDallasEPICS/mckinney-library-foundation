import prisma from '~~/server/utils/prisma'
import { requireSession } from "~~/server/utils/requireSession";


export default defineEventHandler(async (event) =>{
    await requireSession(event, 3);
    try {
        const body = await readBody(event);
        const user = await prisma.user.create({
        data:{
             name: body.name,
             email: body.email,
             permission: body.permission,
        }
        })
        return{
            success: true,
            statusCode: 200,
            data: user, 
        }
    }
    catch(error){
        console.error(error);
        return { 
            success: false,
            statusCode: 500,
            message: "Failed to create user",
            error: error, 
            data: null
        }
    }finally{
        await prisma.$disconnect();
    }
    
});
