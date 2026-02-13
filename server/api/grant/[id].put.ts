//[id].put.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        const grantId = getRouterParam(event, 'id');
        const body = await readBody(event);
        if(body.permissionLevel < 1){
            throw createError({
                statusCode:401,
                statusMessage:"User does not have permission to update grants"
            })
        }
        const grant = await prisma.grant.update({
            where: { id: grantId },
            data: {
                boardMemberId: body.boardMemberId,
                grantorId: body.grantorId,
                purpose: body.purpose,
                method: body.method,
                monetaryAmount: body.monetaryAmount,
                nonMonetaryAmount: body.nonMonetaryAmount,
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