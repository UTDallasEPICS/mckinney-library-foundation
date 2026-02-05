import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        if(body.permissionLevel < 1){
            throw createError({
                statusCode:401,
                statusMessage:"User does not have permission to create grants"
            })
        }
        let grantorRecord = await prisma.grantor.findFirst({
            where:{
                name:body.grantor
            }
        })
        if(!grantorRecord){
            grantorRecord = await prisma.grantor.create({
                data:{
                    name: body.grantor? body.grantor : "Anonymous",
                    address: "",
                    email: "",
                    phone: "",
                    preferredCommunication: "",
                    notes: "",
                    boardMemberId: body.boardMemberId
                }
            })
        }
        const grant = await prisma.grant.create({
            data: {
                boardMemberId: body.boardMemberId,
                grantorId: grantorRecord.id,
                purpose: body.purpose,
                method: body.method,
                monetaryAmount: body.monetaryAmount,
                nonMonetaryAmount: body.nonMonetaryAmount,
                notes: body.notes,
                proposedDate: body.proposedDate ? new Date(body.proposedDate) : null,
                receivedDate: new Date(body.receivedDate),
                lastEditDate: new Date(),
            },
            include: {
                boardMember: true,
                grantor: true,
            }
        })

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
            message: "Failed to create grants",
            error: error, 
            data: null
        }
    } finally {
        await prisma.$disconnect()
    }
});