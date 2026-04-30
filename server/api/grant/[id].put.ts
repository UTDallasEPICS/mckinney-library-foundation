import prisma from '~~/server/utils/prisma'
import { requireSession } from "~~/server/utils/requireSession";



export default defineEventHandler(async (event) => {
    try {
        await requireSession(event, 1);
        const grantId = getRouterParam(event, 'id');
        const body = await readBody(event);
        const grant = await prisma.grant.update({
            where: { id: grantId },
            data: {
                boardMemberId: body.boardMemberId,
                grantorId: body.grantorId,
                purpose: body.purpose,
                method: body.method,
                monetaryAmount: body.monetaryAmount,
                nonMonetaryAmount: body.nonMonetaryAmount,
                reimburse: body.reimburse,
                notes: body.notes,
                proposedDate: body.proposedDate ? new Date(body.proposedDate) : null,
                receivedDate: new Date(body.receivedDate),
            },
            include: {
                boardMember: true,
                grantor: true,
            }
        });

        return { 
            success: true,
            statusCode: 200,
            data: grant,
            error:{code: ""}
        }
    } catch (error) {
        console.error(error);
        return { 
            success: false,
            statusCode: 500,
            message: "Failed to update grant",
            error: error, 
            data: null
        }
    } finally {
        await prisma.$disconnect()
    }
});
