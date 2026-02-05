import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

export default defineEventHandler(async (event) =>{
    try{
        const id = await getRouterParam(event, 'id');
        const body = await readBody(event);
        if(body.permissionLevel < 2){
            throw createError({
                statusCode:401,
                statusMessage:"User does not have permission to edit users"
            })
        }
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