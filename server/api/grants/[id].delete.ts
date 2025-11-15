import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        const grantId = getRouterParam(event, 'id');

        const grant = await prisma.grant.delete({
            where: {id:grantId},
        });

        return { 
            success: true,
            statusCode: 200,
            data: grant,
        }
    } catch (error) {
        console.error(error);
        return { 
            success: false,
            statusCode: 500,
            message: "Failed to delete grant",
            error: error, 
        }
    } finally {
        await prisma.$disconnect()
    }
});