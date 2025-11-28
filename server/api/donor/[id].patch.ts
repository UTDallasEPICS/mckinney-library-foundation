import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {  
    try {
        const id = getRouterParam(event, 'id');
        const body = await readBody(event);
         if(body.permissionLevel < 1){
            throw createError({
                statusCode: 401,
                statusMessage:"User not authorized to edit donors"
            })
        }
        const updatedDonor = await prisma.donor.update({
            where: { id:id },
            data: {
                name: body.name,
                email: body.email,
                phone: body.phone,
                address: body.address,
                preferredCommunication: body.preferredCommunication,
                notes: String(body.notes),
                webLink: body.webLink,
                organization: body.organization,
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
        }
    } finally {
        await prisma.$disconnect()
    }
});