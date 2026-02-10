import prisma from '~~/server/utils/prisma';

export default defineEventHandler(async (event) => {  
    try {
        const id = await getRouterParam(event, 'id');
        const body = await readBody(event);
        if(body.permissionLevel < 1){
            throw createError({
                statusCode:401,
                statusMessage:"User does not have permission to delete donors"
            })
        }
        const deletedDonor = await prisma.donor.delete({
            where: { id:id }
        });

        console.log("deleted donor:", deletedDonor);
        return{
            success: true,
            statusCode: 200,
            data: deletedDonor,
            error:{code: ""}
        }
    } catch (error) {
        console.error("some error",error);
        return { 
            success: false,
            statusCode: 500,
            message: "Failed to delete donor",
            error: error, 
        }
    } finally {
        await prisma.$disconnect()
    }
});