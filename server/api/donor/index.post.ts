import prisma from '~~/server/utils/prisma'
import { requireSession } from "~~/server/utils/requireSession";

export default defineEventHandler(async (event) =>{
    try{
        await requireSession(event, 1);
        const body = await readBody(event);
        const donor = await prisma.donor.create({
            data:{
                name:       body.name,
                boardMemberId: body.boardMemberId,
                email:      body.email,
                phone:      body.phone,
                address:    body.address,
                preferredCommunication: body.preferredCommunication,
                notes: body.notes,
                webLink: body.webLink,
                isAuthor: body.isAuthor,
                organization: body.organization,
                donations: body.donations
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
            data: donor,
            error: {code: ""}
        }
    }catch(error){
        console.error(error);
        return { 
            success: false,
            statusCode: 500,
            message: "Failed to create donor",
            error: error, 
            data:null
        }
    }finally{
        await prisma.$disconnect();
    }
});
