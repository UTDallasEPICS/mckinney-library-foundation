import prisma from '~~/server/utils/prisma'
import { auth } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
    try {
        const session = await auth.api.getSession({ headers: event.headers });
        if (!session?.user) {
            return {
                success: false,
                statusCode: 401,
                message: 'Unauthorized',
                error: { code: 'UNAUTHORIZED' },
                data: [],
            };
        }

        const events = await prisma.event.findMany({
            include: {
                boardMember: {
                    select: {
                        name: true,
                    }
                }
            },
            orderBy: {
                eventDate: 'desc',
            }
        });

        return {
            success: true,
            statusCode: 200,
            data: events,
            error: { code: '' }
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            statusCode: 500,
            message: 'Failed to fetch events',
            error,
            data: []
        };
    } finally {
        await prisma.$disconnect();
    }
});
