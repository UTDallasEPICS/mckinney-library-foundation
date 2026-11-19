import prisma from '~~/server/utils/prisma'
import { writeAuditLog } from "~~/server/utils/auditLog";
import { requireSession } from "~~/server/utils/requireSession";
import { z } from "zod";

const fileSchema = z
  .file()
  .min(1, "File cannot be empty")
  .max(2 * 1024 * 1024)
  .mime(["image/webp", "image/jpg", "image/png", "application/pdf"], {
    message: "Invalid file type (PDF/JPG/PNG/WEBP only)",
  });

export default defineEventHandler(async (event) => {
    try {
        const session = await requireSession(event, 1);
        const grantId = getRouterParam(event, 'id');
        const body = await readBody(event);
        if (!body.proposedDate && !body.receivedDate) {
            throw createError({
                statusCode: 400,
                statusMessage: "The grant requires a proposed or received date",
            });
        }
        const grant = await prisma.$transaction(async (tx) => {
            const previousGrant = await tx.grant.findUnique({
                where: { id: grantId },
                include: { grantor: true }
            });

            if (!previousGrant) {
                throw createError({ statusCode: 404, statusMessage: "Grant not found" });
            }

            const updatedGrant = await tx.grant.update({
                where: { id: grantId },
                data: {
                    boardMemberId: body.boardMemberId,
                    grantorId: body.grantorId,
                    purpose: body.purpose,
                    method: body.method,
                    monetaryAmount: body.monetaryAmount,
                    nonMonetaryAmount: body.nonMonetaryAmount,
                    status: body.status,
                    reimburse: body.reimburse,
                    notes: body.notes,
                    proposedDate: body.proposedDate ? new Date(body.proposedDate) : null,
                    receivedDate: body.receivedDate ? new Date(body.receivedDate) : null,
                },
                include: {
                    boardMember: true,
                    grantor: true,
                }
            });

            const snapshotDate = (date: Date | null) => date?.toISOString() ?? null;
            await writeAuditLog(
                tx,
                session.user.id,
                "UPDATE",
                "GRANT",
                updatedGrant.id,
                {
                    grantor: previousGrant.grantor?.name ?? null,
                    purpose: previousGrant.purpose,
                    method: previousGrant.method,
                    monetaryAmount: previousGrant.monetaryAmount,
                    nonMonetaryAmount: previousGrant.nonMonetaryAmount,
                    status: previousGrant.status == 1 ? "Completed" : "Requested",
                    reimburse: previousGrant.reimburse,
                    notes: previousGrant.notes,
                    proposedDate: snapshotDate(previousGrant.proposedDate),
                    receivedDate: snapshotDate(previousGrant.receivedDate),
                },
                {
                    grantor: updatedGrant.grantor?.name ?? null,
                    purpose: updatedGrant.purpose,
                    method: updatedGrant.method,
                    monetaryAmount: updatedGrant.monetaryAmount,
                    nonMonetaryAmount: updatedGrant.nonMonetaryAmount,
                    status: updatedGrant.status == 1 ? "Completed" : "Requested",
                    reimburse: updatedGrant.reimburse,
                    notes: updatedGrant.notes,
                    proposedDate: snapshotDate(updatedGrant.proposedDate),
                    receivedDate: snapshotDate(updatedGrant.receivedDate),
                },
            );

            return updatedGrant;
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
            message: "Failed to update grant",
            error: error, 
            data: null
        }
    }
});
