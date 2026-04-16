import prisma from '~~/server/utils/prisma'
import { auth } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const session = await auth.api.getSession({ headers: event.headers });
        if (!session?.user) {
            return {
                success: false,
                statusCode: 401,
                message: 'Unauthorized',
                error: { code: 'UNAUTHORIZED' },
                data: null,
            };
        }

        const currentUser = session.user as { permission?: number };
        const permissionLevel = Number(currentUser.permission ?? 0);
        const id = await getRouterParam(event, 'id');
        if (!id) {
            throw createError({
                statusCode: 400,
                statusMessage: 'An eventId is required to delete an event',
            });
        }
        if (permissionLevel < 1) {
            return {
                success: false,
                statusCode: 403,
                message: 'User does not have permission to delete events',
                error: { code: 'FORBIDDEN' },
                data: null,
            };
        }

        const donationCount = await prisma.donation.count({
            where: { eventId: id },
        });

        if (donationCount > 0) {
            return {
                success: false,
                statusCode: 400,
                message: 'There are donations under this event',
                error: { code: 'EVENT_HAS_DONATIONS' },
                data: null,
            };
        }

        const deletedEvent = await prisma.event.delete({
            where: { id },
        });

        return {
            success: true,
            statusCode: 200,
            data: deletedEvent,
            error: { code: '' },
        };
    } catch (error) {
        console.error('error deleting event:', error);
        const prismaError = error as { code?: string };
        if (prismaError.code === 'P2003') {
            return {
                success: false,
                statusCode: 400,
                message: 'There are donations under this event',
                error: { code: 'EVENT_HAS_DONATIONS' },
                data: null,
            };
        }
        return {
            success: false,
            statusCode: 500,
            message: 'Failed to delete event',
            error,
            data: null,
        };
    } finally {
        await prisma.$disconnect();
    }
});
