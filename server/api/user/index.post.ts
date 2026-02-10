import prisma from '~~/server/utils/prisma'


export default defineEventHandler(async (event) =>{
    try {
        const body = await readBody(event);
        if(body.permissionLevel < 3){
            throw createError({
                statusCode:401,
                statusMessage:"User does not have permission to create users"
            })
        }
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
