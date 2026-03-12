import prisma from "~~/server/utils/prisma"
import { requireSession, filterSensitiveFields } from "~~/server/utils/requireSession"

export default defineEventHandler(async (event) => {

    const session = await requireSession(event, 0);
    try {
        const grantId = event.context.params?.id;
        const grant = await prisma.grant.findUnique({
            where: {id:grantId},
            include: {
                boardMember: true,
                grantor: true,
            }
        });
        const filtered = grant
            ? filterSensitiveFields(grant, session.user.permission, ['notes'])
            : grant;
        return { 
            success: true,
            statusCode: 200,
            data: filtered,
            error:{code: ""}
        }
    } catch (error) {
        console.error(error);
        return { 
            success: false,
            statusCode: 500,
            message: "Failed to find grant",
            error: error, 
        }
    }
});
