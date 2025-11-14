import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) =>{
    const body = await readBody(event);
    await prisma.donor.create({
        data:{
             name: body.name,
                email: body.email,
                phone: body.phone,
                address: body.address,
                preferredCommunication: body.preferredCommunication,
                notes: body.notes,
                webLink: body.webLink,
                organization: body.organization,
                lastDonationDate: body.lastDonationDate,
                firstDonationDate: body.firstDonationDate,
                donations: body.donations
         }       
     });
});