import prisma from '~~/server/utils/prisma'
import { writeAuditLog } from "~~/server/utils/auditLog";
import { requireSession } from "~~/server/utils/requireSession";

export default defineEventHandler(async (event) =>{
    try{
        const session = await requireSession(event, 1);
        const body = await readBody(event);
        const grantor = await prisma.$transaction(async (tx) => {
            const createdGrantor = await tx.grantor.create({
                data:{
                    name: body.name,
                    boardMemberId: body.boardMemberId,
                    email: body.email,
                    phone: body.phone,
                    address: body.address,
                    preferredCommunication: body.preferredCommunication,
                    notes: body.notes,
                    webLink: body.webLink,
                    organization: body.organization,
                    grants: body.grants
                },
                include: {
                    boardMember:true
                }
            });

            await writeAuditLog(
                tx,
                session.user.id,
                "CREATE",
                "GRANTOR",
                createdGrantor.id,
                {},
                {
                    name: createdGrantor.name,
                    email: createdGrantor.email,
                    phone: createdGrantor.phone,
                    organization: createdGrantor.organization,
                    preferredCommunication: createdGrantor.preferredCommunication,
                    address: createdGrantor.address,
                    notes: createdGrantor.notes,
                    webLink: createdGrantor.webLink,
                },
            );

            return createdGrantor;
        });
        return{
            success: true,
            statusCode: 200,
            data: grantor,
            error:{code: ""}
        }
    }catch(error){
        console.error(error);
        if (error && typeof error === "object" && "statusCode" in error) {
            throw error;
        }
        return { 
            success: false,
            statusCode: 500,
            message: "Failed to create grantor",
            error: error, 
            data: null
        }
    }
});
