import prisma from '~~/server/utils/prisma'
import { requireSession } from "~~/server/utils/requireSession";


export default defineEventHandler(async (event) => {
    const session = await requireSession(event, 1);
    try {
        const body = await readBody(event);
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
                    boardMemberId: session.user.id
                }
            })
        }
        const grant = await prisma.grant.create({
            data: {
                boardMemberId: session.user.id,
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
