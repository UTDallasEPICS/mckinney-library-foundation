import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {  
    try {
        const id = getRouterParam(event, 'id');
        const deletedDonor = await prisma.donor.delete({
            where: { id }
        });
        return{
            success: true,
            statusCode: 200,
            data: deletedDonor,
        }
    } catch (error) {
        console.error(error);
        return { 
            success: false,
            statusCode: 500,
            message: "Failed to delete donor",
            error: error, 
        }
    } finally {
        await prisma.$disconnect()
    }
});