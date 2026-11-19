import prisma from '~~/server/utils/prisma'
import { writeAuditLog } from '~~/server/utils/auditLog'
import { auth } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
    try {
        //const body = await readBody(event);
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

        const deletedEvent = await prisma.$transaction(async (tx) => {
            const removedEvent = await tx.event.delete({ where: { id } });

            await writeAuditLog(
                tx,
                currentUser.id,
                'DELETE',
                'EVENT',
                removedEvent.id,
                {
                    eventName: removedEvent.eventName,
                    eventDate: removedEvent.eventDate?.toISOString() ?? null,
                    description: removedEvent.description,
                },
                {},
            );

            return removedEvent;
        });

        return {
            success: true,
            statusCode: 200,
            data: deletedEvent,
            error: { code: '' },
        };
    } catch (error) {
        console.error('error deleting event:', error);
        if (error && typeof error === 'object' && 'statusCode' in error) {
            throw error;
        }
        const prismaError = error as { code?: string };
        // P2003 is error that happens when a relation is unable to properly reference a piece of data in another relation
        // in this case, happens when donation references an event id and details for an event that doesn't exist bc it is deleted
        // so the deletion of the event is stopped to prevent that error
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
    }
});
