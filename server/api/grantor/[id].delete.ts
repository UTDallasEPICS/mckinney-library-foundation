import prisma from '~~/server/utils/prisma'
import { requireSession } from "~~/server/utils/requireSession";

export default defineEventHandler(async (event) => {  
    await requireSession(event, 1);
    try {
        const grantorId = event.context.params?.id;
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
