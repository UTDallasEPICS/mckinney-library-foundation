import prisma from '~~/server/utils/prisma'
import { requireSession } from "~~/server/utils/requireSession";

export default defineEventHandler (async (event)=>{   
    const session = await requireSession(event, 1);
    try{
        const body = await readBody(event);
        const id = event.context.params?.id;
        if(!id){
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
        let donorRecord = await prisma.donor.findFirst({
            where: {
                name: body.donor? body.donor : "anonymous"
            }
            })

            if (!donorRecord) {      
            donorRecord = await prisma.donor.create({
                data: {
                name: body.donor? body.donor: "anonymous",
                address: "",
                email: "",
                phone: "",
                preferredCommunication: "",
                notes: "",
                boardMemberId: session.user.id
                }
            })
            }
        const updateDonation = await prisma.donation.update({
            where: { id:id },
            data: {
                boardMemberId: session.user.id,
                donorId: donorRecord.id,
                event: body.event,
                method: body.method,
                monetaryAmount: body. monetaryAmount,
                nonMonetaryAmount: body.nonMonetaryAmount,
                status: body.status,
                notes: body.notes,
                reason: body.reason,
                receivedDate: new Date(body.receivedDate),
                lastEditDate: new Date()
            },
            include: {
                donor: true,
                boardMember:{
                    select:{
                        name:true
                    }
                }
            }
        })
        return {
            success: true,
            statusCode: 200,
            data: updateDonation,
            error: null
        }
    }catch(error){
        console.log("error",error)
        return{
            success: false,
            statusCode: 500,
            message: "Failed to update donation",
            error: error,
            data: null
        }
    }
})
