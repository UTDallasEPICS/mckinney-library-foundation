import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

export default defineEventHandler(async (event) =>{
    try{
        const id = getRouterParam(event, 'id');
        const body = await readBody(event)
        const request = await prisma.accountCreationRequest.delete({
            where:{
                id: id
            }
        });
        if(body.permissionLevel < 2){
            throw createError({
                statusCode:401,
                statusMessage:"User does not have permission to delete requests"
            })
        }
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