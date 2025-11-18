import {PrismaClient} from '@prisma/client'


const prisma = new PrismaClient();

export default defineEventHandler(async (event) =>{
    try{
        const id = getRouterParam(event, 'id');
        const user = await prisma.user.delete({
            where:{
                id:id
            }
        })
        console.log("Account deleted");
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