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
    try {
        const id = event.context.params?.id;
        const donor = await prisma.donor.findUnique({
            where: { id:id },
            include:{
                donations:true
            }
        });      
        const filtered = donor
            ? redactFields(donor, ['email','phone','address','notes','webLink'])
            : donor;
        return {
            success: true,
            statusCode: 200,
            data: filtered, 
        }
    } catch (error) {
        console.error(error);
        return { 
            success: false,
            statusCode: 500,
            message: "Failed to fetch donor",
            error: error, 
        }
    }
});
