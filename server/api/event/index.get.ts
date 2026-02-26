import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    try {
        const events = await prisma.event.findMany({
            orderBy: {
                eventDate: 'desc'
            }
        })
        return {
            success: true,
            statusCode: 200,
            data: events,
        }
    } catch (error) {
        return {
            success: false,
            statusCode: 500,
            message: "Failed to fetch events",
            error: error,
            data: null
        }
    }
})
