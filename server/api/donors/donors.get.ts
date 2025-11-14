import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

export default defineEventHandler(async () =>{
    const data = await prisma.donor.findMany({
       // include: { donations: true },
       // orderBy: {lastDonationDate: 'desc'}
         include: {
            donations: {
                orderBy: { receivedDate: 'desc' },
        }}
    });
    return data;
});

// --- IGNORE ---