import prisma from '~~/server/utils/prisma'
import { writeAuditLog } from "~~/server/utils/auditLog";
import { requireSession } from "~~/server/utils/requireSession";

export default defineEventHandler(async (event) => {
    try {
        const session = await requireSession(event, 1);
        const body = await readBody(event);
        const grant = await prisma.$transaction(async (tx) => {
            let grantorRecord = await tx.grantor.findFirst({
                where: { name: body.grantor }
            });
            if (!grantorRecord) {
                grantorRecord = await tx.grantor.create({
                    data: {
                        name: body.grantor ? body.grantor : "Anonymous",
                        address: "",
                        email: "",
                        phone: "",
                        preferredCommunication: "",
                        notes: "",
                        boardMemberId: body.boardMemberId
                    }
                });
            }

            const createdGrant = await tx.grant.create({
                data: {
                    boardMemberId: body.boardMemberId,
                    grantorId: grantorRecord.id,
                    purpose: body.purpose,
                    method: body.method,
                    monetaryAmount: body.monetaryAmount,
                    nonMonetaryAmount: body.nonMonetaryAmount,
                    status: Number(body.status),
                    reimburse: body.reimburse,
                    notes: body.notes,
                    proposedDate: body.proposedDate ? new Date(body.proposedDate) : null,
                    receivedDate: new Date(body.receivedDate),
                    lastEditDate: new Date(),
                },
                include: {
                    boardMember: true,
                    grantor: true,
                }
            });

            await writeAuditLog(
                tx,
                session.user.id,
                "CREATE",
                "GRANT",
                createdGrant.id,
                {},
                {
                    grantor: createdGrant.grantor?.name || "Anonymous",
                    purpose: createdGrant.purpose,
                    method: createdGrant.method,
                    monetaryAmount: createdGrant.monetaryAmount,
                    nonMonetaryAmount: createdGrant.nonMonetaryAmount,
                    status: createdGrant.status == 1 ? "Completed" : "Requested",
                    reimburse: createdGrant.reimburse,
                    notes: createdGrant.notes,
                    proposedDate: createdGrant.proposedDate?.toISOString() ?? null,
                    receivedDate: createdGrant.receivedDate?.toISOString() ?? null,
                },
            );

            return createdGrant;
        });

        return { 
            success: true,
            statusCode: 200,
            data: grant, 
            error:{code: ""}
        }
        
    } catch (error) {
        console.error(error);
        if (error && typeof error === "object" && "statusCode" in error) {
            throw error;
        }
        return { 
            success: false,
            statusCode: 500,
            message: "Failed to create grants",
            error: error, 
            data: null
        }
    }
});
