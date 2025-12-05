import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

export default defineEventHandler (async (event)=>{
    try{

        const body = await readBody(event);
        const id = await getRouterParam(event, 'id');
        if(body.permissionLevel < 1){
            throw createError({
                statusCode:401,
                statusMessage:"User does not have permission to delete donations"
            })
        }
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