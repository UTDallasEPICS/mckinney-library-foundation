import prisma from '~~/server/utils/prisma';
import { requireSession } from "~~/server/utils/requireSession";

export default defineEventHandler(async (event) => {  
    try {
        await requireSession(event, 1);
        const id = await getRouterParam(event, 'id');
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
