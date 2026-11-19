import prisma from '~~/server/utils/prisma'
import { writeAuditLog } from "~~/server/utils/auditLog";
import { requireSession } from "~~/server/utils/requireSession";

export default defineEventHandler(async (event) => {
    try {
        const session = await requireSession(event, 1);
        const grantId = await getRouterParam(event, 'id');
        const grant = await prisma.$transaction(async (tx) => {
            const deletedGrant = await tx.grant.delete({
                where: { id: grantId },
                include: { grantor: true }
            });

            await writeAuditLog(
                tx,
                session.user.id,
                "DELETE",
                "GRANT",
                deletedGrant.id,
                {
                    grantor: deletedGrant.grantor?.name ?? null,
                    purpose: deletedGrant.purpose,
                    method: deletedGrant.method,
                    monetaryAmount: deletedGrant.monetaryAmount,
                    nonMonetaryAmount: deletedGrant.nonMonetaryAmount,
                    status: deletedGrant.status === 1 ? "Completed" : "Requested",
                    reimburse: deletedGrant.reimburse,
                    notes: deletedGrant.notes,
                    proposedDate: deletedGrant.proposedDate?.toISOString() ?? null,
                    receivedDate: deletedGrant.receivedDate?.toISOString() ?? null,
                },
                {},
            );

            return deletedGrant;
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
            message: "Failed to delete grant",
            error: error, 
            data: null
        }
    }
});
