import { getRouterParam } from "h3"
import prisma from "~~/server/utils/prisma"
import { requireSession, filterSensitiveFields } from "~~/server/utils/requireSession"

export default defineEventHandler(async (event) => {
    
    const user = await requireSession(event, 0);
    try {
        const grantorId = getRouterParam(event, 'id');
        const grantor = await prisma.grantor.findUnique({
            where: { id:grantorId }
        });      
        const filtered = grantor
            ? filterSensitiveFields(grantor, user.permission, ['email','phone','address','notes','webLink'])
            : grantor;
        return {
            success: true,
            statusCode: 200,
            data: filtered, 
            error:{code: ""}
        }
    } catch (error) {
        console.error(error);
        return { 
            success: false,
            statusCode: 500,
            message: "Failed to fetch grantor",
            error: error, 
            data: null
        }
    }
});