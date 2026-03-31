import prisma from '~~/server/utils/prisma'
import { requireSession } from "~~/server/utils/requireSession";



export default defineEventHandler(async (event) => {
    await requireSession(event, 1);
    try {
        const grantId = event.context.params?.id;
        const grant = await prisma.grant.delete({
            where: {id:grantId},
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
            message: "Failed to delete grant",
            error: error, 
            data: null
        }
    } finally {
        await prisma.$disconnect()
    }
});
