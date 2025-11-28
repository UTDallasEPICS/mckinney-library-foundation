import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

export default defineEventHandler (async (event)=>{   
    try{
        const body = await readBody(event);
        const id = await getRouterParam(event,'id');
        if(!id){
            throw createError({
                statusCode: 400,
                statusMessage: "A donationId is required to update a donation"
            });
        }
        if(body.permissionLevel < 1){
            throw createError({
                statusCode:401,
                statusMessage:"User does not have permission to update donations"
            })
        }
        if(!body.monetaryAmount && !body.nonMonetaryAmount){
            throw createError({
                statusCode: 400,
                statusMessage: "The donation requires a monetary or non-monetary value"
            });
        }
        const updateDonation = await prisma.donation.update({
            where: { id: id },
            data: {
                boardMemberId: body.boardMemberId,
                donorId: body.donorId,
                event: body.event,
                method: body.method,
                monetaryAmount: body. monetaryAmount,
                nonMonetaryAmount: body.nonMonetaryAmount,
                status: body.status ?? 0,
                notes: body.notes,
                receivedDate: new Date(body.receivedDate),
                lastEditDate: new Date()
            }
        });
        const fullDonation = await prisma.donation.findUnique({
            where: { id:id },
            include:{
                donor:true,
                boardMember:{
                    select:{
                        name:true
                    }
                }
            }
        });
        return {
            success: true,
            statusCode: 200,
            data: fullDonation,
        }
    }
    catch(error){
        return{
            success: false,
            statusCode: 500,
            message: "Failed to update donation",
            error: error,
            data: null
        }
    }finally{
        await prisma.$disconnect();
    }
})