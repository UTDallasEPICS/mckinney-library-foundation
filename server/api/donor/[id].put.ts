import prisma from '~~/server/utils/prisma';

;

export default defineEventHandler(async (event) => {   
    try {
        const id = await getRouterParam(event, 'id');
        const body = await readBody(event);
        if(body.permissionLevel < 1){
            throw createError({
                statusCode:401,
                statusMessage:"User does not have permission to update donors"
            })
        }
        const updatedDonor = await prisma.donor.update({
            where: { id },
            data: {
                name: body.name,
                boardMemberId: body.boardMemberId,
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