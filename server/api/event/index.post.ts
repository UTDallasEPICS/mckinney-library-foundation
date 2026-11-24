import prisma from '~~/server/utils/prisma'
import { writeAuditLog } from '~~/server/utils/auditLog'
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
        if (permissionLevel < 1) {
            return {
                success: false,
                statusCode: 403,
                message: 'User does not have permission to create events',
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

        const createdEvent = await prisma.$transaction(async (tx) => {
            const newEvent = await tx.event.create({
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
                        }
                    }
                }
            });

            await writeAuditLog(
                tx,
                currentUser.id,
                'CREATE',
                'EVENT',
                newEvent.id,
                {},
                {
                    eventName: newEvent.eventName,
                    eventDate: newEvent.eventDate?.toISOString() ?? null,
                    description: newEvent.description,
                },
            );

            return newEvent;
        });

        return {
            success: true,
            statusCode: 200,
            data: createdEvent,
            error: { code: '' }
        };
    } catch (error) {
        console.error(error);
        if (error && typeof error === 'object' && 'statusCode' in error) {
            throw error;
        }
        return {
            success: false,
            statusCode: 500,
            message: 'Failed to create event',
            error,
            data: null
        };
    }
});
