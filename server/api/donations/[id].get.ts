import { getRouterParam } from "h3"
import prisma from "~~/server/utils/prisma"
import { requireSession, filterSensitiveFields } from "~~/server/utils/requireSession"

export default defineEventHandler(async (event) => {

    const user = await requireSession(event, 0);
    console.log("donation get router reached")
    try {
        const id = getRouterParam(event, 'id');
        const donation = await prisma.donation.findUnique({
            where: { id },
            include: {
                donor: true,
            },
        });
        console.log("donation found:", donation);
        const filtered = donation
            ? filterSensitiveFields(donation, user.permission, ['notes'])
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