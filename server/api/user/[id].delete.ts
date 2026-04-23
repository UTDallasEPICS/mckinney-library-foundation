import prisma from '~~/server/utils/prisma'
import { requireSession } from "~~/server/utils/requireSession";


export default defineEventHandler(async (event) =>{
    try{
        await requireSession(event, 2);
        const id = await getRouterParam(event, 'id');
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
