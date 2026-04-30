import prisma from '~~/server/utils/prisma';

;

export default defineEventHandler(async (event) => {   
    try {
        const grantorId = await getRouterParam(event, 'id');
        const body = await readBody(event);
        if(body.permissionLevel < 1){
            throw createError({
                statusCode:401,
                statusMessage:"User does not have permission to update grantors"
            })
        }
        const updatedGrantor = await prisma.grantor.update({
            where: { id:grantorId },
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
                boardMember:true
            } 
        });
        return{
            success: true,
            statusCode: 200,
            data: updatedGrantor,
            error:{code: ""}
        }
    } catch (error) {
       console.error(error);
        return { 
            success: false,
            statusCode: 500,
            message: "Failed to update grantor",
            error: error, 
            data:null
        }
    } finally {
        await prisma.$disconnect()
    }
});