import prisma from '~~/server/utils/prisma'
import { requireSession } from "~~/server/utils/requireSession";

export default defineEventHandler(async (event) =>{
    try{
        await requireSession(event, 2);
        const query = getQuery(event);
        const data = await prisma.emailLog.findMany({
            where: query.type ? { recipientType: String(query.type) } : {},
            include: {
                recipients: true,
                sender: { select: { name: true } },
            },
            orderBy: { sentAt: 'desc' }
        });
        return{
            success: true,
            statusCode: 200,
            data: data,
            error:{code: ""}
        }
    }catch(error){
        console.error(error);
        return {
            success: false,
            statusCode: 500,
            message: "Failed to get email history",
            error: error,
            data: null
        }
    }
});