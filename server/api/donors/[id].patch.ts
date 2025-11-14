import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');
    const body = await readBody(event);
    
    try {
        const updatedDonor = await prisma.donor.update({
            where: { id },
            data: {
                name: body.name,
                email: body.email,
                phone: body.phone,
                address: body.address,
                preferredCommunication: body.preferredCommunication,
                notes: body.notes,
                webLink: body.webLink,
                organization: body.organization,
                lastDonationDate: body.lastDonationDate,
                firstDonationDate: body.firstDonationDate
            }
        });
        
        return updatedDonor;
    } catch (err) {
        throw createError({
            statusCode: 500,
            // statusMessage: err.message || 'Failed to update donor'
        });
    }
});