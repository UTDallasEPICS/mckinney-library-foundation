import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

export default defineEventHandler (async (event)=>{   
    try{
        const body = await readBody(event);
        // Perform role-based API checking here 
        // I.E., does the user have the permision to update?
        if(!body.id){
            throw createError({
                statusCode: 400,
                statusMessage: "A donationId is required to update a donation"
            });
        }
        if(!body.monetaryAmount && !body.nonMonetaryAmount){
            throw createError({
                statusCode: 400,
                statusMessage: "The donation requires a monetary or non-monetary value"
            });
        }
        const updateDonation = await prisma.donation.update({
            where: { id: body.id },
            data: {
                boardMemberId: body.boardMemberId,
                donorId: body.donorId,
                event: body.event,
                method: body.method,
                monetaryAmount: body. monetaryAmount,
                nonMonetaryAmount: body.nonMonetaryAmount,
                status: body.status ?? 0,
                notes: body.notes,
                receivedDate: body.receivedDate,
                lastEditDate: new Date()
            }
        });
        return {
            success: true,
            statusCode: 200,
            data: updateDonation,
        }
    }
    catch(error){
        return{
            success: false,
            statusCode: 500,
            message: "Failed to update donation",
            error: error
        }
    }finally{
        await prisma.$disconnect();
    }
})