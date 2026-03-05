import { getRouterParam } from "h3"
import prisma from "~~/server/utils/prisma"
import { requireSession, filterSensitiveFields } from "~~/server/utils/requireSession"

export default defineEventHandler(async (event) => {

    const user = await requireSession(event, 0);
    try {
        const id = getRouterParam(event, 'id');
        const donor = await prisma.donor.findUnique({
            where: { id:id },
            include:{
                donations:true
            }
        });      
        const filtered = donor
            ? filterSensitiveFields(donor, user.permission, ['email','phone','address','notes','webLink'])
            : donor;
        return {
            success: true,
            statusCode: 200,
            data: filtered, 
        }
    } catch (error) {
        console.error(error);
        return { 
            success: false,
            statusCode: 500,
            message: "Failed to fetch donor",
            error: error, 
        }
    }
});