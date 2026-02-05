import {PrismaClient} from '@prisma/client'


const prisma = new PrismaClient();

export default defineEventHandler(async (event) =>{
    try{
        const id = await getRouterParam(event, 'id');
        const body = await readBody(event);
        if(body.permissionLevel < 2){
            throw createError({
                statusCode:401,
                statusMessage:"User does not have permission to delete users"
            })
        }
        const user = await prisma.user.delete({
            where:{
                id:id
            }
        })
        return{
            success: true,
            statusCode: 200,
            data: user
        }
    }catch(error){
        console.log(error)
        return{
            success: false,
            statusCode: 500,
            message: "Failed to delete user",
            error: error, 
        }
    }finally{
        await prisma.$disconnect();
    }
});