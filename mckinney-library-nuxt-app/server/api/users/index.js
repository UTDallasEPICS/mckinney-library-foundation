// server/api/users/index.js
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    // TODO: Get authenticated user ID for lastEditorID
    const currentUserID = 1; // Placeholder - Replace with actual user ID logic

    // GET: Fetch all users
    if (event.node.req.method === 'GET') {
        try {
            // Fetch users including related info (no changes needed in GET for this schema update)
            const users = await prisma.users.findMany({
                include: {
                    contactInfo: true,
                }
            });

            // Transform data (no changes needed in transformation logic itself for this update)
            const transformedUsers = users.map(user => {
                return {
                    id: user.userID,
                    name: `${user.contactInfo.firstName} ${user.contactInfo.lastName}`,
                    contactInfoID: user.contactInfoID,
                    role: user.role,
                    creationDate: user.creationDate,
                    status: user.status, // Now just a string
                    boardMemberId: user.boardMemberID,
                    lastEditorId: user.lastEditorID,
                    notes: user.notes,
                    boardMemberName: user.boardMember ? `${user.boardMember.contactInfo.firstName} ${user.boardMember.contactInfo.lastName}` : null,
                    lastEditorName: user.lastEditor ? `${user.contactInfo.firstName} ${user.lastEditor.contactInfo.lastName}` : null,
                };
            });

            return transformedUsers;
        } catch (error) {
            console.error('Error fetching users:', error);
            console.error('Full error details:', JSON.stringify({ message: error.message, stack: error.stack }));
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch users: ' + error.message,
            });
        }
    }
});