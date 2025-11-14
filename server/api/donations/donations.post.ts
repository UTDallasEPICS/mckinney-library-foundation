import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) =>{
    const body = await readBody(event);
    await prisma.donation.create({
        data:{
            boardMemberId: body.boardMemberId,
            boardMember: body.boardMember,
            donorId: body.donorId,
            donor: body.donor,
            event: body.event,
            method: body.method,
            monetaryAmount: body.monetaryAmount,
            nonMonetaryAmount: body.nonMonetaryAmount,
            status: body.status,
            notes: body.notes,
            receivedDate: body.receivedDate,
            lastEditDate: body.lastEditDate,
        }
         });
});