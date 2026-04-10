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
    console.log("donation get router reached")
    try {
        const id = event.context.params?.id;
        const donation = await prisma.donation.findUnique({
            where: { id },
            include: {
                donor: true,
            },
        });
        console.log("donation found:", donation);
        const filtered = donation
            ? redactFields(donation, ['notes'])
            : donation;
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
            message: "Failed to fetch donation",
            error: error, 
        }
    }
})
