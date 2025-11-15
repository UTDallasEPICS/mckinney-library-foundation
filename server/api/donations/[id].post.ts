import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

export default defineEventHandler (async (event)=>{
    const body = await readBody(event);

    try{
        // Perform role-based API checking here 
        // I.E., does the user have the permision to create?

        if(!body.monetaryAmount && !body.nonMonetaryAmount){
            throw createError({
                statusCode: 400,
                statusMessage: "The donation requires a monetary or non-monetary value"
            });
        }
                        
        const donation = await prisma.donation.create({
            data: {
                boardMemberId: body.boardMemberId,
                donorId: body.donorId,
                event: body.event,
                method: body.method,
                monetaryAmount: body. monetaryAmount,
                nonMonetaryAmount: body.nonMonetaryAmount,
                status: body.status ?? 0,
                notes: body.notes,
                receivedDate: new Date(),
                lastEditDate: new Date()
            }
        });

        return { 
            success: true
        };
    }
    catch(error){
        return{
            success: false,
            statusCode: 500,
            message: "Failed to create donation",
            error: error
        }
    };
})