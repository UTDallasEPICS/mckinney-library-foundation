import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();
export default defineEventHandler(async (event) =>{
    try{
        const id = await getRouterParam(event, 'id');
         const session = await prisma.session.delete({
            where:{
                id:id
            }
        })
        return{
            success: true,
            statusCode: 200,
            data: session
        }

    }catch(error){
        console.log(error)
        return{
            success: false,
            statusCode: 500,
            message: "Failed to delete session",
            error: error, 
        }
     }finally{
        await prisma.$disconnect();
    }
    

});