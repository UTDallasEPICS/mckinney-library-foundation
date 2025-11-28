import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

export default defineEventHandler (async (event)=>{
    try{

        const body = await readBody(event);
        const id = await getRouterParam(event, 'id');
        // Perform role-based API checking here 
        // I.E., does the user have the permision to delete? 
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
            statusCode: 200,
            data: deleted,
        };
    }
    catch(error){
        return{
            success: false,
            statusCode: 500,
            message: "Failed to delete donation",
            error: error
        }
    }finally{
        await prisma.$disconnect();
    }
})