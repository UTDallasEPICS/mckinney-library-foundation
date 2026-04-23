import prisma from "~~/server/utils/prisma"
import { requireSession } from "~~/server/utils/requireSession"

export default defineEventHandler(async (event) => {

    const session = await requireSession(event, 0);
    const donationOmit = session.user.permission < 1 ? { notes: true } as const : undefined;
    console.log("donation get router reached")
    try {
        const id = event.context.params?.id;
        const donation = await prisma.donation.findUnique({
            where: { id },
            omit: donationOmit,
            include: {
                event: {
                select: {
                    eventName: true,
                    eventDate: true,
                }
            },
            donor: true,
            },
        });
        console.log("donation found:", donation);
        return {
            success: true,
            statusCode: 200,
            data: donation, 
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
