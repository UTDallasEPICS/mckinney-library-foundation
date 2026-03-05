import { getRouterParam } from "h3"
import prisma from "~~/server/utils/prisma"
import { requireSession, filterSensitiveFields } from "~~/server/utils/requireSession"

export default defineEventHandler(async (event) => {

    const user = await requireSession(event, 0);
    try {
        const grantId = getRouterParam(event, 'id');
        const grant = await prisma.grant.findUnique({
            where: {id:grantId},
            include: {
                boardMember: true,
                grantor: true,
            }
        });
        const filtered = grant
            ? filterSensitiveFields(grant, user.permission, ['notes'])
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
