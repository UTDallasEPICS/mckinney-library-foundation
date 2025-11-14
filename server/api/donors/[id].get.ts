import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');
    
    try {
        const donor = await prisma.donor.findUnique({
            where: { id }
        });
        
        if (!donor) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Donor not found'
            });
        }
        
        return donor;
    } catch (err) {
        throw createError({
            statusCode: 500,
            // statusMessage: eror.message || 'Failed to fetch donor'
        });
    }
});