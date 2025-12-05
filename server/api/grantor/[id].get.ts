import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    try {
        const grantorId = getRouterParam(event, 'id');
        const grantor = await prisma.grantor.findUnique({
            where: { id:grantorId }
        });      
        return {
            success: true,
            statusCode: 200,
            data: grantor, 
            error:{code: ""}
        }
    } catch (error) {
        console.error(error);
        return { 
            success: false,
            statusCode: 500,
            message: "Failed to fetch grantor",
            error: error, 
            data: null
        }
    } finally {
        await prisma.$disconnect()
    }
});