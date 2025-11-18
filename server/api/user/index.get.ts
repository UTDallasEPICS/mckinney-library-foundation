import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

export default defineEventHandler(async () =>{
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