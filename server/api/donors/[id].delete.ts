import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');
    
    try {
        const deletedDonor = await prisma.donor.delete({
            where: { id }
        });
        
        return deletedDonor;
    } catch (err) {
        throw createError({
            statusCode: 500,
            // statusMessage: err.message || 'Failed to delete donor'
        });
    }
});