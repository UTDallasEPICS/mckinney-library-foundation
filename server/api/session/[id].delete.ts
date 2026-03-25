import prisma from '~~/server/utils/prisma'
import { createError } from "#imports";
import { requireSession } from "~~/server/utils/requireSession";

export default defineEventHandler(async (event) =>{
    const authSession = await requireSession(event, 0);
    try{
        const id = event.context.params?.id;
        if (id !== authSession.session.id && authSession.user.permission < 2) {
            throw createError({
                statusCode: 403,
                statusMessage: "Forbidden",
            });
        }
         const session = await prisma.session.delete({
            where:{
                id:id
            }
        })
        return{
            success: true,
            statusCode: 200,
            data: session
        }

    }catch(error){
        console.log(error)
        return{
            success: false,
            statusCode: 500,
            message: "Failed to delete session",
            error: error, 
        }
     }finally{
        await prisma.$disconnect();
    }
    

});
