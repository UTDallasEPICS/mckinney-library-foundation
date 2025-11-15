import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);

        const grant = await prisma.grant.create({
            data: {
                boardMemberId: body.boardMemberId,
                grantorId: body.grantorId,
                purpose: body.purpose,
                method: body.method,
                monetaryAmount: body.monetaryAmount,
                nonMonetaryAmount: body.nonMonetaryAmount,
                notes: body.notes,
                proposedDate: new Date(body.proposedDate),
                startDate: new Date(body.startDate),
                endDate: new Date(body.endDate),
                lastEditDate: new Date(body.proposedDate),
            }
        })

        return { 
            success: true,
            statusCode: 200,
            data: grant, 
        }
        
    } catch (error) {
        console.error(error);
        return { 
            success: false,
            statusCode: 500,
            message: "Failed to create grants",
            error: error, 
        }
    } finally {
        await prisma.$disconnect()
    }
});