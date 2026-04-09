import prisma from "~~/server/utils/prisma"
import { requireSession, filterSensitiveFields } from "~~/server/utils/requireSession"

export default defineEventHandler(async (event) => {

    const session = await requireSession(event, 0);
    try {
        const id = event.context.params?.id;  
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
        const filtered = donation
            ? filterSensitiveFields(donation, session.user.permission, ['notes'])
            : donation;
        return {
            success: true,
            statusCode: 200,
            data: filtered, 
        }
    }catch (error) {
        console.error(error);
        return { 
            success: false,
            statusCode: 500,
            message: "Failed to fetch donation",
            error: error, 
        }
    }
})
