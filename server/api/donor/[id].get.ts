import prisma from '~~/server/utils/prisma';

;

export default defineEventHandler(async (event) => {


    console.log("router reached")
    try {
        const id = getRouterParam(event, 'id');

        console.log("id found:", id);   
        const donor = await prisma.donor.findUnique({
            where: { id:id },
            include:{
                donations:true
            }
        });      
        return {
            success: true,
            statusCode: 200,
            data: donor, 
        }
    } catch (error) {
        console.error(error);
        return { 
            success: false,
            statusCode: 500,
            message: "Failed to fetch donor",
            error: error, 
        }
    } finally {
        await prisma.$disconnect()
    }
});