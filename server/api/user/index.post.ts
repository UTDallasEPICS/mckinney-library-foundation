import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) =>{
    try {
        const body = await readBody(event);
        const user = await prisma.user.create({
        data:{
             name: body.name,
             email: body.email,
             permission: body.permission,
        }
        })
        console.log("Account Created");
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
        }
    }finally{
        await prisma.$disconnect();
    }
    
});
