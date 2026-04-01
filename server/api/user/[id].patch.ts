import prisma from '~~/server/utils/prisma'
import { requireSession } from "~~/server/utils/requireSession";

export default defineEventHandler(async (event) =>{
    await requireSession(event, 2);
    try{
        const id = event.context.params?.id;
        const body = await readBody(event);
        const data = await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                permission: body.permission,
                status: body.status,
                name:body.name,
                email:body.email
            },
        });
        return{
            success: true,
            statusCode: 200,
            data: data
        }
    }catch(error){
        console.error(error);
        return { 
            success: false,
            statusCode: 500,
            message: "Failed to update user",
            error: error, 
        }
    }finally{
        await prisma.$disconnect();
    }
});
