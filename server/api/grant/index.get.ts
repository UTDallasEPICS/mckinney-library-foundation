import prisma from "~~/server/utils/prisma"
import { requireSession } from "~~/server/utils/requireSession"

export default defineEventHandler(async (event) => {

    const session = await requireSession(event, 0);
    const redactFields = <T extends Record<string, any>>(record: T, fields: string[]) => {
        if (session.user.permission >= 1) return record;
        const copy = { ...record } as Record<string, any>;
        fields.forEach((field) => delete copy[field]);
        return copy as T;
    };
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
            redactFields(g, ['notes'])
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
