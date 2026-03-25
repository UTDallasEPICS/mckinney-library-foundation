import prisma from '~~/server/utils/prisma'
import { requireSession } from "~~/server/utils/requireSession";

export default defineEventHandler(async (event) =>{
    const session = await requireSession(event, 1);
    try{
        const body = await readBody(event);
        const grantor = await prisma.grantor.create({
            data:{
                name: body.name,
                boardMemberId: session.user.id,
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
        return{
            success: true,
            statusCode: 200,
            data: grantor,
            error:{code: ""}
        }
    }catch(error){
        console.error(error);
        return { 
            success: false,
            statusCode: 500,
            message: "Failed to create grantor",
            error: error, 
            data: null
        }
    }finally{
        await prisma.$disconnect();
    }
});
