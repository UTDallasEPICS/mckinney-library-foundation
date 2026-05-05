import prisma from '~~/server/utils/prisma'
import { requireSession } from "~~/server/utils/requireSession";



export default defineEventHandler(async (event) => {
    try {
        await requireSession(event, 0);
        const grantId = getRouterParam(event, 'id');

        const grant = await prisma.grant.findUnique({
            where: {id:grantId},
            include: {
                boardMember: true,
                grantor: true,
            }
        });
        return { 
            success: true,
            statusCode: 200,
            data: grant,
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
    } finally {
        await prisma.$disconnect()
    }
});
