
import prisma from "~~/server/utils/prisma"
import { requireSession } from "~~/server/utils/requireSession"

// only authenticated viewers+ can reach this
export default defineEventHandler(async (event) => {

    const session = await requireSession(event, 0);
    const redactFields = <T extends Record<string, any>>(record: T, fields: string[]) => {
        if (session.user.permission >= 1) return record;
        const copy = { ...record } as Record<string, any>;
        fields.forEach((field) => delete copy[field]);
        return copy as T;
    };
    try{
        const data = await prisma.donor.findMany({
            include:{
                donations:{
                    orderBy:{
                        receivedDate: 'asc'
                    }
                },
                boardMember:{
                    select:{
                        name:true
                    }
                }
            }
        });
        const filtered = data.map((d) =>
            redactFields(d, ['email','phone','address','notes','webLink'])
        );
        return{
            success: true,
            statusCode: 200,
            data: filtered,
        }
    }catch(error){
        console.error(error);
        return { 
            success: false,
            statusCode: 500,
            message: "Failed to get donors",
            error: error, 
            data:null
        }
    }
});
