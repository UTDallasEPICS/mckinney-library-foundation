import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();
export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id');  
        const donation = await prisma.donation.findUnique({
            where: { id:id },
            include:{
                donor:true,
                boardMember:{
                    select:{
                        name:true
                    }
                }
            }
        });    
        return {
            success: true,
            statusCode: 200,
            data: donation, 
        }
    }catch (error) {
        console.error(error);
        return { 
            success: false,
            statusCode: 500,
            message: "Failed to fetch donation",
            error: error, 
        }
    }finally {
        await prisma.$disconnect()
    }   

 })