import prisma from '~~/server/utils/prisma'
import { auth } from '~~/server/utils/auth'

export default defineEventHandler (async (event)=>{   
    try{
        const body = await readBody(event);
        const session = await auth.api.getSession({ headers: event.headers });
        if (!session?.user) {
            return {
                success: false,
                statusCode: 401,
                message: 'Unauthorized',
                error: { code: 'UNAUTHORIZED' },
                data: null,
            };
        }

        const currentUser = session.user as { id: string; permission?: number };
        const permissionLevel = Number(currentUser.permission ?? 0);
        const id = await getRouterParam(event,'id');
        if(!id){
            throw createError({
                statusCode: 400,
                statusMessage: "A donationId is required to update a donation"
            });
        }
        if(permissionLevel < 1){
            return {
                success: false,
                statusCode: 403,
                message: 'User does not have permission to update donations',
                error: { code: 'FORBIDDEN' },
                data: null,
            };
        }
        if(!body.monetaryAmount && !body.nonMonetaryAmount){
            throw createError({
                statusCode: 400,
                statusMessage: "The donation requires a monetary or non-monetary value"
            });
        }
        const eventName = typeof body.event === 'string' ? body.event.trim() : '';
        const matchedEvent = eventName
            ? await prisma.event.findFirst({
                where: {
                    eventName,
                },
            })
            : null;
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
                boardMemberId: currentUser.id
                }
            })
            }


        const updateDonation = await prisma.donation.update({
            where: { id:id },
            data: {
                boardMemberId: currentUser.id,
                donorId: donorRecord.id,
                eventId: matchedEvent?.id ?? null,
                method: body.method,
                monetaryAmount: body. monetaryAmount,
                nonMonetaryAmount: body.nonMonetaryAmount,
                status: body.status,
                notes: body.notes,
                reason: body.reason,
                receivedDate: new Date(body.receivedDate),
                lastEditDate: new Date(),
            },
            include: {
                event: {
                    select: {
                        eventName: true,
                        eventDate: true,
                    }
                },
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