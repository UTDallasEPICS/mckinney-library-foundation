import prisma from '~~/server/utils/prisma'
import { auth } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
    try {
        const session = await auth.api.getSession({ headers: event.headers });
        if (!session?.user) {
            return {
                success: false,
                statusCode: 401,
                message: 'Unauthorized',
                error: { code: 'UNAUTHORIZED' },
                data: null,
            };
        }

        const id = getRouterParam(event, 'id');  
        const donation = await prisma.donation.findUnique({
            where: { id:id },
            include:{
                event: {
                    select: {
                        eventName: true,
                        eventDate: true,
                    }
                },
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