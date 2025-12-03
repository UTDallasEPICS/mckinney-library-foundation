import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {        
        const grants = await prisma.grant.findMany({
            include: {
                boardMember: true,
                grantor: true,
            }
        });
        return { 
            success: true,
            statusCode: 200,
            data: grants, 
            error:{code: ""}
        }
    } catch (error) {
        console.error(error);
        return { 
            success: false,
            statusCode: 500,
            message: "Failed to fetch grants",
            error: error, 
            data: []
        }
    } finally {
        await prisma.$disconnect()
    }
});