import prisma from '~~/server/utils/prisma'
import { requireSession } from "~~/server/utils/requireSession";

export default defineEventHandler(async (event) =>{
    await requireSession(event, 2);
    try{
        const id = event.context.params?.id;
        const request = await prisma.accountCreationRequest.delete({
            where:{
                id: id
            }
        });
        console.log("request deleted");
        return {
            success: true,
            statusCode:200,
            data:request
        }
    }catch(error){
        console.log(error);
        return{
            success: false,
            statusCode: 500,
            message: "Failed to delete request",
            error: error,
        }
    }finally{
        await prisma.$disconnect();
    }
});
