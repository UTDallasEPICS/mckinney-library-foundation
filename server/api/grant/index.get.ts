import prisma from "~~/server/utils/prisma"
import { requireSession, filterSensitiveFields } from "~~/server/utils/requireSession"

export default defineEventHandler(async (event) => {

    const session = await requireSession(event, 0);
    try {        
        const grants = await prisma.grant.findMany({
            include: {
                boardMember:{
                    select:{
                        name:true
                    }
                },
                grantor: {
                    select:{
                        name:true
                    }
                },
            }
        });
        const filtered = grants.map((g) =>
            filterSensitiveFields(g, session.user.permission, ['notes'])
        );
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
            message: "Failed to fetch grants",
            error: error, 
            data: []
        }
    }
});
