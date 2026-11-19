import prisma from '~~/server/utils/prisma'
import { writeAuditLog } from "~~/server/utils/auditLog";
import { requireSession } from "~~/server/utils/requireSession";

export default defineEventHandler (async (event)=>{
    try{
        const session = await requireSession(event, 1);

        const id = event.context.params?.id;
        if(!id){
            throw createError({
                statusCode: 400,
                statusMessage: "A donationId is required to delete an ID"
            });
        }
        const deleted = await prisma.$transaction(async (tx) => {
            const donation = await tx.donation.delete({
                where: { id },
                include: { donor: true, event: true },
            });
          
            await writeAuditLog(
                tx,
                session.user.id,
                "DELETE",
                "DONATION",
                donation.id,
                {
                    donor: donation.donor?.name ?? null,
                    event: donation.event?.eventName ?? null,
                    method: donation.method,
                    monetaryAmount: donation.monetaryAmount,
                    nonMonetaryAmount: donation.nonMonetaryAmount,
                    status: donation.status === 1 ? "Received" : "Pending",
                    notes: donation.notes,
                    reason: donation.reason,
                    receivedDate: donation.receivedDate?.toISOString() ?? null,
                },
                {},
            );

            return donation;
        });
        return{
            success: true,
            deleted 
        };
    }
    catch(error){
        console.log("error",error)
        return{
            success: false,
            statusCode: 500,
            message: "Failed to delete donation",
            error: error
        }
    }
})
