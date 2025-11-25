import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

export default defineEventHandler (async (event)=>{
    const body = await readBody(event);
    const id = await getRouterParam(event, 'id');
    if(body.status === 'pending'){ 
        body.status = 0
    } else { 
        body.status = 1
    }
    try{
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
            receivedDate: body.receivedDate,
            lastEditDate: new Date()
        }
    });
        return { success: true,
        statusCode: 200,
        data: updateDonation,
        }
    }catch(error){
        console.log("error",error)
        return{
            success: false,
            statusCode: 500,
            message: "Failed to update donation",
            error: error
        }
    }
})