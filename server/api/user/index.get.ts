import prisma from '~~/server/utils/prisma'
import { requireSession } from "~~/server/utils/requireSession";

export default defineEventHandler(async (event) =>{
    await requireSession(event, 2);
    try{
        const data = await prisma.user.findMany();
        return{
            data:data,
            success:true,
            statusCode:200
        } 
    }catch (error) {
        console.error(error);
        return { 
            success: false,
            statusCode: 500,
            message: "Failed to get users",
            error: error, 
            data:null
        }
    } finally {
        await prisma.$disconnect()
    } 
});
