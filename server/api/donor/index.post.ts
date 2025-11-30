import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) =>{
    try{
        const body = await readBody(event);
        if(body.permissionLevel < 1){
            throw createError({
                statusCode:401,
                statusMessage:"User does not have permission to create donors"
            })
        }
        const donor = await prisma.donor.create({
            data:{
                name:       body.name,
                email:      body.email,
                phone:      body.phone,
                address:    body.address,
                preferredCommunication: body.preferredCommunication,
                notes: body.notes,
                webLink: body.webLink,
                organization: body.organization,
                donations: body.donations
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