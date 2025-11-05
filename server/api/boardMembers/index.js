// server/api/boardMembers/index.js
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    // TODO: Get authenticated user ID for lastEditorID
    const currentUserID = 1; // Placeholder - Replace with actual user ID logic

    // GET: Fetch all board members
    if (event.node.req.method === 'GET') {
        try {
            // Fetch board members including related info (no changes needed in GET for this schema update)
            const boardMembers = await prisma.users.findMany({
                where: {
                    role: {
                        in: ['ADMIN', 'MAIN_ADMIN'],
                    },
                },
                include: {
                    contactInfo: true,
                }
            });

            // Transform data (no changes needed in transformation logic itself for this update)
            const transformedBoardMembers = boardMembers.map(boardMember => {
                return {
                    id: boardMember.userID,
                    name: `${boardMember.contactInfo.firstName} ${boardMember.contactInfo.lastName}`,
                    contactInfoID: boardMember.contactInfoID,
                    role: boardMember.role,
                    creationDate: boardMember.creationDate,
                    status: boardMember.status, // Now just a string
                    boardMemberId: boardMember.boardMemberID,
                    lastEditorId: boardMember.lastEditorID,
                    notes: boardMember.notes,
                    boardMemberName: boardMember.boardMember ? `${boardMember.boardMember.contactInfo.firstName} ${boardMember.boardMember.contactInfo.lastName}` : null,
                    lastEditorName: boardMember.lastEditor ? `${boardMember.contactInfo.firstName} ${boardMember.lastEditor.contactInfo.lastName}` : null,
                };
            });

            return transformedBoardMembers;
        } catch (error) {
            console.error('Error fetching board members:', error);
            console.error('Full error details:', JSON.stringify({ message: error.message, stack: error.stack }));
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch board members: ' + error.message,
            });
        }
    }
});