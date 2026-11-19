import prisma from '~~/server/utils/prisma'
import { writeAuditLog } from "~~/server/utils/auditLog";
import { requireSession } from "~~/server/utils/requireSession";

export default defineEventHandler (async (event)=>{   
    try{
        const session = await requireSession(event, 1);
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
        const updateDonation = await prisma.$transaction(async (tx) => {
            const previousDonation = await tx.donation.findUnique({
                where: { id },
                include: { donor: true, event: true },
            });

            if (!previousDonation) {
                throw createError({ statusCode: 404, statusMessage: "Donation not found" });
            }

            const eventName = typeof body.event === 'string' ? body.event.trim() : '';
            const matchedEvent = eventName
                ? await tx.event.findFirst({ where: { eventName } })
                : null;
            const donorName = body.donor?.trim() || "anonymous";
            let donorRecord = await tx.donor.findFirst({ where: { name: donorName } });

            if (!donorRecord) {
                donorRecord = await tx.donor.create({
                    data: {
                        name: donorName,
                        address: "",
                        email: "",
                        phone: "",
                        preferredCommunication: "",
                        notes: "",
                        boardMemberId: session.user.id,
                    },
                });
            }
            const receivedDate = body.receivedDate ? new Date(body.receivedDate) : null;
            const donation = await tx.donation.update({
                where: { id },
                data: {
                    boardMemberId: session.user.id,
                    donorId: donorRecord.id,
                    eventId: matchedEvent?.id ?? null,
                    method: body.method,
                    monetaryAmount: body.monetaryAmount,
                    nonMonetaryAmount: body.nonMonetaryAmount,
                    status: body.status,
                    notes: body.notes,
                    reason: body.reason,
                    receivedDate,
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
                },
            });

            await writeAuditLog(
                tx,
                session.user.id,
                "UPDATE",
                "DONATION",
                donation.id,
                {
                    donor: previousDonation.donor?.name ?? null,
                    event: previousDonation.event?.eventName ?? null,
                    method: previousDonation.method,
                    monetaryAmount: previousDonation.monetaryAmount,
                    nonMonetaryAmount: previousDonation.nonMonetaryAmount,
                    status: previousDonation.status == 1 ? "Received" : "Pending",
                    notes: previousDonation.notes,
                    reason: previousDonation.reason,
                    receivedDate: previousDonation.receivedDate?.toISOString() ?? null,
                },
                {
                    donor: donation.donor?.name ?? null,
                    event: donation.event?.eventName ?? null,
                    method: donation.method,
                    monetaryAmount: donation.monetaryAmount,
                    nonMonetaryAmount: donation.nonMonetaryAmount,
                    status: donation.status == 1 ? "Received" : "Pending",
                    notes: donation.notes,
                    reason: donation.reason,
                    receivedDate: donation.receivedDate?.toISOString() ?? null,
                },
            );

            return donation;
        });
        return {
            success: true,
            statusCode: 200,
            data: updateDonation,
            error: null
        }
    }catch(error){
        console.log("error",error)
        if (error && typeof error === "object" && "statusCode" in error) {
            throw error;
        }
        return{
            success: false,
            statusCode: 500,
            message: "Failed to update donation",
            error: error,
            data: null
        }
    }
})
