import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
        let donations = await prisma.donation.findMany({
            where:{donorId:id}
        })

        

        const sortedItems = donations.toSorted((a, b) => {
            if (a.receivedDate === null && b.receivedDate === null) {
                return 0; 
            }
            if (a.receivedDate === null) {
                return 1; 
            }
            if (b.receivedDate === null) {
                return -1; 
            }
            return a.receivedDate.getTime() - b.receivedDate.getTime();
        });

        const updatedDonor = await prisma.donor.update({
            where: { id },
            data: {
                name: body.name,
                email: body.email,
                phone: body.phone,
                address: body.address,
                preferredCommunication: body.preferredCommunication,
                notes: body.notes,
                webLink: body.webLink,
                organization: body.organization,
                firstDonationDate: sortedItems[0].receivedDate,
                lastDonationDate: sortedItems[sortedItems.length-1].receivedDate
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