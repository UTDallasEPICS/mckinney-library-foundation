// server/api/users/[id].js
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    const id = parseInt(getRouterParam(event, 'id'));
    // TODO: Get authenticated user ID for lastEditorID
    const currentUserID = 1; // Placeholder - Replace with actual user ID logic

    // GET: Fetch a specific grant
    if (event.node.req.method === 'GET') {
        try {
            // Fetch user including related info (no changes needed in GET for this schema update)
            const user = await prisma.users.findUnique({
                where: { userID: id },
                include: {
                    contactInfo: true,
                    boardMember: { include: { contactInfo: true } },
                    lastEditor: { include: { contactInfo: true } }
                }
            });

            if (!user) {
                throw createError({ statusCode: 404, statusMessage: 'User not found' });
            }

            // Transform data (no changes needed in transformation logic itself for this update)
            const transformedUser = {
                id: user.userID,
                contactInfo: user.contactInfoID,
                role: user.role,
                creationDate: user.creationDate,
                status: user.status, // Now just a string
                boardMemberId: user.boardMemberID,
                lastEditorId: user.lastEditorID,
                notes: user.notes,
                boardMemberName: user.boardMember ? `${user.boardMember.contactInfo.firstName} ${user.boardMember.contactInfo.lastName}` : null,
                lastEditorName: user.lastEditor ? `${user.lastEditor.contactInfo.firstName} ${user.lastEditor.contactInfo.lastName}` : null,
            };

            return transformedUser;
        } catch (error) {
            console.error('Error fetching user:', error);
            console.error('Full error details:', JSON.stringify({ message: error.message, stack: error.stack }));
            throw createError({
                statusCode: error.statusCode || 500,
                statusMessage: 'Failed to fetch user: ' + error.message,
            });
        }
    }
});