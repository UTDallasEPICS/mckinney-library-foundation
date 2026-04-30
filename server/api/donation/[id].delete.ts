import prisma from '~~/server/utils/prisma'
import { requireSession } from "~~/server/utils/requireSession";

export default defineEventHandler (async (event)=>{
    await requireSession(event, 1);
    try{

        const id = event.context.params?.id;
        if(!id){
            throw createError({
                statusCode: 400,
                statusMessage: "A donationId is required to delete an ID"
            });
        }
        const deleted = await prisma.donation.delete({
            where: {id: id}
        });
        return{
            success: true,
            deleted 
        };
    }
    catch(error){
        console.log("error",error)
        return{
            success: false,
            statusCode: 500,
            message: "Failed to delete donation",
            error: error
        }
    }
})
