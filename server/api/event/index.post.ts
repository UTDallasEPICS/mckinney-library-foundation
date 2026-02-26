import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    try {
        if (body.permissionLevel < 1) {
            throw createError({
                statusCode: 401,
                statusMessage: "User not authorized to create events"
            });
        }

        // Upsert event by name
        const eventRecord = await prisma.event.upsert({
            where: {
                eventName: body.eventName
            },
            update: {
                // Only update if needed, keep existing date if already set
                eventDate: body.eventDate ? new Date(body.eventDate) : undefined,
                boardMemberId: body.boardMemberId
            },
            create: {
                eventName: body.eventName,
                eventDate: body.eventDate ? new Date(body.eventDate) : new Date(),
                boardMemberId: body.boardMemberId
            }
        })

        return {
            success: true,
            statusCode: 200,
            data: eventRecord
        }
    } catch (error) {
        console.log("error creating event:", error)
        return {
            success: false,
            statusCode: 500,
            message: "Failed to create event",
            error: error,
            data: null
        }
    }
});
