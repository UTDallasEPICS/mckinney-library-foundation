
import prisma from "~~/server/utils/prisma"
import { requireSession } from "~~/server/utils/requireSession"

export default defineEventHandler(async (event) => {

    const session = await requireSession(event, 0);
    const redactFields = <T extends Record<string, any>>(record: T, fields: string[]) => {
        if (session.user.permission >= 1) return record;
        const copy = { ...record } as Record<string, any>;
        fields.forEach((field) => delete copy[field]);
        return copy as T;
    };
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
            redactFields(d, ['notes'])
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
