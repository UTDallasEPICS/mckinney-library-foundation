import prisma from "~~/server/utils/prisma";
import { writeAuditLog } from "~~/server/utils/auditLog";
import { requireSession } from "~~/server/utils/requireSession";

export default defineEventHandler(async (event) => {  
    try {
        const session = await requireSession(event, 1);
        const id = await getRouterParam(event, 'id');

        const deletedDonor = await prisma.$transaction(async (tx) => {
            const donor = await tx.donor.delete({
                where: { id: id }
            });

            await writeAuditLog(
                tx,
                session.user.id,
                "DELETE",
                "DONOR",
                donor.id,
                {
                    name: donor.name,
                    ...(donor.email?.trim() ? { email: donor.email.trim() } : {}),
                    ...(donor.phone?.trim() ? { phone: donor.phone.trim() } : {}),
                    ...(donor.organization?.trim() ? { organization: donor.organization.trim() } : {}),
                    ...(donor.preferredCommunication?.trim() ? { preferredCommunication: donor.preferredCommunication.trim() } : {}),
                    ...(donor.address?.trim() ? { address: donor.address.trim() } : {}),
                    ...(donor.notes?.trim() ? { notes: donor.notes.trim() } : {}),
                    ...(donor.webLink?.trim() ? { webLink: donor.webLink.trim() } : {}),
                },
                {},
            );

            return donor;
        });

        console.log("deleted donor:", deletedDonor);
        return {
            success: true,
            statusCode: 200,
            data: deletedDonor,
            error: { code: "" }
        };
    } catch (error) {
        console.error("some error", error);
        if (error && typeof error === "object" && "statusCode" in error) {
            throw error;
        }
        return { 
            success: false,
            statusCode: 500,
            message: "Failed to delete donor",
            error: error,
        };
    }
});