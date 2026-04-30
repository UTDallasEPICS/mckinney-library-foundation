
import prisma from "~~/server/utils/prisma"
import { requireSession } from "~~/server/utils/requireSession"

export default defineEventHandler(async (event) => {

    const session = await requireSession(event, 0);
    const donationOmit = session.user.permission < 1 ? { notes: true } as const : undefined;
    try{
        const donations = await prisma.donation.findMany({
            omit: donationOmit,
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
        return{
            success: true,
            statusCode: 200,
            data: donations,
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
