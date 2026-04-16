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

        const currentUser = session.user as { id: string; permission?: number };
        const permissionLevel = Number(currentUser.permission ?? 0);
        const id = await getRouterParam(event, 'id');
        if (!id) {
            throw createError({
                statusCode: 400,
                statusMessage: 'An eventId is required to update an event',
            });
        }
        if (permissionLevel < 1) {
            return {
                success: false,
                statusCode: 403,
                message: 'User does not have permission to update events',
                error: { code: 'FORBIDDEN' },
                data: null,
            };
        }

        const eventName = typeof body.eventName === 'string' ? body.eventName.trim() : '';
        const parsedEventDate = body.eventDate ? new Date(body.eventDate) : null;
        if (eventName && parsedEventDate) {
            const existingEvent = await prisma.event.findFirst({
                where: {
                    eventName,
                    eventDate: parsedEventDate,
                    NOT: { id },
                },
            });

            if (existingEvent) {
                return {
                    success: false,
                    statusCode: 400,
                    message: 'The event already exists',
                    error: { code: 'EVENT_ALREADY_EXISTS' },
                    data: null,
                };
            }
        }

        const updatedEvent = await prisma.event.update({
            where: { id },
            data: {
                boardMemberId: currentUser.id,
                eventName,
                eventDate: parsedEventDate,
                description: body.description,
            },
            include: {
                boardMember: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return {
            success: true,
            statusCode: 200,
            data: updatedEvent,
            error: { code: '' },
        };
    } catch (error) {
        console.error('error updating event:', error);
        return {
            success: false,
            statusCode: 500,
            message: 'Failed to update event',
            error,
            data: null,
        };
    } finally {
        await prisma.$disconnect();
    }
});
