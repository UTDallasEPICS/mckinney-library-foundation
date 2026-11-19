import prisma from '~~/server/utils/prisma';
import { writeAuditLog } from "~~/server/utils/auditLog";
import { requireSession } from "~~/server/utils/requireSession";

export default defineEventHandler(async (event) => {
    try {
        const session = await requireSession(event, 1);
        const grantorId = await getRouterParam(event, "id");
        const body = await readBody(event);

        const updatedGrantor = await prisma.$transaction(async (tx) => {
            const previousGrantor = await tx.grantor.findUnique({
                where: { id: grantorId }
            });

            if (!previousGrantor) {
                return {
                    success: false,
                    statusCode: 404,
                    message: "Grantor not found",
                    data: null
                };
            }

            const grantor = await tx.grantor.update({
                where: { id: grantorId },
                data: {
                    name: body.name,
                    boardMemberId: body.boardMemberId,
                    email: body.email,
                    phone: body.phone,
                    address: body.address,
                    preferredCommunication: body.preferredCommunication,
                    notes: body.notes,
                    webLink: body.webLink,
                    organization: body.organization
                },
                include: {
                    boardMember: true
                }
            });

            await writeAuditLog(
                tx,
                session.user.id,
                "UPDATE",
                "GRANTOR",
                grantor.id,
                {
                    name: previousGrantor.name,
                    email: previousGrantor.email,
                    phone: previousGrantor.phone,
                    address: previousGrantor.address,
                    preferredCommunication: previousGrantor.preferredCommunication,
                    notes: previousGrantor.notes,
                    webLink: previousGrantor.webLink,
                    organization: previousGrantor.organization,
                },
                {
                    name: grantor.name,
                    email: grantor.email,
                    phone: grantor.phone,
                    address: grantor.address,
                    preferredCommunication: grantor.preferredCommunication,
                    notes: grantor.notes,
                    webLink: grantor.webLink,
                    organization: grantor.organization,
                },
            );

            return grantor;
        });

        return {
            success: true,
            statusCode: 200,
            data: updatedGrantor,
            error: { code: "" }
        };
    } catch (error) {
        console.error(error);
        if (error && typeof error === "object" && "statusCode" in error) {
            throw error;
        }
        return {
            success: false,
            statusCode: 500,
            message: "Failed to update grantor",
            error: error,
            data: null
        };
    }
});
