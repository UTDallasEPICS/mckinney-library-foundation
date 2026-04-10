import prisma from '~~/server/utils/prisma';
import { requireSession } from "~~/server/utils/requireSession";

;

export default defineEventHandler(async (event) => {   
    const session = await requireSession(event, 1);
    try {
        const id = event.context.params?.id;
        const body = await readBody(event);
        const updatedDonor = await prisma.donor.update({
            where: { id },
            data: {
                name: body.name,
                boardMemberId: session.user.id,
                email: body.email,
                phone: body.phone,
                address: body.address,
                preferredCommunication: body.preferredCommunication,
                notes: body.notes,
                webLink: body.webLink,
                organization: body.organization,
            },
            include: {
                boardMember:{
                    select:{
                        name:true
                    }
                }
            } 
        });
        return{
            success: true,
            statusCode: 200,
            data: updatedDonor,
        }
    } catch (error) {
       console.error(error);
        return { 
            success: false,
            statusCode: 500,
            message: "Failed to update donor",
            error: error, 
            data:null
        }
    } finally {
        await prisma.$disconnect()
    }
});
