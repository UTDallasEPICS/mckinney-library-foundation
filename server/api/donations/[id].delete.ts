import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

export default defineEventHandler (async (event)=>{

    console.log("donation delete router reached")
    // const body = await readBody(event);


    const params = getRouterParams(event);

    const body = {
        id: params.id
    }
    console.log("body",body)

    try{
        // Perform role-based API checking here 
        // I.E., does the user have the permision to delete? 

        if(!body.id){
            throw createError({
                statusCode: 400,
                statusMessage: "A donationId is required to delete an ID"
            });
        }

        const deleted = await prisma.donation.delete({
            where: {id: body.id}
        });

        return{
            success: true,
            deleted 
        };
    }
    catch(error){


        console.log("error",error)
        return{
            success: false,
            statusCode: 500,
            message: "Failed to delete donation",
            error: error
        }
    }
})