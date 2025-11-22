import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

export default defineEventHandler (async (event)=>{

    console.log("hi there this route was reaached")
    const body = await readBody(event);

    console.log("body:", body);


    if(body.status === 'pending'){ 
        body.status = 0
    } else { 
        body.status = 1
    }

    const donationId = body?.donationId

    try{
        

const updateDonation = await prisma.donation.update({
where: { id: donationId },
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

console.log("update maybe worked",updateDonation)
    }
    catch(error){
        console.log("error",error)
        return{
            success: false,
            statusCode: 500,
            message: "Failed to update donation",
            error: error
        }
    }
})