import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {  
    
    console.log("route reached")
    try {
        // const id = getRouterParam(event, 'id');


        
        const body = await readBody(event);
        console.log("id found:", body); 
        const id = body.donorId

        console.log('body',body)

        console.log("body:", body); 
        const updatedDonor = await prisma.donor.update({
            where: { id },
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



        console.log("updatedDonor:", updatedDonor);
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