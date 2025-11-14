import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

export default defineEventHandler(async () =>{
    const data = await prisma.donation.findMany({
        include: { donor: true }
    });
    return data;
});