
import prisma from "~~/server/utils/prisma"
import { requireSession, filterSensitiveFields } from "~~/server/utils/requireSession"

export default defineEventHandler(async (event) => {

    const session = await requireSession(event, 0);
    try{
        const donations = await prisma.donation.findMany({
            include: {
                boardMember: {
                    select: {
                        name: true,
                    }
                },
                donor: {
                    select: {
                        name: true,
                    }
                }
            },
        })
        const filtered = donations.map((d) =>
            filterSensitiveFields(d, session.user.permission, ['notes'])
        );
        return{
            success: true,
            statusCode: 200,
            data: filtered,
        }
    }
    
    catch(error){
        return{
            success: false,
            statusCode: 500,
            message: "Failed to fetch donations",
            error: error,
            data:null
        }
    }
})
