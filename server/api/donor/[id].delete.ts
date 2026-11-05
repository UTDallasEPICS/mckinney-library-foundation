import { requireSession } from "~~/server/utils/requireSession";

export default defineEventHandler(async (event) => {  
    try {
        const session = await requireSession(event, 1);
        const id = await getRouterParam(event, 'id');

        const deletedDonor = await prisma.$transaction(async (tx) => {
            const donor = await tx.donor.delete({
                where: { id: id }
            });

            await tx.auditLog.create({
                data: {
                    userId: session.user.id,
                    action: "DELETE",
                    recordType: "DONOR",
                    recordId: donor.id,
                    snapshot: {
                        before: {
                            name: donor.name
                        },
                        after: {}
                    }
                }
            });

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
        return { 
            success: false,
            statusCode: 500,
            message: "Failed to delete donor",
            error: error,
        };
    }
});