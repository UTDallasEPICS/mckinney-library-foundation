import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {  
    try {
        const grantorId = await getRouterParam(event, 'id');
        const body = await readBody(event);
        if(body.permissionLevel < 1){
            throw createError({
                statusCode:401,
                statusMessage:"User does not have permission to delete grantors"
            })
        }
        const deletedGrantor = await prisma.grantor.delete({
            where: { id:grantorId }
        });
        return{
            success: true,
            statusCode: 200,
            data: deletedGrantor,
            error:{code: ""}
        }
    } catch (error) {
        console.error(error);
        return { 
            success: false,
            statusCode: 500,
            message: "Failed to delete grantor",
            error: error, 
            data: null
        }
    } finally {
        await prisma.$disconnect()
    }
});