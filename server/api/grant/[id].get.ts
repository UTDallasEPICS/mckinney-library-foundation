import prisma from "~~/server/utils/prisma"
import { requireSession } from "~~/server/utils/requireSession"

export default defineEventHandler(async (event) => {

    const session = await requireSession(event, 0);
    const redactFields = <T extends Record<string, any>>(record: T, fields: string[]) => {
        if (session.user.permission >= 1) return record;
        const copy = { ...record } as Record<string, any>;
        fields.forEach((field) => delete copy[field]);
        return copy as T;
    };
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
            ? redactFields(grant, ['notes'])
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
