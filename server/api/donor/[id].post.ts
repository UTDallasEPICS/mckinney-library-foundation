import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) =>{


    console.log('donor route reached');
    try{

        const body = await readBody(event);
        const donor = await prisma.donor.create({
            data:{
                name: body.name,
                    email: body.email,
                    phone: body.phone,
                    address: body.address,
                    preferredCommunication: body.preferredCommunication,
                    notes: body.notes,
                    webLink: body.webLink,
                    organization: body.organization,
                    lastDonationDate: new Date(body.lastDonationDate),
                    firstDonationDate: new Date(body.lastDonationDate),
                    donations: body.donations
            }       
        });
        return{
            success: true,
            statusCode: 200,
            data: donor,
        }
    }catch(error){
        console.error(error);
        return { 
            success: false,
            statusCode: 500,
            message: "Failed to create donor",
            error: error, 
        }
    }finally{
        await prisma.$disconnect();
    }
});